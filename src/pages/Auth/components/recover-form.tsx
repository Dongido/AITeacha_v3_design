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
import { useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { PasswordInput } from "../../../components/ui/PasswordInput";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} from "../../../api/auth";

interface ResetPasswordFormProps extends HTMLAttributes<HTMLDivElement> {}

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const tokenSchema = z.object({
  token: z.string().min(6, { message: "Token must be at least 6 characters" }),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  const navigate = useNavigate();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const tokenForm = useForm<z.infer<typeof tokenSchema>>({
    resolver: zodResolver(tokenSchema),
    defaultValues: { token: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function handleEmailSubmit(data: z.infer<typeof emailSchema>) {
    try {
      await requestPasswordReset(data.email);
      localStorage.setItem("resetEmail", data.email);
      setToastMessage("Password reset code sent to your email!");
      setStep(2);
    } catch (error: any) {
      setToastMessage(error.message || "Something went wrong.");
      setToastVariant("destructive");
    } finally {
      setToastOpen(true);
    }
  }

  async function handleTokenSubmit(data: z.infer<typeof tokenSchema>) {
    try {
      await verifyResetToken(localStorage.getItem("resetEmail")!, data.token);
      setToastMessage("Token verified! Please set your new password.");
      setToastVariant("default");
      setStep(3);
    } catch (error: any) {
      setToastMessage(error.message || "Invalid or expired token.");
      setToastVariant("destructive");
    } finally {
      setToastOpen(true);
    }
  }

  async function handlePasswordSubmit(data: z.infer<typeof passwordSchema>) {
    try {
      const response = await resetPassword(
        localStorage.getItem("resetEmail")!,
        data.password
      );
      setToastMessage("Password successfully reset!");
      setToastVariant("default");

      setTimeout(() => {}, 2000);

      navigate("/auth/login");
    } catch (error: any) {
      setToastMessage(error.message || "Unable to reset password.");
      setToastVariant("destructive");
    } finally {
      setToastOpen(true);
    }
  }

  return (
    <ToastProvider swipeDirection="left">
      <div className={cn("grid gap-6", className)} {...props}>
        {step === 1 && (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
              <h1 className="text-2xl font-semibold text-gray-800 text-center">
                Reset Your Password
              </h1>
              <p className="text-center text-gray-600 mb-6">
                Enter your email address to receive a code to reset your
                password.
              </p>
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-2 w-full rounded-md"
                variant={"gradient"}
                disabled={emailForm.formState.isSubmitting}
              >
                Send Reset Code
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...tokenForm}>
            <form onSubmit={tokenForm.handleSubmit(handleTokenSubmit)}>
              <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                Enter the Reset Code
              </h1>
              <p className="text-center text-gray-600 mb-6">
                A code has been sent to your email. Please enter it below to
                reset your password.
              </p>
              <FormField
                control={tokenForm.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reset Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the code" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-2 w-full rounded-md"
                variant={"gradient"}
                disabled={tokenForm.formState.isSubmitting}
              >
                Verify Code
              </Button>
            </form>
          </Form>
        )}

        {step === 3 && (
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
              <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                Set Your New Password
              </h1>
              <p className="text-center text-gray-600 mb-6">
                Please enter a new password and confirm it below to complete the
                reset process.
              </p>
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-2 w-full rounded-md"
                variant={"gradient"}
                disabled={passwordForm.formState.isSubmitting}
              >
                Reset Password
              </Button>
            </form>
          </Form>
        )}

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
