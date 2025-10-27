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
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import { Checkbox } from "../../../components/ui/Checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import { Country, State } from "country-state-city";
import {  completeStudentProfile } from "../../../api/auth"; // ✅ your API
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface CompleteProfileProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  ageRange: z.string().min(1, "Please select an age range"),
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please enter your city"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  grade: z.string().min(1, "Please select a grade"),
  hasDisability: z.boolean(),
  disability: z.string().optional(),
}).refine(
  (data) =>
    !data.hasDisability || (data.disability && data.disability.trim() !== ""),
  {
    message: "Please specify your disability",
    path: ["disability"],
  }
);

type Option = { value: string; label: string };

export function CompleteProfileFormStudent({
  className,
  ...props
}: CompleteProfileProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  const [statesOfSelectedCountry, setStatesOfSelectedCountry] = useState<Option[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      gender: "Male",
      ageRange: "",
      country: "",
      state: "",
      city: "",
      phone: "",
      grade: "",
      hasDisability: false,
      disability: "",
    },
  });

  const hasDisability = form.watch("hasDisability");
  const selectedCountry = form.watch("country");

  const countryOptions: Option[] = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const grades: Option[] = [
  { value: "Pre School", label: "Pre School" },
  { value: "Early Years", label: "Early Years" },
  { value: "Nursery 1", label: "Nursery 1" },
  { value: "Nursery 2", label: "Nursery 2" },
  { value: "Grade 1", label: "Grade 1" },
  { value: "Grade 2", label: "Grade 2" },
  { value: "Grade 3", label: "Grade 3" },
  { value: "Grade 4", label: "Grade 4" },
  { value: "Grade 5", label: "Grade 5" },
  { value: "Grade 6", label: "Grade 6" },
  { value: "Grade 7", label: "Grade 7" },
  { value: "Grade 8", label: "Grade 8" },
  { value: "Grade 9", label: "Grade 9" },
  { value: "Grade 10", label: "Grade 10" },
  { value: "Grade 11", label: "Grade 11" },
  { value: "Grade 12", label: "Grade 12" },
  { value: "Higher Institution Year 1", label: "Higher Institution Year 1" },
  { value: "Higher Institution Year 2", label: "Higher Institution Year 2" },
  { value: "Higher Institution Year 3", label: "Higher Institution Year 3" },
  { value: "Higher Institution Year 4", label: "Higher Institution Year 4" },
  { value: "Higher Institution Year 5", label: "Higher Institution Year 5" },
];


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


  // Update states when a country is selected
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

//   async function onSubmit(data: z.infer<typeof formSchema>) {
//   try {
//     setIsLoading(true);
//     console.log("Submitting student profile...", data);

//     const token = Cookies.get("at-accessToken");
//     if (!token) return;
    
//     const decoded: any = jwtDecode(token);
//     const userId = String(decoded.id);

//     console.log(userId)
//     if (!userId) throw new Error("User ID not found. Please log in again.");

//     const response = await completeProfile(userId, "student", {
//       gender: data.gender,
//       ageRange: data.ageRange,
//       country: data.country,
//       state: data.state,
//       city: data.city,
//       phone: data.phone,
//       grade: data.grade,
//       disability: data.hasDisability ? data.disability : undefined,
//     });

//     setToastMessage(response.message || "Profile completed successfully!");
//     setToastVariant("default");
//     setToastOpen(true);

//     setTimeout(() => navigate("/dashboard/student"), 1500);
//   } catch (error: any) {
//     setToastMessage(
//       error.message || "Failed to complete student profile. Try again."
//     );
//     setToastVariant("destructive");
//     setToastOpen(true);
//   } finally {
//     setIsLoading(false);
//   }
// }



async function onSubmit(data: z.infer<typeof formSchema>) {
  try {
    setIsLoading(true);
    console.log("Submitting student profile...", data);

    // Get user ID from JWT token
    const token = Cookies.get("at-accessToken");
    if (!token) throw new Error("Access token not found. Please log in.");

    const decoded: any = jwtDecode(token);
    const userId = String(decoded.id);
    if (!userId) throw new Error("User ID not found. Please log in again.");

    // Call the dedicated student profile completion API
    const response = await completeStudentProfile(userId, {
      gender: data.gender,
      age_range: data.ageRange,
      country: data.country,
      state: data.state,
      city: data.city,
      phone: data.phone,
      grade: data.grade,
      disability: data.hasDisability ? data.disability : undefined,
    });

    // Success toast
    setToastMessage(response.message || "Profile completed successfully!");
    setToastVariant("default");
    setToastOpen(true);

    // Navigate to student dashboard after 1.5s
    setTimeout(() => navigate("/student/home"), 1500);
  } catch (error: any) {
    setToastMessage(
      error.message || "Failed to complete student profile. Try again."
    );
    setToastVariant("destructive");
    setToastOpen(true);
  } finally {
    setIsLoading(false);
  }
}


  return (
    <ToastProvider swipeDirection="right">
      <div
        className={cn("max-w-full w-[500px] mx-auto grid gap-6", className)}
        {...props}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            {/* Gender + Age Range */}
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
                          <SelectValue placeholder="Select Country" />
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
                          <SelectValue placeholder="Select State" />
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

            {/* City + Phone */}
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-semibold">City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter City" className="rounded-full" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-semibold">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Phone Number" className="rounded-full" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
            </div>

            {/* Grade */}
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Grade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-full">
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            {/* Disability */}
            <FormField
              control={form.control}
              name="hasDisability"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 border border-gray-200 p-3 rounded-lg">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="leading-none">
                    Do you have a disability?
                  </FormLabel>
                </FormItem>
              )}
            />

            {hasDisability && (
              <FormField
                control={form.control}
                name="disability"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white rounded-full"
            >
              {isLoading ? "Submitting..." : "Complete Profile"}
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
