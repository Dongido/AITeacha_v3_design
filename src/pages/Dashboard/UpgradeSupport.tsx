// import { useState, useEffect } from "react";
// import { Button } from "../../components/ui/Button";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogTitle,
// } from "../../components/ui/Dialogue";
// import { Input } from "../../components/ui/Input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "../../components/ui/Select";
// import PaymentMethodDialog from "./UpgradeDialog";
// import { changeUserPlan, verifyCouponCode } from "../../api/subscription";
// import Cookies from "js-cookie";
// import axios from "axios";
// import Logo from "../../assets/img/logo.png";
// import { FLUTTERWAVE_PUBLIC } from "../../lib/utils";
// import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
// import { useNavigate } from "react-router-dom";
// import { verifyTransaction } from "../../api/subscription";
// import { AppDispatch, RootState } from "../../store";
// import { useDispatch } from "react-redux";
// import { useAppSelector } from "../../store/hooks";
// import { getPaymentplan } from "../../store/slices/notificationsSlice";

// const initialPrices = {
//   free: {
//     NGN: { month: 0, threeMonths: 0, year: 0 },
//     USD: { month: 0, threeMonths: 0, year: 0 },
//     GBP: { month: 0, threeMonths: 0, year: 0 },
//   },
//   basic: {
//     NGN: { month: 2000, threeMonths: 6000, year: 12000 },
//     USD: { month: 0, threeMonths: 0, year: 0 },
//     GBP: { month: 0, threeMonths: 0, year: 0 },
//   },
//   pro: {
//     NGN: { month: 5000, threeMonths: 15000, year: 55000 },
//     USD: { month: 5, threeMonths: 15, year: 55 },
//     GBP: { month: 4, threeMonths: 12, year: 50 },
//   },
//   premium: {
//     NGN: { month: 20000, threeMonths: 60000, year: 200000 },
//     USD: { month: 20, threeMonths: 60, year: 200 },
//     GBP: { month: 18, threeMonths: 54, year: 190 },
//   },
//   enterprise: {
//     NGN: { month: 100000, threeMonths: 300000, year: 1200000 },
//     USD: { month: 100, threeMonths: 300, year: 1200 },
//     GBP: { month: 96, threeMonths: 288, year: 1180 },
//   },
//   admin: {
//     NGN: { month: 100, threeMonths: 60, year: 50 },
//     USD: { month: 1, threeMonths: 3, year: 1 },
//     GBP: { month: 1, threeMonths: 3, year: 1 },
//   },
// };
// type PlanType = "free" | "basic" | "pro" | "premium" | "enterprise" | "admin";
// const packageMap: Record<PlanType, number> = {
//   free: 1,
//   basic: 5,
//   pro: 2,
//   premium: 3,
//   enterprise: 4,
//   admin: 2,
// };



// const UpgradeSupport = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const [userDetails, setUserDetails] = useState<any>(null);
//   const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
//   const [numberOfTeachers, setNumberOfTeachers] = useState<number>(16);
//   const [duration, setDuration] = useState<string>("1");
//   const [unit, setUnit] = useState<string>("monthly");
//   const [prices, setPrices] = useState(initialPrices);

//   const [calculatedPrice, setCalculatedPrice] = useState<number | 0>(0);
//   const [currency, setCurrency] = useState<string>(
//     localStorage.getItem("selectedCurrency") || "NGN"
//   );
//   const [billingCycle, setBillingCycle] = useState("monthly");
//   const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
//   const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
//   const [couponCode, setCouponCode] = useState<string>("");
//   const [discountPercentage, setDiscountPercentage] = useState<number>(0);
//   const [couponApplied, setCouponApplied] = useState<boolean>(false);
//   const [loadingCoupon, setLoadingCoupon] = useState<boolean>(false);
//   const [couponVerificationMessage, setCouponVerificationMessage] =
//     useState<string>("");
//   const [teacherCountError, setTeacherCountError] = useState<string | null>(
//     null
//   );
//   const { payment, error } = useAppSelector(
//     (state: RootState) => state.notifications
//   );
//   console.log("paymentid", payment?.data[0]?.id)
//   const durations = [
//     { value: "1", label: "1 Month", unit: "monthly" },
//     { value: "2", label: "2 Months", unit: "monthly" },
//     { value: "3", label: "3 Months", unit: "monthly" },
//     { value: "6", label: "6 Months", unit: "monthly" },
//     { value: "12", label: "1 Year", unit: "yearly" },
//     { value: "24", label: "2 Years", unit: "yearly" },
//     { value: "36", label: "3 Years", unit: "yearly" },
//   ];
//     const packageMap = {
//     free: 1,
//     basic: 5,
//     pro: 2,
//     premium: 3,
//     enterprise: 4,
//     admin: 2,
//   };

//   useEffect(() => {
//     const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

//     if (userDetailsFromStorage) {
//       const parsedDetails = JSON.parse(userDetailsFromStorage);
//       setUserDetails(parsedDetails);
//       setIsEmailVerified(parsedDetails.is_email_verified);
//     }
//   }, []);

//   const handleValueChange = (value: string) => {
//     const selectedDuration = durations.find((d) => d.value === value);
//     if (selectedDuration) {
//       setDuration(value);
//       setUnit(selectedDuration.unit);
//     }
//   };

//   const extractDiscountPercentage = (code: string) => {
//     const lastTwoDigits = code.slice(-2);
//     const discount = parseInt(lastTwoDigits, 10);
//     return isNaN(discount) ? 0 : discount;
//   };

//   const handleVerifyCoupon = async () => {
//     setLoadingCoupon(true);
//     setCouponVerificationMessage("");

//     if (couponApplied) {
//       setCouponVerificationMessage("Coupon code has already been applied.");
//       setLoadingCoupon(false);
//       return;
//     }

//     try {
//       const response = await verifyCouponCode(couponCode);
//       console.log(response);
//       if (response.status === "success") {
//         const discount = extractDiscountPercentage(couponCode);
//         setDiscountPercentage(discount);
//         setCouponApplied(true);
//         setCouponVerificationMessage("Coupon code applied successfully!");
//         // Recalculate price with discount
//         calculatePrice();
//       } else {
//         setCouponVerificationMessage(
//           response.message || "Invalid coupon code."
//         );
//         setDiscountPercentage(0);
//         setCouponApplied(false);
//         calculatePrice();
//       }
//     } catch (error: any) {
//       setCouponVerificationMessage("Invalid coupon code");
//       setDiscountPercentage(0);
//       setCouponApplied(false);
//       calculatePrice();
//     } finally {
//       setLoadingCoupon(false);
//     }
//   };

//   const calculatePrice = () => {
//     const pricePerTeacherPerMonth = 1300;
//     const months = parseInt(duration, 10);
//     let totalPrice = numberOfTeachers * pricePerTeacherPerMonth * months;

//     if (couponApplied && discountPercentage > 0) {
//       totalPrice = totalPrice * (1 - discountPercentage / 100);
//     }
//     setCalculatedPrice(totalPrice);
//   };

//   const initiatePayment = async() => {

//     const amount = calculatedPrice;
//       const months = parseInt(duration, 10);
//      const originalPrice = numberOfTeachers * 1300 * months;
//       const payload = {
//         amount,
//         package_id: "4",
//         original_price:originalPrice,
//         interval: unit,
//         currency,
//       };
//    const response = await dispatch(getPaymentplan(payload)).unwrap();
//     if (duration === "12") {
//       setDuration("1");
//     } else if (duration === "24") {
//       setDuration("2");
//     } else if (duration === "36") {
//       setDuration("3");
//     }

//     if (numberOfTeachers < 16) {
//       setTeacherCountError("Number of teachers must be 16 or more.");
//       return;
//     }
//     calculatePrice();
//     setIsPaymentDialogOpen(true);
//   };
//   const getFlutterwaveConfig = (
//     plan: "basic" | "pro" | "premium" | "enterprise" | "admin",
//     payment_plan: string,
//   ) => {
//     const unit = billingCycle === "threeMonths" ? "month" : billingCycle;

//     return {
//       public_key: FLUTTERWAVE_PUBLIC,
//       tx_ref: `TX_${unit}_4_${Date.now()}`,
//       amount: calculatedPrice,
//       currency: currency,
//       payment_options: "card, banktransfer, ussd",
//       payment_plan,
//       customer: {
//         email: userDetails?.email || "default@email.com",
//         phone_number: "08012345678",
//         name: userDetails?.firstname || "Default User",
//       },
//       meta: {
//         package_id: 4,
//         unit: unit,
//         duration: parseInt(duration, 10),
//         no_of_seat: numberOfTeachers,
//         coupon_code: couponApplied ? couponCode : null,
//         discount_percentage: couponApplied ? discountPercentage : 0,
//       },
//       customizations: {
//         title: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
//         description: `Upgrade to ${
//           plan.charAt(0).toUpperCase() + plan.slice(1)
//         } Plan`,
//         logo: Logo,
//       },
//     };
//   };

//   const handlePayment = async (
//     method: "stripe" | "flutterwave",
//     plan: "basic" | "pro" | "premium" | "enterprise" | "admin"
//   ) => {
//     if (numberOfTeachers < 16) {
//       setTeacherCountError("Number of teachers must be 16 or more.");
//       return;
//     }
//     setLoadingPlan(plan);

//     const amount = calculatedPrice;
//     console.log("Selected Payment Method:", method);

//     if (method === "flutterwave") {
//       if (calculatedPrice === null) {
//         console.error(
//           "Calculated price is null. Cannot initiate Flutterwave payment."
//         );
//         setLoadingPlan(null);
//         return;
//       }
//       const payment_plan = payment?.data?.id;
//       const currentConfig = getFlutterwaveConfig("enterprise", payment_plan);

//       const initiateFlutterwavePayment = useFlutterwave(currentConfig);

//       initiateFlutterwavePayment({
//         ...currentConfig,
//         callback: async (response) => {
//           console.log("Flutterwave Response:", response);
//           closePaymentModal();

//           if (response.transaction_id) {
//             try {
//               const verificationResponse = await verifyTransaction(
//                 response.transaction_id
//               );
//               console.log(
//                 "Transaction Verification Response:",
//                 verificationResponse
//               );

//               if (
//                 verificationResponse.status === "success" &&
//                 verificationResponse.data.paymentStatus === "success"
//               ) {
//                 const packageId = 4;
//                 await changeUserPlan(
//                   packageId,
//                   parseInt(userDetails?.id || "0", 10),
//                   1,
//                   billingCycle,
//                   currency,
//                   numberOfTeachers
//                 );

//                 navigate("/dashboard/success?status=success");
//               } else {
//                 console.error(
//                   "Transaction verification failed:",
//                   verificationResponse.message ||
//                     verificationResponse.data.message ||
//                     "Unknown verification error."
//                 );
//                 navigate("/dashboard/success?status=failed");
//               }
//             } catch (err) {
//               navigate("/dashboard/success?status=failed");
//             }
//           } else {
//             console.warn(
//               "Flutterwave response received with no transaction ID:",
//               response
//             );
//             if (
//               response.status === "cancelled" ||
//               response.status === "failed"
//             ) {
//               navigate("/dashboard/success?status=failed");
//             } else {
//               console.warn(
//                 "Unexpected Flutterwave status without transaction ID."
//               );
//               navigate("/dashboard/success?status=unknown");
//             }
//           }
//           setLoadingPlan(null);
//         },
//         onClose: () => {
//           setLoadingPlan(null);
//           navigate("/dashboard/success?status=closed");
//         },
//       });
//     } else if (method === "stripe") {
//       const token = Cookies.get("at-refreshToken");
//       if (!token) {
//         console.error("No refresh token found");
//         setLoadingPlan(null);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           "https://vd.aiteacha.com/api/payment/stripe/initiate",
//           {
//             user_id: parseInt(userDetails?.id || "0", 10),
//             package_id: 4,
//             amount: amount,
//             currency: currency,
//             interval: unit,
//             no_of_seat: numberOfTeachers,
//             coupon_code: couponApplied ? couponCode : null,

//             discount_percentage: couponApplied ? discountPercentage : 0,
//             success_url: `${window.location.origin}/dashboard/payment-status?status=success&session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${window.location.origin}/dashboard/payment-status?status=cancelled`,
//             metadata: {
//               userId: userDetails?.id.toString(),
//               packageId: "4",
//               duration: duration,
//               unit: unit,
//               noOfSeat: numberOfTeachers.toString(),
//               couponCode: couponApplied ? couponCode : "null",
//               discountPercentage: couponApplied
//                 ? discountPercentage.toString()
//                 : "0",
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.data.status === "success") {
//           const paymentLink = response.data.data.paymentLink;
//           window.open(paymentLink, "_blank");
//         } else {
//           console.error(
//             "Error creating Stripe session:",
//             response.data.message
//           );
//           navigate("/dashboard/success?status=failed");
//         }
//       } catch (error) {
//         console.error("Error initiating Stripe payment:", error);
//         navigate("/dashboard/success?status=failed");
//       } finally {
//         setLoadingPlan(null);
//       }
//     }
//   };

//   const getCurrencySign = (currency: string) => {
//     if (currency === "NGN") {
//       return "₦";
//     } else if (currency === "USD") {
//       return "$";
//     } else if (currency === "GBP") {
//       return "£";
//     }
//     return "";
//   };

//   return (
//     <div className="mt-4">
//       {userDetails && isEmailVerified === 1 && (
//         <div
//           className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
//           style={{
//             background:
//               "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
//           }}
//         >
//           <span className="text-center text-xl font-bold">
//             Teachers Are Heroes🎉
//           </span>
//         </div>
//       )}

//       <div className="flex flex-col gap-4">
//         <div className="flex items-center gap-2">
//           <Input
//             type="text"
//             placeholder="Enter coupon code"
//             value={couponCode}
//             onChange={(e) => setCouponCode(e.target.value)}
//             className="w-full sm:w-1/2"
//           />
//           <Button
//             variant="gray"
//             onClick={handleVerifyCoupon}
//             disabled={loadingCoupon || couponApplied}
//             className="rounded-md"
//           >
//             {loadingCoupon
//               ? "Verifying..."
//               : couponApplied
//               ? "Applied"
//               : "Apply Coupon"}
//           </Button>
//         </div>
//         {couponVerificationMessage && (
//           <p
//             className={
//               couponApplied ? "text-green-500 text-sm" : "text-red-500 text-sm"
//             }
//           >
//             {couponVerificationMessage}
//           </p>
//         )}

//         <div className="flex justify-end gap-2">
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button
//                 variant={"gradient"}
//                 className="flex items-center w-fit h-full max-h-10 gap-3 py-2 rounded-md"
//               >
//                 Price Calculator
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogTitle className="text-center">
//                 AiTeacha Enterprise Calculator
//               </DialogTitle>
//               <p>
//                 The AiTeacha Enterprise Plan Calculator offers personalized
//                 pricing for schools with 15+ educators, considering specific
//                 needs. Generate custom quotes easily and unlock premium
//                 features, tools, and dedicated support to revolutionize
//                 education at scale.
//               </p>
//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Number of Teachers
//                 </label>
//                 <Input
//                   type="number"
//                   min="16"
//                   value={numberOfTeachers}
//                   onChange={(e) => {
//                     const value = Number(e.target.value);
//                     setNumberOfTeachers(value);
//                     if (value < 16) {
//                       setTeacherCountError(
//                         "Number of teachers must be 16 or more."
//                       );
//                     } else {
//                       setTeacherCountError(null);
//                     }
//                   }}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-500"
//                 />

//                 {teacherCountError && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {teacherCountError}
//                   </p>
//                 )}
//               </div>
//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-4">
//                   Duration
//                 </label>
//                 <Select value={duration} onValueChange={handleValueChange}>
//                   <SelectTrigger className="-my-4">
//                     <SelectValue placeholder="Select Duration" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {durations.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="mt-4">
//                 <Button
//                   variant="gradient"
//                   onClick={calculatePrice}
//                   className="w-full rounded-md"
//                 >
//                   Calculate Price
//                 </Button>
//               </div>
//               {calculatedPrice !== null && (
//                 <div className="">
//                   <div className="mt-4">
//                     <p className="text-xl font-semibold">
//                       Calculated Price: {getCurrencySign(currency)}
//                       {calculatedPrice
//                         ? calculatedPrice.toLocaleString()
//                         : "Not Calculated"}
//                       {couponApplied && discountPercentage > 0 && (
//                         <span className="text-green-500 ml-2">
//                           (-{discountPercentage}%)
//                         </span>
//                       )}
//                     </p>
//                     {couponApplied && discountPercentage > 0 && (
//                       <p className="text-sm text-gray-500">
//                         Original Price: {getCurrencySign(currency)}
//                         {(
//                           calculatedPrice /
//                           (1 - discountPercentage / 100)
//                         ).toLocaleString()}
//                       </p>
//                     )}
//                   </div>
//                   <div className="mt-4">
//                     <Button
//                       onClick={initiatePayment}
//                       className="w-full rounded-md bg-blue-600"
//                     >
//                       Continue to Payment
//                     </Button>
//                     {!couponApplied && couponCode && (
//                       <p className="text-yellow-900 text-sm mt-2">
//                         Please apply the coupon code to get the discount.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>
//       <div className="flex items-center text-xl mt-6 font-bold rounded-md text-black w-full gap-12">
//         <main className="w-1/2">
//           <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
//             <div className="max-w-xl space-y-3">
//               <h3 className="text-primary font-semibold">
//                 Request an AiTeacha quote!
//               </h3>
//               <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
//                 We are so excited to be partnering with you!
//               </p>
//               <p>
//                 Please email us at:
//                 <br />
//                 <a href="mailto:quotes@curipod.com" className="text-primary">
//                   quotes@aiteacha.com
//                 </a>
//               </p>
//               <p>
//                 Questions or concerns? Contact Uche at:
//                 <a
//                   href="mailto:amanda.aitkens@curipod.com"
//                   className="text-primary"
//                 >
//                   uchenwaobi@aiteacha.com
//                 </a>{" "}
//                 ||
//                 <a href="tel:+4792943686" className="text-primary">
//                   +234 803-8563-171,
//                 </a>
//               </p>
//             </div>
//           </div>
//         </main>

//         <div className="w-1/2">
//           <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
//             <div className="max-w-xl space-y-3">
//               <h3 className="text-primary font-semibold">Please include:</h3>
//               <ul className="list-disc space-y-2">
//                 <li>Your name</li>
//                 <li>Email</li>
//                 <li>Number of schools you want AiTeacha for</li>
//                 <li>Your school's name</li>
//                 <li>Your district's name</li>
//                 <li>Your role at your school/district</li>
//                 <li>...and anything else we should know.</li>
//               </ul>
//               <p>
//                 You will receive a formal quote within 24 hours of your request.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <PaymentMethodDialog
//         planName={"enterprise"}
//         onSelectPaymentMethod={handlePayment}
//         isOpen={isPaymentDialogOpen}
//         onClose={() => setIsPaymentDialogOpen(false)}
//         currency={currency}
//       />
//     </div>
//   );
// };

// export default UpgradeSupport;


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
import PaymentMethodDialog from "./UpgradeDialog";
import { changeUserPlan, verifyCouponCode } from "../../api/subscription";
import Cookies from "js-cookie";
import axios from "axios";
import Logo from "../../assets/img/logo.png";
import { BACKEND_URL, FLUTTERWAVE_PUBLIC } from "../../lib/utils";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useNavigate } from "react-router-dom";
import { verifyTransaction } from "../../api/subscription";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/hooks";
import { getPaymentplan } from "../../store/slices/notificationsSlice";
import { PlanNameType } from "./Upgrade";

const initialPrices = {
  free: {
    NGN: { month: 0, threeMonths: 0, year: 0 },
    USD: { month: 0, threeMonths: 0, year: 0 },
    GBP: { month: 0, threeMonths: 0, year: 0 },
  },
  basic: {
    NGN: { month: 2000, threeMonths: 6000, year: 12000 },
    USD: { month: 0, threeMonths: 0, year: 0 },
    GBP: { month: 0, threeMonths: 0, year: 0 },
  },
  pro: {
    NGN: { month: 5000, threeMonths: 15000, year: 55000 },
    USD: { month: 5, threeMonths: 15, year: 55 },
    GBP: { month: 4, threeMonths: 12, year: 50 },
  },
  premium: {
    NGN: { month: 20000, threeMonths: 60000, year: 200000 },
    USD: { month: 20, threeMonths: 60, year: 200 },
    GBP: { month: 18, threeMonths: 54, year: 190 },
  },
  enterprise: {
    NGN: { month: 100000, threeMonths: 300000, year: 1200000 },
    USD: { month: 100, threeMonths: 300, year: 1200 },
    GBP: { month: 96, threeMonths: 288, year: 1180 },
  },
  admin: {
    NGN: { month: 100, threeMonths: 60, year: 50 },
    USD: { month: 1, threeMonths: 3, year: 1 },
    GBP: { month: 1, threeMonths: 3, year: 1 },
  },
};
type PlanType = "free" | "basic" | "pro" | "premium" | "enterprise" | "admin";
const packageMap: Record<PlanType, number> = {
  free: 1,
  basic: 5,
  pro: 2,
  premium: 3,
  enterprise: 4,
  admin: 2,
};



const UpgradeSupport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const [numberOfTeachers, setNumberOfTeachers] = useState<number>(16);
  const [duration, setDuration] = useState<string>("1");
  const [unit, setUnit] = useState<string>("monthly");
  const [prices, setPrices] = useState(initialPrices);

  const [calculatedPrice, setCalculatedPrice] = useState<number | 0>(0);
  const [currency, setCurrency] = useState<string>(
    localStorage.getItem("selectedCurrency") || "NGN"
  );
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [loadingCoupon, setLoadingCoupon] = useState<boolean>(false);
  const [couponVerificationMessage, setCouponVerificationMessage] =
    useState<string>("");
  const [teacherCountError, setTeacherCountError] = useState<string | null>(
    null
  );
  const { payment, error } = useAppSelector(
    (state: RootState) => state.notifications
  );
  console.log("paymentid", payment?.data[0]?.id)
  const durations = [
    { value: "1", label: "1 Month", unit: "monthly" },
    { value: "2", label: "2 Months", unit: "monthly" },
    { value: "3", label: "3 Months", unit: "monthly" },
    { value: "6", label: "6 Months", unit: "monthly" },
    { value: "12", label: "1 Year", unit: "yearly" },
    { value: "24", label: "2 Years", unit: "yearly" },
    { value: "36", label: "3 Years", unit: "yearly" },
  ];
  const packageMap = {
    free: 1,
    basic: 5,
    pro: 2,
    premium: 3,
    enterprise: 4,
    admin: 2,
  };

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

  const extractDiscountPercentage = (code: string) => {
    const lastTwoDigits = code.slice(-2);
    const discount = parseInt(lastTwoDigits, 10);
    return isNaN(discount) ? 0 : discount;
  };

  const handleVerifyCoupon = async () => {
    setLoadingCoupon(true);
    setCouponVerificationMessage("");

    if (couponApplied) {
      setCouponVerificationMessage("Coupon code has already been applied.");
      setLoadingCoupon(false);
      return;
    }

    try {
      const response = await verifyCouponCode({ couponCode, userType: "school" });
      console.log(response);
      if (response.status === "success") {
        const discount = extractDiscountPercentage(couponCode);
        setDiscountPercentage(discount);
        setCouponApplied(true);
        setCouponVerificationMessage("Coupon code applied successfully!");
        // Recalculate price with discount
        calculatePrice();
      } else {
        setCouponVerificationMessage(
          response.message || "Invalid coupon code."
        );
        setDiscountPercentage(0);
        setCouponApplied(false);
        calculatePrice();
      }
    } catch (error: any) {
      setCouponVerificationMessage("Invalid coupon code");
      setDiscountPercentage(0);
      setCouponApplied(false);
      calculatePrice();
    } finally {
      setLoadingCoupon(false);
    }
  };

  const calculatePrice = () => {
    const pricePerTeacherPerMonth = 1300;
    const months = parseInt(duration, 10);
    let totalPrice = numberOfTeachers * pricePerTeacherPerMonth * months;

    if (couponApplied && discountPercentage > 0) {
      totalPrice = totalPrice * (1 - discountPercentage / 100);
    }
    setCalculatedPrice(totalPrice);
  };

  const initiatePayment = async () => {

    const amount = calculatedPrice;
    const months = parseInt(duration, 10);
    const originalPrice = numberOfTeachers * 1300 * months;
    const payload = {
      amount,
      package_id: "4",
      original_price: originalPrice,
      interval: unit,
      currency,
    };
    const response = await dispatch(getPaymentplan(payload)).unwrap();
    if (duration === "12") {
      setDuration("1");
    } else if (duration === "24") {
      setDuration("2");
    } else if (duration === "36") {
      setDuration("3");
    }

    if (numberOfTeachers < 16) {
      setTeacherCountError("Number of teachers must be 16 or more.");
      return;
    }
    calculatePrice();
    setIsPaymentDialogOpen(true);
  };
  const getFlutterwaveConfig = (
    plan: "basic" | "pro" | "premium" | "enterprise" | "admin",
    payment_plan: string,
  ) => {
    const unit = billingCycle === "threeMonths" ? "month" : billingCycle;

    return {
      public_key: FLUTTERWAVE_PUBLIC,
      tx_ref: `TX_${unit}_4_${Date.now()}`,
      amount: calculatedPrice,
      currency: currency,
      payment_options: "card, banktransfer, ussd",
      payment_plan,
      customer: {
        email: userDetails?.email || "default@email.com",
        phone_number: "08012345678",
        name: userDetails?.firstname || "Default User",
      },
      meta: {
        package_id: 4,
        unit: unit,
        duration: parseInt(duration, 10),
        no_of_seat: numberOfTeachers,
        coupon_code: couponApplied ? couponCode : null,
        discount_percentage: couponApplied ? discountPercentage : 0,
      },
      customizations: {
        title: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        description: `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)
          } Plan`,
        logo: Logo,
      },
    };
  };

  const handlePayment = async (
    method: "stripe" | "flutterwave",
    plan: PlanNameType
  ) => {
    if (numberOfTeachers < 16) {
      setTeacherCountError("Number of teachers must be 16 or more.");
      return;
    }
    setLoadingPlan(plan);

    const amount = calculatedPrice;
    console.log("Selected Payment Method:", method);

    if (method === "flutterwave") {
      if (calculatedPrice === null) {
        console.error(
          "Calculated price is null. Cannot initiate Flutterwave payment."
        );
        setLoadingPlan(null);
        return;
      }
      const payment_plan = payment?.data?.id;
      const currentConfig = getFlutterwaveConfig("enterprise", payment_plan);

      const initiateFlutterwavePayment = useFlutterwave(currentConfig);

      initiateFlutterwavePayment({
        ...currentConfig,
        callback: async (response) => {
          console.log("Flutterwave Response:", response);
          closePaymentModal();

          if (response.transaction_id) {
            try {
              const verificationResponse = await verifyTransaction(
                response.transaction_id
              );
              console.log(
                "Transaction Verification Response:",
                verificationResponse
              );

              if (
                verificationResponse.status === "success" &&
                verificationResponse.data.paymentStatus === "success"
              ) {
                const packageId = 4;
                await changeUserPlan(
                  packageId,
                  parseInt(userDetails?.id || "0", 10),
                  1,
                  billingCycle,
                  currency,
                  numberOfTeachers
                );

                navigate("/dashboard/success?status=success");
              } else {
                console.error(
                  "Transaction verification failed:",
                  verificationResponse.message ||
                  verificationResponse.data.message ||
                  "Unknown verification error."
                );
                navigate("/dashboard/success?status=failed");
              }
            } catch (err) {
              navigate("/dashboard/success?status=failed");
            }
          } else {
            console.warn(
              "Flutterwave response received with no transaction ID:",
              response
            );
            if (
              response.status === "cancelled" ||
              response.status === "failed"
            ) {
              navigate("/dashboard/success?status=failed");
            } else {
              console.warn(
                "Unexpected Flutterwave status without transaction ID."
              );
              navigate("/dashboard/success?status=unknown");
            }
          }
          setLoadingPlan(null);
        },
        onClose: () => {
          setLoadingPlan(null);
          navigate("/dashboard/success?status=closed");
        },
      });
    } else if (method === "stripe") {
      const token = Cookies.get("at-refreshToken");
      if (!token) {
        console.error("No refresh token found");
        setLoadingPlan(null);
        return;
      }

      try {
        const response = await axios.post(
          `${BACKEND_URL}payment/stripe/initiate`,
          {
            user_id: parseInt(userDetails?.id || "0", 10),
            package_id: 4,
            amount: amount,
            currency: currency,
            interval: unit,
            no_of_seat: numberOfTeachers,
            coupon_code: couponApplied ? couponCode : null,

            discount_percentage: couponApplied ? discountPercentage : 0,
            success_url: `${window.location.origin}/dashboard/payment-status?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/dashboard/payment-status?status=cancelled`,
            metadata: {
              userId: userDetails?.id.toString(),
              packageId: "4",
              duration: duration,
              unit: unit,
              noOfSeat: numberOfTeachers.toString(),
              couponCode: couponApplied ? couponCode : "null",
              discountPercentage: couponApplied
                ? discountPercentage.toString()
                : "0",
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          const paymentLink = response.data.data.paymentLink;
          window.open(paymentLink, "_blank");
        } else {
          console.error(
            "Error creating Stripe session:",
            response.data.message
          );
          navigate("/dashboard/success?status=failed");
        }
      } catch (error) {
        console.error("Error initiating Stripe payment:", error);
        navigate("/dashboard/success?status=failed");
      } finally {
        setLoadingPlan(null);
      }
    }
  };

  const getCurrencySign = (currency: string) => {
    if (currency === "NGN") {
      return "₦";
    } else if (currency === "USD") {
      return "$";
    } else if (currency === "GBP") {
      return "£";
    }
    return "";
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

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full sm:w-1/2"
          />
          <Button
            variant="gray"
            onClick={handleVerifyCoupon}
            disabled={loadingCoupon || couponApplied}
            className="rounded-md"
          >
            {loadingCoupon
              ? "Verifying..."
              : couponApplied
                ? "Applied"
                : "Apply Coupon"}
          </Button>
        </div>
        {couponVerificationMessage && (
          <p
            className={
              couponApplied ? "text-green-500 text-sm" : "text-red-500 text-sm"
            }
          >
            {couponVerificationMessage}
          </p>
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
                AiTeacha Enterprise Calculator
              </DialogTitle>
              <p>
                The AiTeacha Enterprise Plan Calculator offers personalized
                pricing for schools with 15+ educators, considering specific
                needs. Generate custom quotes easily and unlock premium
                features, tools, and dedicated support to revolutionize
                education at scale.
              </p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Teachers
                </label>
                <Input
                  type="number"
                  min="16"
                  value={numberOfTeachers}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setNumberOfTeachers(value);
                    if (value < 16) {
                      setTeacherCountError(
                        "Number of teachers must be 16 or more."
                      );
                    } else {
                      setTeacherCountError(null);
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-500"
                />

                {teacherCountError && (
                  <p className="text-red-500 text-sm mt-1">
                    {teacherCountError}
                  </p>
                )}
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
                    <div className="flex gap-2">
                      <p className="text-xl font-semibold">
                        Calculated Price: {getCurrencySign(currency)}
                        {calculatedPrice
                          ? calculatedPrice.toLocaleString()
                          : "Not Calculated"}
                        {couponApplied && discountPercentage > 0 && (
                          <span className="text-green-500 ml-2">
                            (-{discountPercentage}%)
                          </span>
                        )}
                      </p>
                      {calculatedPrice > 0 && (
                        <span className="text-red-500 line-through decoration-red-500 text-lg">
                          {getCurrencySign(currency)}
                          {Math.round(
                            numberOfTeachers *
                            (20000 / 15) *
                            parseInt(duration, 10)
                          ).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {couponApplied && discountPercentage > 0 && (
                      <p className="text-sm text-gray-500">
                        Original Price: {getCurrencySign(currency)}
                        {(
                          calculatedPrice /
                          (1 - discountPercentage / 100)
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={initiatePayment}
                      className="w-full rounded-md bg-blue-600"
                    >
                      Continue to Payment
                    </Button>
                    {!couponApplied && couponCode && (
                      <p className="text-yellow-900 text-sm mt-2">
                        Please apply the coupon code to get the discount.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex items-center text-xl mt-6 font-bold rounded-md text-black w-full gap-12">
        <main className="w-1/2">
          <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
            <div className="max-w-xl space-y-3">
              <h3 className="text-primary font-semibold">
                Request an AiTeacha quote!
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
                <li>Number of schools you want AiTeacha for</li>
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

      <PaymentMethodDialog
        planName={"enterprise"}
        onSelectPaymentMethod={handlePayment}
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        currency={currency}
      />
    </div>
  );
};

export default UpgradeSupport;