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
import { Label } from "../../../components/ui/Label";
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
import { Link, useNavigate } from "react-router-dom";
import { registerUser, SignupResponse } from "../../../api/auth";
import { FcGoogle } from "react-icons/fc";
import { Country } from "country-state-city";
import { Checkbox } from "../../../components/ui/Checkbox";

interface SignupFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters long" }),
    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters long" }), // Fixed typo
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
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
      country: "Nigeria",
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

  const hasDisability = form.watch("hasDisability");

  useEffect(() => {
    const storedReferralCode = localStorage.getItem("referralCode");
    if (storedReferralCode) {
      form.setValue("referred_by", storedReferralCode);
    }
  }, [form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
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
        data.referred_by
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

  const countryOptions: Option[] = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const isRoleIdFour = localStorage.getItem("roleId") === "4";

  return (
    <ToastProvider swipeDirection="right">
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="space-y-1 w-full">
                      <FormLabel className="font-semibold">
                        {isRoleIdFour && <>Admin </>}
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
                        {isRoleIdFour && <>Admin </>}Last Name
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
                    <FormItem className="space-y-1">
                      <FormLabel className="font-semibold">Email</FormLabel>
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
                    <FormItem className="space-y-1">
                      <FormLabel className="font-semibold">Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Phone Number"
                          type="number"
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
                        onValueChange={field.onChange} // Directly update the form field value
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
              </div>

              {/* New Gender and Age Fields */}
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

              {/* New Disability Fields */}
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

              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="font-semibold">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="********"
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
                        />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
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

              <div className="flex space-x-6">
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
                          className="text-blue-600 underline"
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
              <Button
                className="mt-2 bg-primary text-white rounded-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-900">
                    or continue with
                  </span>
                </div>
              </div>
            </div>
          </form>
        </Form>

        <div className="flex flex-col sm:flex-row justify-center mt-0 space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center rounded-full justify-center"
            onClick={(event) => {
              event.preventDefault();
              try {
                const googleAuthUrl = `https://vd.aiteacha.com/api/auth/google?redirect_uri=${encodeURIComponent(
                  window.location.origin + "/auth/callback"
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
            <FcGoogle className="mr-2" /> Google
          </Button>
        </div>

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
