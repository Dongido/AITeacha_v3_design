import { HTMLAttributes, useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "../../../components/ui/Select";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, SignupResponse } from "../../../api/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Country, State, City } from "country-state-city";
import { Checkbox } from "../../../components/ui/Checkbox";

interface SignupFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "first name must be at least 3 characters long" }),
    lastName: z
      .string()
      .min(3, { message: "last name must be at least 3 characters long" }),
    email: z
      .string()
      .min(1, { message: "Please enter your email" })
      .email({ message: "Invalid email address" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits long" }),
    organization: z
      .string()
      .min(1, { message: "Please Input Organizatin or School Name" }),
    country: z.string(),
    city: z
      .string()
      .min(2, { message: "Password must be at least 2 characters long" }),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

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
  const [selectedCountry, setSelectedCountry] = useState<Option | null>(null);
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedCity, setSelectedCity] = useState<Option | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
      country: "",
      city: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      receiveNewsletters: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!selectedCountry?.label) {
      setToastMessage("Please select country");
      setToastVariant("destructive");
      setToastOpen(true);
      return;
    }
    if (!data.acceptTerms) {
      setToastMessage("You must accept the Terms & Policy");
      setToastVariant("destructive");
      setToastOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const res: SignupResponse = await registerUser(
        data.email,
        data.firstName,
        data.lastName,
        data.password,
        2,
        data.acceptTerms,
        data.receiveNewsletters,
        data.phone,
        data.organization,
        selectedCountry.label,
        data.city,
        data.referred_by
      );
      console.log(data);
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
                      <FormLabel className="font-semibold">Last Name</FormLabel>
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
                <Select
                  onValueChange={(value) =>
                    setSelectedCountry({ value, label: value })
                  }
                >
                  <div className="flex flex-col w-full space-y-2">
                    <Label className="font-semibold mt-2 ">Country</Label>
                    <SelectTrigger className="h-10 rounded-full">
                      <SelectValue placeholder="Select a Country" />
                    </SelectTrigger>
                  </div>
                  <SelectContent>
                    {countryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
                    <FormLabel className="font-semibold">Referred By</FormLabel>
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

              <div className="flex  space-x-6">
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
                        <FormLabel
                          htmlFor="acceptTerms"
                          className="text-sm text-gray-700"
                        >
                          Accept Terms & Policy
                        </FormLabel>
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

              <div className="flex flex-col sm:flex-row justify-center mt-0 space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center rounded-full justify-center"
                >
                  <FaFacebook className="mr-2" /> Facebook
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center rounded-full justify-center"
                >
                  <FcGoogle className="mr-2" /> Google
                </Button>
              </div>
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
