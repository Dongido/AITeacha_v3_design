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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import { useNavigate } from "react-router-dom";
import { registerUser, SignupResponse } from "../../../api/auth";
import { FcGoogle } from "react-icons/fc";
import { Country, State } from "country-state-city";
import { Checkbox } from "../../../components/ui/Checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface SignupFormProps extends HTMLAttributes<HTMLDivElement> {}

const containsUrl = (text: string): boolean => {
  if (!text) return false;
  const urlRegex = /(https?:\/\/|www\.)[^\s]+/i;
  return urlRegex.test(text);
};

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters long" }),
    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters long" }),
    email: z
      .string()
      .min(1, { message: "Please enter your email" })
      .email({ message: "Invalid email address" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits long" }),
    organization: z
      .string()
      .min(1, { message: "Please Input Organization or School Name" }),
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
    referred_by: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val, {
      message: "You must accept the Terms & Policy",
    }),
    receiveNewsletters: z.boolean(),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
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
      message: "Please specify your disability",
      path: ["disabilityDetails"],
    }
  );




type Option = {
  value: string;
  label: string;
};

export function TeacherSignupForm({ className, ...props }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  const [statesOfSelectedCountry, setStatesOfSelectedCountry] = useState<
    Option[]
  >([]);




  

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
      mode: "onChange",          // validate as user types
      reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
      country: "",
      state: "",
      city: "",
      gender: "Male",
      ageRange: "",
      referred_by: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      receiveNewsletters: false,
      hasDisability: false,
      disabilityDetails: "",
    },
  });



  useEffect(() => {
    const storedReferralCode = localStorage.getItem("referralCode");
    if (storedReferralCode) {
      form.setValue("referred_by", storedReferralCode);
    }
  }, [form]);

  // const selectedCountry = form.watch("country");

  

  const selectedCountry = form.watch("country");
  const hasDisability = form.watch("hasDisability");

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStatesOfSelectedCountry(states);
      form.setValue("state", "");
    }
  }, [selectedCountry]);



  const storedRole = localStorage.getItem("selectedRole");
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStatesOfSelectedCountry(states);
      form.setValue("state", "");
    } else {
      setStatesOfSelectedCountry([]);
    }

    console.log("Stored role from localStorage:", storedRole);
  }, [selectedCountry, form]);


   async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("submitting ...")
    try {
      const roleId = localStorage.getItem("roleId")
        ? parseInt(localStorage.getItem("roleId")!)
        : 2;

      const res: SignupResponse = await registerUser(
        data.email,
        data.firstName,
        data.lastName,
        data.password,
        roleId,
        data.acceptTerms,
        data.receiveNewsletters,
        data.phone,
        data.organization,
        data.country,
        data.city,
        data.gender,
        data.ageRange,
        data.hasDisability ? data.disabilityDetails : undefined,
        data.referred_by,
        undefined,
        data.state
      );

      console.log("Signup data submitted:", data);
      setToastMessage(res.message || "Signup successful! Redirecting...");
      setToastVariant("default");
      localStorage.setItem("userEmail", data.email);

      setToastOpen(true);
      setTimeout(() => {
        navigate("/auth/verify-email");
      }, 1500);
    } catch (error: any) {
      setToastMessage(error.message || "Oops! Something went wrong.");
      setToastVariant("destructive");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  }
  // const handleNext = async () => {
  //   const isValid = await form.trigger([
  //     "firstName",
  //     "lastName",
  //     "email",
  //     "phone",
  //     "password",
  //     "confirmPassword",
  //     "organization",
  //   ]);
  //   if (isValid) setStep(2);
  // };

  const handleNext = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];
    if (step === 1)
      fieldsToValidate = ["firstName", "lastName", "email", "phone", "organization", "password", "confirmPassword", "acceptTerms"];
    else if (step === 2)
      fieldsToValidate = ["gender", "ageRange", "country", "state", "city"];
  
    const isValid = await form.trigger(fieldsToValidate, { shouldFocus: true });
    if (isValid) {
      setStep((s) => s + 1);
    } else {
      fieldsToValidate.forEach((field) => form.setFocus(field));
    }
  };

  const handleBack = () => setStep(1);

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

  const countryOptions: Option[] = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  return (
    <ToastProvider swipeDirection="right">
      <div className={cn("max-w-[500px] grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full grid gap-6 ">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key={step}
                    className="grid gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      // className="w-fit mb-2 border flex items-center cursor-pointer hover:text-[#8133F1] transition gap-2 rounded-full"
                      className="flex cursor-pointer hover:text-[#8133F1] transition   mb-[20px] gap-2 text-base font-medium"
                    >
                      <ChevronLeft size={20} /> Back
                    </button>

                    <div className="flex space-x-4">
                      <FormField
                        control={form.control}
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
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
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
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <FormField
                        control={form.control}
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
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
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
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                    </div>

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

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              className="rounded-full"
                              placeholder="********"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-700" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              className="rounded-full"
                              placeholder="********"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-700" />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between space-x-6">
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name="acceptTerms"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  id="acceptTerms"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <a
                                href="/terms-of-service"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline m-0"
                              >
                                Accept Terms & Policy
                              </a>
                              <FormMessage className="text-red-700" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
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
                              <FormLabel
                                htmlFor="receiveNewsletters"
                                className="text-sm text-gray-700"
                              >
                                Receive Newsletters
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="mt-2 w-full bg-primary text-white rounded-full"
                      >
                        Continue
                      </Button>

                      <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-white px-2 text-gray-900">
                            or
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-center mt-0 space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center rounded-full justify-center"
            onClick={(event) => {
              event.preventDefault();
              try {
                const googleAuthUrl = `https://api.aiteacha.com/api/auth/google/${storedRole}?redirect_uri=${encodeURIComponent(
                  window.location.origin +
                    `/api/auth/google/${storedRole}/callback`
                )}`;
                window.location.href = googleAuthUrl;
              } catch (error) {
                console.log(error);
                setToastMessage(
                  (error as Error).message ||
                    "Google login failed. Please try again."
                );
                setToastVariant("destructive");
                setToastOpen(true);
              }
            }}
          >
            <FcGoogle className="mr-2" />Signup with Google
          </Button>
        </div>
                    </div>
                  </motion.div>
                )}





                 {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                // key="step2 "
                key={step}
                className="grid gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}>
                  <button
                      type="button"
                      // variant="outline"
                      onClick={handleBack}
                       className="flex cursor-pointer hover:text-[#8133F1] transition   mb-[20px] gap-2 text-base font-medium"
                    >
                      <ChevronLeft size={20} /> Back
                    </button> 

                   <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full space-y-2">
                      <FormLabel className="font-semibold mt-2">
                        Gender
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-full">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          {/* <SelectItem value="Other">Other</SelectItem> */}
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
                    <FormItem className="flex flex-col w-full space-y-2">
                      <FormLabel className="font-semibold mt-2">
                        Age Range
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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


              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full space-y-2">
                      <FormLabel className="font-semibold mt-2">
                        Country
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                    <FormItem className="flex flex-col w-full space-y-2">
                      <FormLabel className="font-semibold mt-2">
                        State
                      </FormLabel>
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


               <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="space-y-1 w-full">
                    <FormLabel className="font-semibold">City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter City"
                        className="rounded-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="hasDisability"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-gray-200 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="hasDisability"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="hasDisability">
                          Do you have a disability?
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {hasDisability && (
                  <FormField
                    control={form.control}
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
                          />
                        </FormControl>
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                )}
              </div>


                <FormField
                control={form.control}
                name="referred_by"
                render={({ field }) => (
                  <FormItem className="space-y-1 w-full">
                    <FormLabel className="font-semibold">
                      Referred By (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter referral code"
                        className="rounded-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
                  

                  

                 

                  <div className="">
                    
                    <Button type="submit" disabled={isLoading} className="mt-2 w-full bg-primary text-white rounded-full">
                      {isLoading ? "Signing up..." : "Sign Up"}
                    </Button>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </form>
        </Form>

        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          variant={toastVariant}
        >
          <ToastTitle>{toastMessage}</ToastTitle>
        </Toast>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
