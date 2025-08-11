import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/Dialogue";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";
import { registerUser } from "../../../../api/auth";
import { uploadStudents } from "../../../../api/school";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/Form";
import { PasswordInput } from "../../../../components/ui/PasswordInput";
import { Checkbox } from "../../../../components/ui/Checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../../components/ui/Select";
import { Loader2 } from "lucide-react";
import { Country, State, City } from "country-state-city";

interface AddSingleStudentDialogProps {
  onSuccess?: () => void;
}

const containsUrl = (text: string): boolean => {
  if (!text) return false;
  const urlRegex = /(https?:\/\/|www\.)[^\s]+/i;
  return urlRegex.test(text);
};

const singleStudentFormSchema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters long" })
      .refine((val) => !containsUrl(val), {
        message: "First name cannot contain URLs",
      }),
    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters long" })
      .refine((val) => !containsUrl(val), {
        message: "Last name cannot contain URLs",
      }),
    email: z
      .string()
      .min(1, { message: "Please enter student's email" })
      .email({ message: "Invalid email address" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .refine((val) => !containsUrl(val), {
        message: "Phone number cannot contain URLs",
      }),
    student_number: z
      .string()
      .optional()
      .refine((val) => !containsUrl(val || ""), {
        message: "Student ID cannot contain URLs",
      }),
    country: z.string().min(1, { message: "Please select a country" }),
    state: z.string().min(1, { message: "Please select a state" }),
    city: z.string().min(1, { message: "Please enter your city" }),
    gender: z.enum(["Male", "Female"], {
      errorMap: () => ({ message: "Please select a gender" }),
    }),
    ageRange: z.string().min(1, { message: "Please select an age range" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(1, { message: "Please confirm password" }),
    referred_by: z
      .string()
      .optional()
      .refine((val) => !containsUrl(val || ""), {
        message: "Referral code cannot contain URLs",
      }),
    hasDisability: z.boolean(),
    disabilityDetails: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (
        data.hasDisability &&
        (!data.disabilityDetails || data.disabilityDetails.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please specify disability details",
      path: ["disabilityDetails"],
    }
  );

type SingleStudentFormData = z.infer<typeof singleStudentFormSchema>;

type Option = {
  value: string;
  label: string;
};

const AddSingleStudentDialog = forwardRef(
  ({ onSuccess = () => {} }: AddSingleStudentDialogProps, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [statesOfSelectedCountry, setStatesOfSelectedCountry] = useState<
      Option[]
    >([]);
    const [citiesOfSelectedState, setCitiesOfSelectedState] = useState<
      Option[]
    >([]);

    const singleStudentForm = useForm<SingleStudentFormData>({
      resolver: zodResolver(singleStudentFormSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        student_number: "",
        country: "",
        state: "",
        city: "",
        gender: undefined,
        ageRange: "",
        password: "",
        confirmPassword: "",
        referred_by: "",
        hasDisability: false,
        disabilityDetails: "",
      },
    });

    const hasDisability = singleStudentForm.watch("hasDisability");
    const selectedCountry = singleStudentForm.watch("country");
    const selectedState = singleStudentForm.watch("state");

    const ageRanges: Option[] = [
      { value: "5-10", label: "5-10" },
      { value: "11-15", label: "11-15" },
      { value: "16-21", label: "16-21" },
      { value: "22-28", label: "22-28" },
      { value: "29-40", label: "29-40" },
      { value: "41-45", label: "41-45" },
      { value: "46-53", label: "46-53" },
      { value: "54-60", label: "54-60" },
      { value: "60-70", label: "60-70" },
      { value: "71-100", label: "71-100" },
    ];

    useImperativeHandle(ref, () => ({
      openDialog: () => {
        setOpen(true);
        singleStudentForm.reset();
      },
    }));

    // Effect to update states when country changes
    useEffect(() => {
      if (selectedCountry) {
        const states = State.getStatesOfCountry(selectedCountry).map(
          (state) => ({
            value: state.isoCode,
            label: state.name,
          })
        );
        setStatesOfSelectedCountry(states);
        singleStudentForm.setValue("state", ""); // Reset state when country changes
        singleStudentForm.setValue("city", ""); // Reset city when country changes
      } else {
        setStatesOfSelectedCountry([]);
        setCitiesOfSelectedState([]); // Clear cities if no country
      }
    }, [selectedCountry, singleStudentForm]);

    // Effect to update cities when state changes
    useEffect(() => {
      if (selectedState && selectedCountry) {
        const cities = City.getCitiesOfState(
          selectedCountry,
          selectedState
        ).map((city) => ({
          value: city.name,
          label: city.name,
        }));
        setCitiesOfSelectedState(cities);
        singleStudentForm.setValue("city", ""); // Reset city when state changes
      } else {
        setCitiesOfSelectedState([]);
      }
    }, [selectedState, selectedCountry, singleStudentForm]);

    const handleSingleStudentSubmit = async (data: SingleStudentFormData) => {
      setLoading(true);
      try {
        const role_id = 3;
        await registerUser(
          data.email,
          data.firstName,
          data.lastName,
          data.password,
          role_id,
          true,
          false,
          data.phone,
          undefined,
          data.country,
          data.city,
          data.gender,
          data.ageRange,
          data.hasDisability ? data.disabilityDetails : undefined,
          data.referred_by,
          data.student_number,
          data.state
        );
        setToastMessage("Student account created successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        singleStudentForm.reset();
        onSuccess();
      } catch (error: any) {
        setToastMessage(error.message || "Failed to create student account.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setLoading(false);
      }
    };

    const countryOptions: Option[] = Country.getAllCountries().map(
      (country) => ({
        value: country.isoCode,
        label: country.name,
      })
    );

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[700px] text-gray-800 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription className="text-gray-500">
                  Fill in the details below to add a single student.
                </DialogDescription>
              </DialogHeader>

              <Form {...singleStudentForm}>
                <form
                  onSubmit={singleStudentForm.handleSubmit(
                    handleSingleStudentSubmit
                  )}
                >
                  <div className="grid gap-4 py-2">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <FormField
                        control={singleStudentForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="space-y-1 w-full">
                            <FormLabel className="font-semibold">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter First Name"
                                className="rounded-full"
                                {...field}
                                disabled={loading}
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={singleStudentForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="space-y-1 w-full">
                            <FormLabel className="font-semibold">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Last Name"
                                className="rounded-full"
                                {...field}
                                disabled={loading}
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <FormField
                        control={singleStudentForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1 w-full">
                            <FormLabel className="font-semibold">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Email"
                                className="rounded-full"
                                {...field}
                                disabled={loading}
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={singleStudentForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-1 w-full">
                            <FormLabel className="font-semibold">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Phone Number"
                                className="rounded-full"
                                {...field}
                                disabled={loading}
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={singleStudentForm.control}
                      name="student_number"
                      render={({ field }) => (
                        <FormItem className="space-y-1 w-full">
                          <FormLabel className="font-semibold">
                            Student Number (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Student ID"
                              className="rounded-full"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage className="text-red-700" />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <FormField
                        control={singleStudentForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full space-y-2">
                            <FormLabel className="font-semibold mt-2">
                              Country
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={loading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10 rounded-full">
                                  <SelectValue placeholder="Select a Country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countryOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={singleStudentForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full space-y-2">
                            <FormLabel className="font-semibold mt-2">
                              State
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={
                                loading || statesOfSelectedCountry.length === 0
                              }
                            >
                              <FormControl>
                                <SelectTrigger className="h-10 rounded-full">
                                  <SelectValue placeholder="Select a State" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {statesOfSelectedCountry.length > 0 ? (
                                  statesOfSelectedCountry.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="" disabled>
                                    No states available
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={singleStudentForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="space-y-1 w-full">
                          <FormLabel className="font-semibold">City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter City"
                              className="rounded-full"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage className="text-red-700" />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <FormField
                        control={singleStudentForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full space-y-2">
                            <FormLabel className="font-semibold mt-2">
                              Gender
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={loading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10 rounded-full">
                                  <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={singleStudentForm.control}
                        name="ageRange"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full space-y-2">
                            <FormLabel className="font-semibold mt-2">
                              Age Range
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={loading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10 rounded-full">
                                  <SelectValue placeholder="Select Age Range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ageRanges.map((range) => (
                                  <SelectItem
                                    key={range.value}
                                    value={range.value}
                                  >
                                    {range.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-2">
                      <FormField
                        control={singleStudentForm.control}
                        name="hasDisability"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-gray-200 rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="hasDisability"
                                disabled={loading}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel htmlFor="hasDisability">
                                Does the student have a disability?
                              </FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {hasDisability && (
                        <FormField
                          control={singleStudentForm.control}
                          name="disabilityDetails"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="font-semibold">
                                Disability Details
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Visually Impaired, Hearing Impaired"
                                  className="rounded-full"
                                  {...field}
                                  disabled={loading}
                                />
                              </FormControl>
                              <FormMessage className="text-red-700" />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <FormField
                        control={singleStudentForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="font-semibold">
                              Password
                            </FormLabel>
                            <FormControl>
                              <PasswordInput
                                placeholder="********"
                                className="rounded-full"
                                {...field}
                                disabled={loading}
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={singleStudentForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="font-semibold">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <PasswordInput
                                placeholder="********"
                                className="rounded-full"
                                {...field}
                                disabled={loading}
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={singleStudentForm.control}
                      name="referred_by"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="font-semibold">
                            Referred By (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter referral code or name"
                              className="rounded-full"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage className="text-red-700" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="mt-4 w-full px-6 py-3 bg-primary text-white rounded-full hover:shadow-lg transition-all duration-300"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    {loading ? "Adding Student..." : "Add Student"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Toast
            open={toastOpen}
            onOpenChange={setToastOpen}
            variant={toastVariant}
          >
            <ToastTitle>{toastMessage}</ToastTitle>
          </Toast>
          <ToastViewport />
        </>
      </ToastProvider>
    );
  }
);

export default AddSingleStudentDialog;
