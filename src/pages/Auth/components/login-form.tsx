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
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, LoginResponse } from "../../../api/auth";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../../store/slices/authSlice";
import { AppDispatch } from "../../../store";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../../../interfaces";
import Cookies from "js-cookie";
import { FcGoogle } from "react-icons/fc";
import { Checkbox } from "../../../components/ui/Checkbox";
import { FaFacebook } from "react-icons/fa";
import { Label } from "../../../components/ui/Label";
import { fetchUserDetails } from "../../../api/profile";
interface LoginFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(7, { message: "Password must be at least 7 characters long" }),
});

export function LoginForm({ className, ...props }: LoginFormProps) {
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
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res: LoginResponse = await loginUser(data.email, data.password);
      console.log(res);
      if (res?.data?.accessToken) {
        const decodedToken = jwtDecode(res.data.accessToken) as DecodedToken;
        console.log(decodedToken);
        Cookies.set("at-accessToken", res.data.accessToken, { expires: 7 });
        Cookies.set("at-refreshToken", res.data.refreshToken, { expires: 7 });

        const userDetails = {
          id: decodedToken.id,
          email: decodedToken.uemail,
          role: decodedToken.role,
          package: decodedToken.package,
          firstname: decodedToken.firstname,
          is_email_verified: decodedToken.is_email_verified,
        };
        localStorage.setItem("ai-teacha-user", JSON.stringify(userDetails));

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

        setToastMessage("Login successful!");
        setToastVariant("default");

        const redirectPath = localStorage.getItem("redirectPath");
        console.log("Redirect path after login:", redirectPath);

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
      } else if (res.status == "error") {
        setToastMessage(res.message);
        setToastVariant("destructive");
      }
    } catch (error: any) {
      console.log(error);
      setToastMessage(error.message || "Oops! Something went wrong.");
      setToastVariant("destructive");
    } finally {
      setToastOpen(true);
      setIsLoading(false);
    }
  }

  return (
    <ToastProvider swipeDirection="left">
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="font-semibold">
                      Email Address
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
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-700">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/auth/reset-password"
                  className="text-sm font-medium text-primary"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                className="mt-2 bg-primary text-white rounded-full"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Log In"}
              </Button>

              <div className="relative my-6">
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
