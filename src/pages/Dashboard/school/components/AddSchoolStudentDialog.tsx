import React, { useImperativeHandle, useState, forwardRef } from "react";
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
import { LuLoader2 } from "react-icons/lu";
interface AddStudentsDialogProps {
  onSuccess?: () => void;
}

interface StudentData {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  student_number?: string;
  age?: string;
  gender?: string;
  disability_details?: string;
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
    phone: z.string().refine((val) => !containsUrl(val), {
      message: "Phone number cannot contain URLs",
    }),
    student_number: z
      .string()
      .optional()
      .refine((val) => !containsUrl(val || ""), {
        message: "Student ID cannot contain URLs",
      }),
    gender: z.enum(["Male", "Female"], {
      errorMap: () => ({ message: "Please select a gender" }),
    }),
    ageRange: z.string().min(1, { message: "Please select an age range" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 7 characters long" }),
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

type AgeRangeOption = {
  value: string;
  label: string;
};

const AddSchoolStudentsDialog = forwardRef(
  ({ onSuccess = () => {} }: AddStudentsDialogProps, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [mode, setMode] = useState<"csv" | "single">("csv");

    const singleStudentForm = useForm<SingleStudentFormData>({
      resolver: zodResolver(singleStudentFormSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        student_number: "",
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

    const ageRanges: AgeRangeOption[] = [
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
      openDialog: (initialMode: "csv" | "single" = "csv") => {
        setOpen(true);
        setMode(initialMode);
        singleStudentForm.reset();
        setFile(null);
      },
    }));

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
      } else {
        setFile(null);
      }
    };

    const parseCSV = (text: string): StudentData[] => {
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      if (lines.length <= 1) {
        throw new Error("CSV file is empty or contains only headers.");
      }

      const data: StudentData[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const [
          firstname,
          lastname,
          phone,
          email,
          gender,
          age,
          student_number,
          disability_details,
        ] = lines[i].split(",").map((item) => item.trim());

        if (!firstname || !lastname || !phone || !email || !age || !gender) {
          errors.push(
            `Row ${
              i + 1
            }: Missing required fields (firstname, lastname, phone, email, age, or gender).`
          );
        } else {
          data.push({
            firstname,
            lastname,
            phone,
            email,
            age,
            gender,
            student_number: student_number || undefined,
            disability_details: disability_details || undefined,
          });
        }
      }

      if (errors.length > 0) {
        throw new Error(
          `Validation Error: Ensure all required fields are correctly inputted. Details: ${errors.join(
            " "
          )}`
        );
      }

      return data;
    };
    const handleUploadCSV = async () => {
      if (!file) {
        setToastMessage("Please select a CSV file to upload.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      if (file.type !== "text/csv") {
        setToastMessage("Please upload a valid CSV file.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      setLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const students = parseCSV(text);

          console.log("Parsed Student Data:", students);

          const transformedStudents = students.map((student) => {
            const newStudent: any = { ...student };
            if (newStudent.student_number !== undefined) {
              newStudent.assigned_number = newStudent.student_number;
              delete newStudent.student_number;
            }
            return newStudent;
          });
          await uploadStudents(transformedStudents);
          setToastMessage("Students uploaded successfully!");
          setToastVariant("default");
          setToastOpen(true);
          setOpen(false);
          setFile(null);
          onSuccess();
        } catch (error: any) {
          setToastMessage(
            error.message ||
              "Failed to process CSV file. Ensure all fields are correctly inputted."
          );
          setToastVariant("destructive");
          setToastOpen(true);
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setToastMessage("Error reading file.");
        setToastVariant("destructive");
        setToastOpen(true);
        setLoading(false);
      };

      reader.readAsText(file);
    };

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
          undefined,
          undefined,
          data.gender,
          data.ageRange,
          data.hasDisability ? data.disabilityDetails : undefined,
          data.referred_by,
          data.student_number
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

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[700px] text-gray-800 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Students</DialogTitle>
                <DialogDescription className="text-gray-500">
                  Choose an option below to add students.
                </DialogDescription>
              </DialogHeader>

              <div className="flex space-x-4 mb-0 justify-center">
                <Button
                  variant={mode === "csv" ? "default" : "outline"}
                  onClick={() => setMode("csv")}
                  className="rounded-full"
                >
                  Upload CSV
                </Button>
                <Button
                  variant={mode === "single" ? "default" : "outline"}
                  onClick={() => setMode("single")}
                  className="rounded-full"
                >
                  Add Single Student
                </Button>
              </div>

              {mode === "csv" && (
                <div className="grid gap-4 py-4">
                  <DialogDescription className="mb-4">
                    Upload a **CSV document** containing student information.
                    The CSV should have columns in the order: <br />
                    <span className="font-bold">
                      firstname, lastname, phone, email, gender, age
                    </span>
                    , and optionally{" "}
                    <span className="font-bold">student ID</span> and{" "}
                    <span className="font-bold">disability_details</span>.
                    <br />
                    <br />
                    <span className="text-sm text-gray-500">
                      (e.g.,
                      John,Doe,1234567890,john.doe@example.com,Male,12,STU001,Wheelchair
                      user)
                    </span>
                    <br />
                    <span className="text-sm text-gray-500">
                      * `disability_details` is optional. Leave blank if not
                      applicable.
                    </span>
                  </DialogDescription>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="csvFile" className="text-right">
                      CSV File
                    </Label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="col-span-3"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {mode === "single" && (
                <Form {...singleStudentForm}>
                  <form
                    onSubmit={singleStudentForm.handleSubmit(
                      handleSingleStudentSubmit
                    )}
                  >
                    <div className="grid gap-4 py-2">
                      <div className="flex space-x-4">
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
                                />
                              </FormControl>
                              <FormMessage className="text-red-700" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex space-x-4">
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
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />

                      <div className="flex space-x-4">
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
                                  />
                                </FormControl>
                                <FormMessage className="text-red-700" />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

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
                              />
                            </FormControl>
                            <FormMessage className="text-red-700" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-4 w-full bg-primary text-white rounded-full"
                      disabled={loading}
                    >
                      {loading ? "Adding Student..." : "Add Student"}
                    </Button>
                  </form>
                </Form>
              )}

              <DialogFooter>
                {mode === "csv" && (
                  <Button
                    onClick={handleUploadCSV}
                    disabled={loading || !file}
                    variant={"gradient"}
                    className="mt-4 w-full bg-primary text-white rounded-full"
                  >
                    {loading && (
                      <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    {loading ? `Uploading` : "Upload Students"}
                  </Button>
                )}
              </DialogFooter>
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

export default AddSchoolStudentsDialog;
