import { HTMLAttributes, useState, useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/Form";
import { Input } from "../../../components/ui/Input";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "../../../components/ui/PasswordInput";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import { useNavigate } from "react-router-dom";
import {  completeTeacherProfile } from "../../../api/auth";
import { Checkbox } from "../../../components/ui/Checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import { Country, State } from "country-state-city";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface SignupFormProps extends HTMLAttributes<HTMLDivElement> {}

const containsUrl = (text: string): boolean => {
  if (!text) return false;
  const urlRegex = /(https?:\/\/|www\.)[^\s]+/i;
  return urlRegex.test(text);
};

const formSchema = z.object({
  organization: z.string().min(1, "Please Input Organization or School Name"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  ageRange: z.string().min(1, "Please select an age range"),
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please enter your city"),
  referred_by: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val, {
    message: "You must accept the Terms & Policy",
  }),
  receiveNewsletters: z.boolean(),
  hasDisability: z.boolean(),
  disabilityDetails: z.string().optional(),
})
.refine(
  (data) =>
    !data.hasDisability ||
    (data.disabilityDetails && data.disabilityDetails.trim() !== ""),
  {
    message: "Please specify your disability",
    path: ["disabilityDetails"],
  }
);

type Option = { value: string; label: string };

export function CompleteProfileForm({ className, ...props }: SignupFormProps) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [statesOfSelectedCountry, setStatesOfSelectedCountry] = useState<Option[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">("default");
  const [role_id, setRoleId] = useState<number>(4);

  // Country + Age options
  const countryOptions: Option[] = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    mode: "onSubmit",
    defaultValues: {
      phone: "",
      gender: "Male",
      ageRange: "",
      country: "",
      state: "",
      city: "",
      organization: "",
      referred_by: "",
      acceptTerms: false,
      receiveNewsletters: false,
      hasDisability: false,
      disabilityDetails: "",
    },
  });

  const hasDisability = form.watch("hasDisability");
  const selectedCountry = form.watch("country");

  // Dynamically load states for the selected country
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((s) => ({
        value: s.isoCode,
        label: s.name,
      }));
      setStatesOfSelectedCountry(states);
      form.setValue("state", "");
    } else {
      setStatesOfSelectedCountry([]);
    }
  }, [selectedCountry, form]);

  // Retrieve role and referral code from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("selectedRole");
    const storedReferralCode = localStorage.getItem("referralCode");
    if (storedReferralCode) form.setValue("referred_by", storedReferralCode);

    const newRoleId =
      storedRole === "student" ? 3 : storedRole === "teacher" || storedRole === "lecturer" ? 2 : 4;

    setRoleId(newRoleId);
    console.log(`Stored role: ${storedRole} → roleId: ${newRoleId}`);
  }, [form]);

  // async function onSubmit(data: z.infer<typeof formSchema>) {
  //   setIsLoading(true);

  //   try {
  //     const res: SignupResponse = await registerUser(
  //       data.email,
  //       data.firstName,
  //       data.lastName,
  //       data.password,
  //       role_id,
  //       data.acceptTerms,
  //       data.receiveNewsletters,
  //       data.phone,
  //       undefined,
  //       data.country,
  //       data.organization,
  //       data.city,
  //       data.gender,
  //       data.ageRange,
  //       data.hasDisability ? data.disabilityDetails : undefined,
  //       data.referred_by,
  //       data.state
  //     );

  //     setToastMessage(res.message || "Signup successful! Redirecting...");
  //     setToastVariant("default");
  //     setToastOpen(true);
  //     localStorage.setItem("userEmail", data.email);

  //     setTimeout(() => navigate("/auth/verify-email"), 1500);
  //   } catch (error: any) {
  //     setToastMessage(error.message || "Oops! Something went wrong.");
  //     setToastVariant("destructive");
  //     setToastOpen(true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }





async function onSubmit(data: z.infer<typeof formSchema>) {
  try {
    setIsLoading(true);
    console.log("Submitting teacher profile...", data);

    // Get user ID from JWT token
    const token = Cookies.get("at-accessToken");
    if (!token) throw new Error("Access token not found. Please log in.");

    const decoded: any = jwtDecode(token);
    const userId = String(decoded.id);
    if (!userId) throw new Error("User ID not found. Please log in again.");

    // Call the dedicated teacher profile completion API
    const response = await completeTeacherProfile(userId, {
      organization: data.organization,
      gender: data.gender,
      country : data.country,
      age_range: data.ageRange,
      city: data.city,
      phone: data.phone,
      state : data.state,
      referral: data.referred_by || undefined,
      disability: data.hasDisability ? data.disabilityDetails : undefined,
      confirm_policy: data.acceptTerms,
      confirm_newsletter: data.receiveNewsletters,
    });

    // Success toast
    setToastMessage(response.message || "Profile completed successfully!");
    setToastVariant("default");
    setToastOpen(true);

    // Navigate to teacher dashboard after 1.5s
    setTimeout(() => navigate("/dashboard/home"), 1500);
  } catch (error: any) {
    setToastMessage(
      error.message || "Failed to complete teacher profile. Try again."
    );
    setToastVariant("destructive");
    setToastOpen(true);
  } finally {
    setIsLoading(false);
  }
}



  return (
    <ToastProvider swipeDirection="right">
      <div className={cn("max-w-full w-[500px] mx-auto grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="font-semibold">
                          School/Organization Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter School Name or Organization"
                            type="text"
                            className="rounded-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />

            {/* Gender + Age */}
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-semibold">Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-full">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ageRange"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-semibold">Age Range</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-full">
                          <SelectValue placeholder="Select Age Range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ageRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
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

            {/* Country + State */}
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-semibold">Country</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-full">
                          <SelectValue placeholder="Select a Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-semibold">State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={statesOfSelectedCountry.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-full">
                          <SelectValue placeholder="Select a State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statesOfSelectedCountry.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-col grid-cols-2">
              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter City" className="rounded-full" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />

              {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Phone Number" className=" rounded-full" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

              
            </div>


            {/* Disability */}
            <FormField
              control={form.control}
              name="hasDisability"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="hasDisability" />
                  </FormControl>
                  <FormLabel htmlFor="hasDisability" className="leading-none">
                    Do you have a disability?
                  </FormLabel>
                </FormItem>
              )}
            />

            {hasDisability && (
              <FormField
                control={form.control}
                name="disabilityDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Disability Details</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Visually Impaired, Hearing Impaired"
                        className="rounded-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
            )}

            {/* Referral */}
            <FormField
              control={form.control}
              name="referred_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Referred By (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter referral code" className="rounded-full" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            {/* Terms + Newsletter */}
            <div className="flex justify-between space-x-6">
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox id="acceptTerms" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Accept Terms & Policy
                    </a>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receiveNewsletters"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        id="receiveNewsletters"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel htmlFor="receiveNewsletters" className="text-sm text-gray-700">
                      Receive Newsletters
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-primary text-white rounded-full"
            >
              {isLoading ? "Signing up..." : "Continue"}
            </Button>
          </form>
        </Form>

        <Toast open={toastOpen} onOpenChange={setToastOpen} variant={toastVariant}>
          <ToastTitle>{toastMessage}</ToastTitle>
        </Toast>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}




