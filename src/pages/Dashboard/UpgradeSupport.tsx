import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../components/ui/Dialogue";
import { Input } from "../../components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/Select";

const UpgradeSupport = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const [numberOfTeachers, setNumberOfTeachers] = useState<number>(1);
  const [duration, setDuration] = useState<string>("1");
  const [unit, setUnit] = useState<string>("monthly"); // Store unit (monthly/yearly)
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const contactMethods = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      ),
      contact: "65, Gbasemo Street, Aga Ikorodu, Lagos Nigeria",
      title: "Our office",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
          />
        </svg>
      ),
      contact: "+234 803-8563-171, +234 708-9115-000",
      title: "Phone",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      ),
      contact: "info@aiteacha.com",
      title: "Email",
    },
  ];

  const durations = [
    { value: "1", label: "1 Month", unit: "monthly" },
    { value: "2", label: "2 Months", unit: "monthly" },
    { value: "3", label: "3 Months", unit: "monthly" },
    { value: "6", label: "6 Months", unit: "monthly" },
    { value: "12", label: "1 Year", unit: "yearly" },
    { value: "24", label: "2 Years", unit: "yearly" },
    { value: "36", label: "3 Years", unit: "yearly" },
  ];

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);

  const handleValueChange = (value: string) => {
    const selectedDuration = durations.find((d) => d.value === value);
    if (selectedDuration) {
      setDuration(value);
      setUnit(selectedDuration.unit);
    }
  };

  const calculatePrice = () => {
    const pricePerTeacherPerMonth = 2000;
    const months = parseInt(duration, 10);
    const totalPrice = numberOfTeachers * pricePerTeacherPerMonth * months;
    setCalculatedPrice(totalPrice);
  };

  const initiatePayment = () => {
    if (duration === "12") {
      setDuration("1");
    } else if (duration === "24") {
      setDuration("2");
    } else if (duration === "36") {
      setDuration("3");
    }
    console.log("Duration: ", duration);
    console.log("Unit: ", unit);
    console.log("Price: ₦", calculatedPrice?.toLocaleString());
  };

  return (
    <div className="mt-4">
      {userDetails && isEmailVerified === 1 && (
        <div
          className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
          style={{
            background:
              "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
          }}
        >
          <span className="text-center text-xl font-bold">
            Teachers Are Heroes🎉
          </span>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"gradient"}
              className="flex items-center w-fit h-full max-h-10 gap-3 py-2 rounded-md"
            >
              Price Calculator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-center">
              AI Teacha Enterprise Calculator
            </DialogTitle>
            <p>
              The AI Teacha Enterprise Plan Calculator offers personalized
              pricing for schools with 15+ educators, considering specific
              needs. Generate custom quotes easily and unlock premium features,
              tools, and dedicated support to revolutionize education at scale.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Teachers
              </label>
              <Input
                type="number"
                min="1"
                value={numberOfTeachers}
                onChange={(e) => setNumberOfTeachers(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Duration
              </label>
              <Select value={duration} onValueChange={handleValueChange}>
                <SelectTrigger className="-my-4">
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Button
                variant="gradient"
                onClick={calculatePrice}
                className="w-full rounded-md"
              >
                Calculate Price
              </Button>
            </div>
            {calculatedPrice !== null && (
              <div className="">
                <div className="mt-4">
                  <p className="text-xl font-semibold">
                    Calculated Price: ₦{" "}
                    {calculatedPrice
                      ? calculatedPrice.toLocaleString()
                      : "Not Calculated"}
                  </p>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={initiatePayment}
                    className="w-full rounded-md bg-blue-600"
                  >
                    Initiate Payment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center text-xl mt-6 font-bold rounded-md text-black w-full gap-12">
        <main className="w-1/2">
          <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
            <div className="max-w-xl space-y-3">
              <h3 className="text-primary font-semibold">
                Request an AI Teacha quote!
              </h3>
              <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                We are so excited to be partnering with you!
              </p>
              <p>
                Please email us at:
                <br />
                <a href="mailto:quotes@curipod.com" className="text-primary">
                  quotes@aiteacha.com
                </a>
              </p>
              <p>
                Questions or concerns? Contact Uche at:
                <a
                  href="mailto:amanda.aitkens@curipod.com"
                  className="text-primary"
                >
                  uchenwaobi@aiteacha.com
                </a>{" "}
                ||
                <a href="tel:+4792943686" className="text-primary">
                  +234 803-8563-171,
                </a>
              </p>
            </div>
          </div>
        </main>

        <div className="w-1/2">
          <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
            <div className="max-w-xl space-y-3">
              <h3 className="text-primary font-semibold">Please include:</h3>
              <ul className="list-disc space-y-2">
                <li>Your name</li>
                <li>Email</li>
                <li>Number of schools you want AI Teacha for</li>
                <li>Your school's name</li>
                <li>Your district's name</li>
                <li>Your role at your school/district</li>
                <li>...and anything else we should know.</li>
              </ul>
              <p>
                You will receive a formal quote within 24 hours of your request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeSupport;
