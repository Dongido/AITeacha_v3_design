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
import { Input } from "../../../components/ui/Input";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "../../../components/ui/PasswordInput";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { DecodedToken } from "../../../interfaces";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { Link, useNavigate } from "react-router-dom";
import { setAuthData } from "../../../store/slices/authSlice";
import {
  registerUser,
  SignupResponse,
  loginWithGoogle,
} from "../../../api/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
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
    phone: z.string(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 7 characters long" }),
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

export function SignupForm({ className, ...props }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      receiveNewsletters: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const storedRole = localStorage.getItem("selectedRole");

    let role_id: number | 4 = 4;
    if (storedRole === "student") {
      role_id = 3;
    } else if (storedRole === "teacher" || storedRole === "lecturer") {
      role_id = 2;
    }

    try {
      const res: SignupResponse = await registerUser(
        data.email,
        data.firstName,
        data.lastName,
        data.password,
        role_id
      );
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
                    <FormItem className="space-y-1">
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
                    <FormItem className="space-y-1">
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
                      <FormLabel className="font-semibold">
                        Phone Number
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
              </div>

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
              <FormField
                control={form.control}
                name="referred_by"
                render={({ field }) => (
                  <FormItem className="space-y-1 w-full">
                    <FormLabel className="font-semibold">
                      Referred By(Optional)
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
          {/* <Button
                          variant="outline"
                          className="w-full flex items-center rounded-full justify-center"
                        >
                          <FaFacebook className="mr-2" /> Facebook
                        </Button> */}
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center rounded-full justify-center"
            onClick={async (event) => {
              event.preventDefault();
              try {
                //setIsGoogleLoading(true);
                const res = await loginWithGoogle();
                if (res?.data?.accessToken) {
                  const decodedToken = jwtDecode(
                    res.data.accessToken
                  ) as DecodedToken;
                  Cookies.set("at-accessToken", res.data.accessToken, {
                    expires: 7,
                  });
                  Cookies.set("at-refreshToken", res.data.refreshToken, {
                    expires: 7,
                  });

                  const userDetails = {
                    id: decodedToken.id,
                    email: decodedToken.uemail,
                    role: decodedToken.role,
                    package: decodedToken.package,
                    firstname: decodedToken.firstname,
                    is_email_verified: decodedToken.is_email_verified,
                    imageurl: decodedToken.imageurl,
                  };
                  localStorage.setItem(
                    "ai-teacha-user",
                    JSON.stringify(userDetails)
                  );

                  dispatch(
                    setAuthData({
                      token: res.data.accessToken,
                      user: {
                        id: decodedToken.id,
                        email: decodedToken.uemail,
                        role: decodedToken.role,
                      },
                    })
                  );

                  setToastMessage("Google login successful!");
                  setToastVariant("default");

                  const redirectPath = localStorage.getItem("redirectPath");
                  if (decodedToken.role === 3) {
                    navigate("/student/home");
                  } else if (decodedToken.role === 2) {
                    navigate("/dashboard/home");
                  } else if (decodedToken.role === 4) {
                    navigate("/auth/onboarding");
                  } else if (redirectPath) {
                    localStorage.removeItem("redirectPath");
                    navigate(redirectPath);
                  } else {
                    navigate("/dashboard");
                  }
                } else if (res.status === "error") {
                  setToastMessage(res.message);
                  setToastVariant("destructive");
                }
              } catch (error: any) {
                console.log(error);
                setToastMessage(
                  error.message || "Google login failed. Please try again."
                );
                setToastVariant("destructive");
              } finally {
                setToastOpen(true);
                setIsLoading(false);
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
