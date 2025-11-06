import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { changeUserPlan } from "../../api/subscription";
import { BACKEND_URL, FLUTTERWAVE_PUBLIC } from "../../lib/utils";
import Logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PricingFaq from "../Landing/components/PricingFaq";
import PaymentMethodDialog from "./UpgradeDialog";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Switch } from "../../components/ui/Switch";
import { verifyCouponCode } from "../../api/subscription";
import { selectUser, loadUserProfile } from "../../store/slices/profileSlice";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { verifyTransaction } from "../../api/subscription";
import { useAppSelector } from "../../store/hooks";
import { getPaymentplan } from "../../store/slices/notificationsSlice";
import { IoCheckmark } from "react-icons/io5";

export type PlanNameType =
  | "basic"
  | "pro"
  | "premium"
  | "enterprise"
  | "admin"
  | "diamond";

interface UserDetails {
  id: string;
  email: string;
  role: number;
  package: string;
  firstname: string;
  package_status: string;
}
type PeriodMapKeys = "month" | "year" | "infinity";
type PlanType =
  | "free"
  | "basic"
  | "pro"
  | "premium"
  | "enterprise"
  | "admin"
  | "diamond";
type CurrencyType = "NGN" | "USD" | "GBP";
type BillingCycleType = "month" | "quarter" | "year" | "term";
type PlanPrices = {
  [C in CurrencyType]: {
    [B in BillingCycleType]: number;
  };
};
type PricesStructure = {
  [K in PlanType]: PlanPrices;
};
const initialPrices = {
  free: {
    NGN: { month: 0, quarter: 0, year: 0, term: 0 },
    USD: { month: 0, quarter: 0, year: 0, term: 0 },
    GBP: { month: 0, quarter: 0, year: 0, term: 0 },
  },
  basic: {
    NGN: { month: 2000, quarter: 6000, year: 24000, term: 8000 },
    USD: { month: 0, quarter: 0, year: 0, term: 0 },
    GBP: { month: 0, quarter: 0, year: 0, term: 0 },
  },
  pro: {
    NGN: { month: 5000, quarter: 15000, year: 55000, term: 20000 },
    USD: { month: 5, quarter: 15, year: 55, term: 20 },
    GBP: { month: 4, quarter: 12, year: 50, term: 16 },
  },
  premium: {
    NGN: { month: 20000, quarter: 60000, year: 200000, term: 70000 },
    USD: { month: 20, quarter: 60, year: 200, term: 80 },
    GBP: { month: 18, quarter: 54, year: 190, term: 72 },
  },
  enterprise: {
    NGN: { month: 100000, quarter: 300000, year: 1200000, term: 300000 },
    USD: { month: 100, quarter: 300, year: 1200, term: 300 },
    GBP: { month: 96, quarter: 288, year: 1180, term: 288 },
  },
  diamond: {
    NGN: { month: 40000, quarter: 300000, year: 450000, term: 150000 },
    USD: { month: 27, quarter: 200, year: 302, term: 100 },
    GBP: { month: 36, quarter: 108, year: 234, term: 78 },
  },

  admin: {
    NGN: { month: 100, quarter: 60, year: 50, term: 100 },
    USD: { month: 1, quarter: 3, year: 1, term: 1 },
    GBP: { month: 1, quarter: 3, year: 1, term: 1 },
  },
};

const currencies = [
  {
    code: "NGN",
    name: "Naira",
    flag: "https://flagcdn.com/w40/ng.png",
  },
  {
    code: "USD",
    name: "Dollar",
    flag: "https://flagcdn.com/w40/us.png",
  },
  {
    code: "GBP",
    name: "Pounds",
    flag: "https://flagcdn.com/w40/gb.png",
  },
];

const Upgrade: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [prices, setPrices] = useState(initialPrices);
  const [billingCycle, setBillingCycle] = useState<
    "month" | "quarter" | "year" | "term"
  >("month");
  //  console.log(billingCycle, "unit")

  const [currency, setCurrency] = useState<"NGN" | "USD" | "GBP">("NGN");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<
    "basic" | "pro" | "premium" | "enterprise" | "admin" | null | "diamond"
  >(null);
  const [loadingPlan, setLoadingPlan] = useState<null | string>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [schoolCouponCode, setSchoolCouponCode] = useState("");

  const [loadingTeacherCoupon, setLoadingTeacherCoupon] = useState(false);
  const [loadingSchoolCoupon, setLoadingSchoolCoupon] = useState(false);


  const [allowedBillingCycles, setAllowedBillingCycles] = useState<
    BillingCycleType[]
  >(["month", "quarter", "year", "term"]);

  const [verificationMessage, setVerificationMessage] = useState("");
  const [schoolVerificationMessage, setSchoolVerificationMessage] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [schoolCouponApplied, setSchoolCouponApplied] = useState(false);
  const [payment_planId, setFlwId] = useState<number | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [couponState, setCouponState] = useState("");

  const { error } = useAppSelector((state: RootState) => state.notifications);
  const user = useSelector(selectUser);

  const selectedCurrency = currencies.find((c) => c.code === currency);
  // console.log("id", payment?.data?.id)

  useEffect(() => {
    if (discountPercentage === 0) {
      setPrices(initialPrices);
      return;
    }
    const discountedPrices = JSON.parse(
      JSON.stringify(initialPrices)
    ) as PricesStructure;

    const targetPlans: PlanType[] =
      couponState === "teacher"
        ? ["basic", "pro"]
        : couponState === "school"
        ? ["premium", "diamond"]
        : [];
    Object.keys(discountedPrices).forEach((planKey) => {
      const plan = planKey as PlanType;
      if (targetPlans.includes(plan)) {
        Object.keys(discountedPrices[plan]).forEach((currKey) => {
          const curr = currKey as CurrencyType;
          if (typeof discountedPrices[plan][curr].month === "number") {
            const applyDiscount = (originalPrice: number) =>
              originalPrice - (originalPrice * discountPercentage) / 100;
            discountedPrices[plan][curr].month = applyDiscount(
              initialPrices[plan][curr].month
            );
            discountedPrices[plan][curr].quarter = applyDiscount(
              initialPrices[plan][curr].quarter
            );
            discountedPrices[plan][curr].year = applyDiscount(
              initialPrices[plan][curr].year
            );
          }
        });
      }
    });

    setPrices(discountedPrices);
  }, [discountPercentage, couponState]);

  useEffect(() => {
    const storedUser = localStorage.getItem("ai-teacha-user");
    if (storedUser) {
      const userData: UserDetails = JSON.parse(storedUser);
      setUserDetails(userData);
    }
    const fetchUserLocation = async () => {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();

        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json();
        switch (geoData.country) {
          case "NG":
            setCurrency("NGN");
            localStorage.setItem("selectedCurrency", "NGN");
            break;
          case "US":
            setCurrency("USD");
            localStorage.setItem("selectedCurrency", "USD");
            break;
          case "GB":
            setCurrency("GBP");
            localStorage.setItem("selectedCurrency", "GBP");
            break;
          default:
            setCurrency("USD");
            localStorage.setItem("selectedCurrency", "USD");
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("ai-teacha-user", JSON.stringify(user));
    }
  }, [user]);

  const noOfSeats =
    selectedPlan === "pro"
      ? "1"
      : selectedPlan === "premium"
      ? "15"
      : selectedPlan === "diamond"
      ? "30"
      : "0";

  const packageMap = {
    free: 1,
    basic: 5,
    pro: 2,
    premium: 3,
    enterprise: 4,
    admin: 2,
    diamond: 6,
  };
  const getFlutterwaveConfig = (
    plan: "basic" | "pro" | "premium" | "enterprise" | "admin" | "diamond",
    userDetails: UserDetails | null,
    billingCycle: "month" | "quarter" | "year" | "term",
    currency: CurrencyType,
    prices: typeof initialPrices,
    noOfSeats: string
  ) => {
    const unit = billingCycle;
    const duration = billingCycle === "quarter" ? 1 : 1;
    const originalAmount = initialPrices[plan][currency][billingCycle];

    return {
      public_key: FLUTTERWAVE_PUBLIC,
      tx_ref: `TX_${unit}_${packageMap[plan]}_${Date.now()}`,
      amount: prices[plan][currency][billingCycle],
      currency: currency,
      payment_options: "card",
      customer: {
        email: userDetails?.email || "default@email.com",
        phone_number: "08012345678",
        name: userDetails?.firstname || "Default User",
      },
      meta: {
        package_id: packageMap[plan],
        unit: unit,
        duration: duration,
        no_of_seat: noOfSeats,
        original_price: originalAmount,
        coupon_code: couponCode || schoolCouponCode || "",
      },
      customizations: {
        title: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        description: `Upgrade to ${
          plan.charAt(0).toUpperCase() + plan.slice(1)
        } Plan`,
        logo: Logo,
      },
    };
  };
  const handlePayment = async (
    method: "stripe" | "flutterwave",
    plan: PlanNameType
  ) => {
    setLoadingPlan(plan);
    setSelectedPlan(plan);

    const amount = prices[plan][currency][billingCycle];
    const duration = billingCycle === "quarter" ? 3 : 1;
    const unit = billingCycle === "quarter" ? "quarter" : billingCycle;

    const originalAmount = initialPrices[plan][currency][billingCycle];

    if (method === "flutterwave") {
      const currentConfig = getFlutterwaveConfig(
        plan,
        userDetails,
        unit,
        currency,
        prices,
        noOfSeats
      );
      console.log("flutterwave payload", currentConfig);
      const handleFlutterwavePayment = useFlutterwave(currentConfig);
      handleFlutterwavePayment({
        ...currentConfig,
        callback: async (response) => {
          console.log("Flutterwave Response:", response);
          closePaymentModal();

          if (response.transaction_id) {
            try {
              const verificationResponse = await verifyTransaction(
                response.transaction_id
              );

              if (
                verificationResponse.status === "success" ||
                verificationResponse?.paymentStatus === "success"
              ) {
                const packageId = packageMap[plan];
                const noOfSeatsToUpdate =
                  plan === "pro" ? "1" : plan === "premium" ? "15" : noOfSeats;

                await changeUserPlan(
                  packageId,
                  parseInt(userDetails?.id || "0", 10),
                  duration,
                  unit,
                  currency,
                  noOfSeatsToUpdate
                );
                console.log(
                  "User plan updated successfully after verification."
                );
                dispatch(loadUserProfile());
                if (user) {
                  localStorage.setItem("ai-teacha-user", JSON.stringify(user));
                }
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
              console.error(
                "Error during transaction verification or plan update:",
                err
              );
              navigate("/dashboard/success?status=failed");
            }
          } else if (
            response.status === "cancelled" ||
            response.status === "failed"
          ) {
            console.error(
              "Payment explicitly failed in Flutterwave, no transaction ID to verify."
            );
            navigate("/dashboard/success?status=failed");
          } else {
            console.warn(
              "Received Flutterwave response with no transaction ID and non-failed status:",
              response
            );
            navigate("/dashboard/success?status=unknown");
          }
          setLoadingPlan(null);
        },
        onClose: () => {
          console.log("Payment modal closed by user.");
          setLoadingPlan(null);
          navigate("/dashboard/success?status=closed");
        },
      });
    } else if (method === "stripe") {
      const token = Cookies.get("at-refreshToken");
      if (!token) {
        console.error("No refresh token found");
        setLoadingPlan(null);
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          `${BACKEND_URL}payment/stripe/initiate`,
          {
            user_id: parseInt(userDetails?.id || "0", 10),
            package_id: packageMap[plan],
            amount: amount,
            currency: currency,
            interval: unit,
            no_of_seat:
              plan === "pro" ? "1" : plan === "premium" ? "15" : noOfSeats,
            success_url: `${window.location.origin}/dashboard/success?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/dashboard/success?status=cancelled`,
            metadata: {
              userId: userDetails?.id.toString(),
              packageId: packageMap[plan].toString(),
              plan: plan,
              billingCycle: billingCycle,
              currency: currency,
              noOfSeats: (plan === "pro"
                ? "1"
                : plan === "premium"
                ? "15"
                : noOfSeats
              ).toString(),
              duration: duration,
            },
            original_price: originalAmount,
            coupon_code: couponCode || schoolCouponCode || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          const paymentLink = response.data.data.paymentLink;
          window.location.href = paymentLink;
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
  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCurrency = event.target.value as "NGN" | "USD" | "GBP";
    setCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
  };

  const getCurrencySign = (currency: "NGN" | "USD" | "GBP") => {
    if (currency === "NGN") {
      return "₦";
    } else if (currency === "USD") {
      return "$";
    } else if (currency === "GBP") {
      return "£";
    }
    return "";
  };

  type PlanType = keyof typeof prices;
  type CurrencyType = keyof (typeof prices)[PlanType];

  const extractDiscountPercentage = (code: string) => {
    const lastTwoDigits = code.slice(-2);
    const discount = parseInt(lastTwoDigits, 10);
    return isNaN(discount) ? 0 : discount;
  };

  // const handleVerifyCoupon = async (userType: "teacher" | "school") => {
  //   setLoading(true);
  //   setCouponState(userType);
  //   setVerificationMessage("");

  //   setDiscountPercentage(0);
  //   setSchoolCouponCode("");
  //   setSchoolCouponApplied(false);
  //   setSchoolVerificationMessage("");

  //   // if (couponApplied) {
  //   //   setVerificationMessage("Coupon code has already been applied.");
  //   //   setLoading(false);
  //   //   return;
  //   // }

  //   try {
  //     const response = await verifyCouponCode({
  //       couponCode,
  //       userType,
  //     });

  //     if (
  //       response.status === "success" &&
  //       response.data &&
  //       response.data.length > 0
  //     ) {
  //       const couponData = response.data[0];
  //       const discount = extractDiscountPercentage(couponData.coupon_code);
  //       const couponPeriod: string = couponData.subscription_period;

  //       localStorage.setItem("couponApplied", "true");
  //       setDiscountPercentage(discount);
  //       setCouponApplied(true);
  //       let newBillingCycle: BillingCycleType;
  //       let newAllowedCycles: BillingCycleType[];

  //       switch (couponPeriod) {
  //         case "month":
  //           newBillingCycle = "month";
  //           newAllowedCycles = ["month"];
  //           break;
  //         case "year":
  //           newBillingCycle = "year";
  //           newAllowedCycles = ["year"];
  //           break;
  //         case "infinity":
  //           newBillingCycle = "month";
  //           newAllowedCycles = ["month", "quarter", "year", "term"];
  //           break;
  //         case "term":
  //           newBillingCycle = "term";
  //           newAllowedCycles = ["term"];
  //           break;
  //         default:
  //           newBillingCycle = "month";
  //           newAllowedCycles = ["month", "quarter", "year", "term"];
  //       }

  //       setBillingCycle(newBillingCycle);
  //       setAllowedBillingCycles(newAllowedCycles);
  //       setVerificationMessage("Coupon code applied successfully!");
  //     } else {
  //       setCouponApplied(false);
  //       setDiscountPercentage(0);
  //       setBillingCycle("month");
  //       setVerificationMessage("Invalid coupon code");
  //     }
  //   } catch (error: any) {
  //     setCouponApplied(false);
  //     setDiscountPercentage(0);
  //     setBillingCycle("month");
  //     setVerificationMessage("Invalid or Expired coupon code.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const handleVerifyCoupon = async (userType: "teacher" | "school") => {
  setLoading(true);
  setCouponState(userType);
  setVerificationMessage("");

  // reset previous coupon state
  setDiscountPercentage(0);
  setCouponApplied(false);
  setSchoolCouponCode("");
  setSchoolCouponApplied(false);
  setSchoolVerificationMessage("");

  try {
    const response = await verifyCouponCode({
      couponCode,
      userType,
    });

    if (
      response.status === "success" &&
      response.data &&
      response.data.length > 0
    ) {
      const couponData = response.data[0];
      const discount = extractDiscountPercentage(couponData.coupon_code);
      const couponPeriod: string = couponData.subscription_period;

      // localStorage.setItem("couponApplied", "true");
      setDiscountPercentage(discount);
      setCouponApplied(true);

      let newBillingCycle: BillingCycleType;
      let newAllowedCycles: BillingCycleType[];

      switch (couponPeriod) {
        case "month":
          newBillingCycle = "month";
          newAllowedCycles = ["month"];
          break;
        case "year":
          newBillingCycle = "year";
          newAllowedCycles = ["year"];
          break;
        case "infinity":
          newBillingCycle = "month";
          newAllowedCycles = ["month", "quarter", "year", "term"];
          break;
        case "term":
          newBillingCycle = "term";
          newAllowedCycles = ["term"];
          break;
        default:
          newBillingCycle = "month";
          newAllowedCycles = ["month", "quarter", "year", "term"];
      }

      setBillingCycle(newBillingCycle);
      setAllowedBillingCycles(newAllowedCycles);
      setVerificationMessage("✅ Coupon code applied successfully!");
    } else {
      // invalid or not found → reset price
      setCouponApplied(false);
      setDiscountPercentage(0);
      setBillingCycle("month");
      setAllowedBillingCycles(["month", "quarter", "year", "term"]);
      setVerificationMessage("❌ Invalid coupon code.");
    }
  } catch (error: any) {
    // failed request → reset price
    setCouponApplied(false);
    setDiscountPercentage(0);
    setBillingCycle("month");
    setAllowedBillingCycles(["month", "quarter", "year", "term"]);
    setVerificationMessage("❌ Invalid or expired coupon.");
  } finally {
    setLoading(false);
  }
};



  const handleVerifySchoolCoupon = async (userType: "teacher" | "school") => {
    setLoading(true);
    setCouponState(userType);
    setSchoolVerificationMessage("");

    setDiscountPercentage(0);
    setCouponCode("");
    setCouponApplied(false);
    setVerificationMessage("");

    // if (schoolCouponApplied) {
      // setSchoolVerificationMessage("Coupon code has already been applied.");
      // setLoading(false);
      // return;
    // }

    try {
      const response = await verifyCouponCode({
        schoolCouponCode,
        userType,
      });
      // console.log(response);

      if (
        response.status === "success" &&
        response.data &&
        response.data.length > 0
      ) {
        const couponData = response.data[0];
        const discount = extractDiscountPercentage(couponData.coupon_code);
        const couponPeriod: string = couponData.subscription_period;

        // localStorage.setItem("schoolCouponApplied", "true");
        setDiscountPercentage(discount);
        console.log(discount, "discount");
        setSchoolCouponApplied(true);

        let newBillingCycle: BillingCycleType;
        let newAllowedCycles: BillingCycleType[];

        switch (couponPeriod) {
          case "month":
            newBillingCycle = "month";
            newAllowedCycles = ["month"];
            break;
          case "year":
            newBillingCycle = "year";
            newAllowedCycles = ["year"];

            break;
          case "infinity":
            newBillingCycle = "month";
            newAllowedCycles = ["month", "quarter", "year", "term"];
            break;
          case "term":
            newBillingCycle = "term";
            newAllowedCycles = ["term"];
            break;
          default:
            newBillingCycle = "month";
            newAllowedCycles = ["month", "quarter", "year", "term"];
        }

        setBillingCycle(newBillingCycle);
        setAllowedBillingCycles(newAllowedCycles);
        setSchoolVerificationMessage("✅Coupon code applied successfully!");
      } else {
        
        setSchoolCouponApplied(false)
        setDiscountPercentage(0);
        setBillingCycle("month");
        setSchoolVerificationMessage("❌Invalid coupon code");
      }
    } catch (error: any) {
      setSchoolCouponApplied(false)
      setDiscountPercentage(0);
      setBillingCycle("month");
      setSchoolVerificationMessage("❌Invalid or Expired coupon code.");
    } finally {
      setLoading(false);
      // setCouponState("")
    }
  };

  const handlefetchPayloadId = async (
    plan: "basic" | "pro" | "premium" | "enterprise" | "admin" | "diamond"
  ) => {
    try {
      setLoader(true);
      const original_price = initialPrices[plan][currency][billingCycle];
      const amount = prices[plan][currency][billingCycle];
      // const unit = billingCycle === " quarter" ? "month" : billingCycle;
      const unit = billingCycle;

      const payload = {
        amount,
        original_price,
        package_id: packageMap[plan],
        interval: unit,
        currency,
      };
      setIsDialogOpen(true);
      // const response = await dispatch(getPaymentplan(payload)).unwrap();
      //  console.log("response", response)
      // if (response) {

      // }
    } catch (err: any) {
      console.error("Error fetching payloadId:", err);
    } finally {
      setLoader(false);
    }
  };

  const aitachaDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );
  const isPaymentPage = window.location.pathname === "/payment";
  const role = 1;
  const isAdmin = aitachaDetails.role === 1 || aitachaDetails.role_id === 1;

  type PlanKey = "basic" | "premium" | "pro" | "enterprise" | "diamond";
  const renderPlanButton = (
    planKey: PlanKey,
    displayedPlanName: string,
    expectedPackageName: string
  ): JSX.Element => {
    const isCurrentPlan: boolean =
      userDetails?.package?.toLowerCase() === expectedPackageName.toLowerCase();
    const isProcessing: boolean = loadingPlan === planKey;
    const isCurrentPlanActive: boolean =
      isCurrentPlan && userDetails?.package_status?.toLowerCase() === "active";
    const isCurrentPlanExpired: boolean =
      isCurrentPlan && userDetails?.package_status?.toLowerCase() === "expired";

    let buttonText: string;

    if (isCurrentPlanActive) {
      buttonText = "Current Plan (Top Up)";
    } else if (isCurrentPlanExpired) {
      buttonText = "Expired Plan (Renew)";
    } else if (isProcessing) {
      buttonText = "Processing...";
    } else {
      buttonText = `Upgrade to ${displayedPlanName}`;
    }

    const buttonClassName: string = `
      w-full py-2 rounded-full px-2 transition duration-200 mt-auto text-lg font-medium
      ${
        isCurrentPlanActive
          ? "bg-[#000000]  hover:bg-gray-300 hover:text-black text-white"
          : isCurrentPlanExpired
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-white border border-[#6200EE]  text-[#6200EE] hover:text-white hover:bg-[#4a2fa3]"
      }
      ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}
    `;
    // console.log("button", buttonText)
    return (
      <button
        onClick={() => {
          handlefetchPayloadId(planKey);
          setSelectedPlan(planKey);
        }}
        disabled={isProcessing}
        className={buttonClassName}
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="p-3 md:p-[30px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[20px] mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              Subscription
            </h2>
            <p className="text-sm m-0">
              Manage, upgrade or downgrade your account
            </p>
            <p className="text-sm mt-1 w-fit border-2 mb-0 rounded-full border-green-600 text-green-600 p-1 px-2 bg-green-50 font-semibold">
              Current Plan : {user.package}
            </p>
          </div>
          <div className="w-full md:w-60">
            <label
              htmlFor="currency-select"
              className="text-gray-700 font-medium mb-2 block"
            >
              Select Currency
            </label>

            {/* Wrapper for flag + select */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <img
                  src={selectedCurrency?.flag}
                  alt={selectedCurrency?.code}
                  className="w-6 h-4 rounded-sm object-cover"
                />
              </div>

              <select
                id="currency-select"
                className="border border-[#4b2aad] w-full py-2 pl-10 pr-3 text-gray-800 focus:outline-none rounded-full focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={currency}
                onChange={handleCurrencyChange}
              >
                {currencies.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.code} ({cur.name})
                  </option>
                ))}
              </select>

              {/* Dropdown icon */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
          For Individuals
        </h2>

        {/* =======COUPON FIELD FOR INDIVIDUAL =========== */}
        <div className="mt-6 bg-white p-5 rounded-xl flex flex-wrap gap-3 items-end">
          <div className="w-full md:w-60 mx-auto flex flex-col">
            <label htmlFor="billing-cycle-select" className="sr-only">
              Select Billing Cycle
            </label>
            <label className="font-semibold mb-1">Duration</label>
            
            <select
              id="billing-cycle-select"
              value={billingCycle}
              onChange={(e) =>
                setBillingCycle(
                  e.target.value as "month" | "quarter" | "year" | "term"
                )
              }
              className={`w-full p-3 py-4 border border-gray-300 rounded-full
               text-gray-800 bg-white focus:outline-none focus:ring-2
                focus:ring-purple-500 ${
                  couponApplied
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : ""
                }`}
            >
              {allowedBillingCycles.includes("month") && (
                <option value="month">Monthly</option>
              )}
              {allowedBillingCycles.includes("term") && (
                <option value="term">Termly</option>
              )}
              {allowedBillingCycles.includes("quarter") && (
                <option value="quarter">3 Months</option>
              )}
              {allowedBillingCycles.includes("year") && (
                <option value="year">Yearly</option>
              )}
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="coupon-input"
              className="text-gray-800 font-semibold mb-2 block"
            >
              Enter Coupon Code
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="coupon-input"
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border border-gray-300 rounded-full w-full sm:flex-grow py-3 px-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your coupon code"
              />
              <button
                // onClick={() => {
                //   handleVerifyCoupon("teacher");
                // }}
                onClick={() => {
                  handleVerifyCoupon("teacher");
                  setCouponState("teacher");
                }}

                disabled={loading || !couponCode}
                className="w-full sm:w-[300px] mt-2 sm:mt-0 bg-[#4b2aad] text-white rounded-full px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a2588] transition duration-200 ease-in-out"
              >
                {loading ? "Verifying..." : "Apply Coupon"}
              </button>
            </div>
          </div>
        </div>
          {couponApplied && (
              <p className="text-sm text-green-600 mb-2 text-center">
                Coupon applied! Your billing cycle is set to match the coupon.
              </p>
            )}
            {verificationMessage && (
              <p className="mt-2 text-center text-sm ">
                {verificationMessage}
              </p>
            )}
        {/* =======COUPON FIELD FOR INDIVIDUAL ENDS =========== */}
      </div>

      <div className="">
        {/*============== THE SUBSRCIPTION OPTIONS FOR INDIVIDUAL =========== */}
        <div className=" mx-auto px-4 py-8">
          <div className="flex flex-col gap-5 lg:flex-row justify-center items-stretch lg:space-x-3  lg:space-y-0">
            <div
              // className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1"
              className={`rounded-3xl p-6 shadow flex flex-col flex-1 transition-all duration-300 ${
                userDetails?.package === "AiTeacha Free"
                  ? "border-2 border-green-500 bg-white"
                  : "border border-gray-200 bg-white hover:border-[#4b2aad]"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">AiTeacha Free</h3>
              <p className="text-2xl font-bold mb-2">
                {getCurrencySign(currency)}{" "}
                {prices.free[currency][billingCycle]}
              </p>

              {billingCycle === "year" && (
                <span className="font-medium text-sm text-gray-700"> </span>
              )}
              <p className="mb-4 mt-2 text-sm text-gray-600">
                Get started for Free, learn how AiTeacha saves you time and
                generates tailored resources.
              </p>
              <ul className="list-none pl-0 space-y-2 mb-6 flex-grow">
                <strong
                  className={`text-xl ${
                    userDetails?.package === "AiTeacha Free"
                      ? "text-green-600 "
                      : "text-[#6200EE] "
                  }`}
                >
                  Save time, get resources...
                </strong>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  {" "}
                  <IoCheckmark className="shrink-0" size={20} /> Unlimited use
                  of our essential free tools
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Generate
                  tailored, high-quality resources
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  15 Time-Saving Tools to simplify lesson planning, assessments,
                  and more
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Easily download
                  and save your generated resources
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  {" "}
                  <IoCheckmark className="shrink-0" size={20} />
                  Interact with Zyra, our AI Chat Assistant, built exclusively
                  for educators and students
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmark className="shrink-0" size={20} /> AI Image
                  generation for educators and students
                </li>
              </ul>
              <button
                className={`w-full py-2 rounded-full text-lg px-2 font-medium mt-auto ${
                  userDetails?.package === "AiTeacha Free"
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-white text-[#6200EE] border border-[#6200EE] hover:bg-[#6200EE] hover:text-white   transition"
                }`}
                disabled={userDetails?.package === "AiTeacha Free"}
              >
                {userDetails?.package === "AiTeacha Free"
                  ? "Current Plan"
                  : "Downgrade to Free"}
              </button>
              {/* <button
                className={`w-full py-2 rounded-md mt-auto ${
                  userDetails?.package === "AiTeacha Free"
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-[#4a2fa3] transition"
                }`}
                disabled={userDetails?.package === "AiTeacha Free"}
              >
                {userDetails?.package === "AiTeacha Free"
                  ? "Current Plan"
                  : "Downgrade to Free"}
              </button> */}
            </div>

            {currency === "NGN" && (
              <div
                // className="border rounded-lg p-6 bg-white shadow-md flex flex-col flex-1"
                className={`rounded-3xl p-6 shadow flex flex-col flex-1 transition-all duration-300 ${
                  userDetails?.package === "AI Teacha Basic"
                    ? "border-2 border-green-500 bg-white"
                    : "border border-gray-200 bg-white hover:border-[#4b2aad]"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 text-black">
                  AiTeacha Basic
                </h3>
                <p className="text-3xl font-bold mb-2">
                  {getCurrencySign(currency)}
                  {prices.basic[currency][billingCycle]
                    .toLocaleString()
                    .toLocaleString()}
                  <span className="text-base font-normal text-gray-500">
                    {billingCycle === "month" && ""}
                    {billingCycle === "quarter" && ""}
                    {billingCycle === "year" && ""}
                    {billingCycle === "term" && ""}
                  </span>
                  {/* {billingCycle === "year" && (
                    <span className="font-medium text-sm text-gray-700 block mt-1">
                      {" "}
                      {getCurrencySign(currency)}
                      {(
                        prices.basic[currency][billingCycle] / 12
                      ).toLocaleString()}{" "}
                      
                    </span>
                  )} */}
                </p>
                <p className="mb-4 mt-2 text-sm text-gray-600">
                  An affordable entry plan for teachers with access to essential
                  AI tools for lesson planning and content creation.
                </p>

                <ul className="list-disc pl-0 space-y-2 mb-6 flex-grow">
                  <strong
                    className={`text-xl ${
                      userDetails?.package === "AI Teacha Basic"
                        ? "text-green-600 "
                        : "text-[#6200EE] "
                    }`}
                  >
                    Everything in Free, Plus...
                  </strong>
                  <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                    <IoCheckmark className="shrink-0" size={20} />
                    <span>
                      Access to all<strong> 45 AI tools </strong> under the{" "}
                      <strong>"My Tools"</strong> section
                    </span>
                  </li>
                  <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                    <IoCheckmark className="shrink-0" size={20} /> Unlimited
                    content generation for lesson plans, assessments, and more.{" "}
                  </li>
                  <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                    <IoCheckmark className="shrink-0" size={20} />
                    Generate AI-powered slides and export directly to Microsoft
                    PowerPoint
                  </li>
                  <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                    <IoCheckmark className="shrink-0" size={20} /> Unlimited
                    AI-generated images and labeled diagrams.
                  </li>
                  <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                    <IoCheckmark className="shrink-0" size={20} />
                    Download and save all your generated resources for offline
                    use.
                  </li>
                  <li className="flex items-center gap-2 pb-2">
                    <IoCheckmark className="shrink-0" size={20} /> No Classroom
                    Management
                  </li>
                </ul>

                {renderPlanButton("basic", "Basic", "Ai Teacha Basic")}
              </div>
            )}

            <div
              // className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1"
              className={`rounded-3xl p-6 shadow flex flex-col flex-1 transition-all duration-300 ${
                userDetails?.package === "AI Teacha Pro"
                  ? "border-2 border-green-500 bg-white"
                  : "border border-gray-200 bg-white hover:border-[#4b2aad]"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">AiTeacha Pro</h3>
              <p className="text-2xl font-bold mb-2">
                {getCurrencySign(currency)}{" "}
                {prices.pro[currency][billingCycle].toLocaleString()}
                {currency === "USD" && billingCycle === "year" && (
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    {getCurrencySign(currency)}
                    {(prices.pro[currency][billingCycle] / 12).toFixed(2)}{" "}
                  </span>
                )}
                {currency === "GBP" && billingCycle === "year" && (
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    {getCurrencySign(currency)}
                    {(prices.pro[currency][billingCycle] / 12).toFixed(2)}{" "}
                  </span>
                )}
                {billingCycle === "year" && currency === "NGN" && (
                  <span className="font-medium text-sm text-red-500 line-through decoration-red-500">
                    {" "}
                    ₦60,000
                  </span>
                )}
              </p>
              <p className="mb-4 mt-2 text-sm text-gray-600">
                Upgrade to AiTeacha Pro for unlimited access to all resources
                and pro tools.
              </p>
              <ul className="list-disc pl-0 space-y-2 mb-6 flex-grow">
                <strong
                  className={`text-xl ${
                    userDetails?.package === "AI Teacha Pro"
                      ? "text-green-600 "
                      : "text-[#6200EE] "
                  }`}
                >
                  Everything in Basic, Plus...
                </strong>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Unlock all 45
                  advanced, time-saving AI tools
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Unlimited
                  content generation as you need
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  Generate unlimited AI-powered slides, exportable directly to
                  Microsoft PowerPoint
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Unlimited
                  assignments for student evaluation needs
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  Unlimited student performance reports to track and enhance
                  learning outcomes
                </li>

                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Virtual
                  Classroom access{" "}
                </li>
                <li className="flex items-center gap-2 pb-2">
                  <IoCheckmark className="shrink-0" size={20} /> Full Access to
                  Computer-Based Tests (CBT)
                </li>
              </ul>

              {renderPlanButton("pro", "Pro", "Ai Teacha Pro")}
            </div>
          </div>
        </div>
        {/*============== THE SUBSRCIPTION OPTIONS FOR INDIVIDUAL ENDS HERE =========== */}

        <div className="px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
            For Schools
          </h2>

          <div className="my-6 bg-white p-5 rounded-xl  flex flex-wrap gap-5 items-end">

            <div className="w-full md:w-60 mx-auto flex flex-col">
              <label htmlFor="billing-cycle-select" className="sr-only">
                Select Billing Cycle
              </label>
              <label className="mb-1 font-semibold">
                Duration
              </label>
              
              <select
                id="billing-cycle-select"
                value={billingCycle}
                onChange={(e) =>
                  setBillingCycle(
                    e.target.value as "month" | "quarter" | "year" | "term"
                  )
                }
                className={`w-full p-3 py-4 border border-gray-300 rounded-full
               text-gray-800 bg-white focus:outline-none focus:ring-2
                focus:ring-purple-500 ${
                  couponApplied
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : ""
                }`}
              >
                {allowedBillingCycles.includes("month") && (
                  <option value="month">Monthly</option>
                )}
                {allowedBillingCycles.includes("term") && (
                  <option value="term">Termly</option>
                )}
                {allowedBillingCycles.includes("year") && (
                  <option value="year">Yearly</option>
                )}
              </select>
            </div>

            <div className="flex-1">

            
            <label
              htmlFor="coupon-input"
              className="text-gray-900 font-semibold mb-2 block"
            >
              Enter Coupon Code
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="coupon-input"
                type="text"
                value={schoolCouponCode}
                onChange={(e) => setSchoolCouponCode(e.target.value)}
                className="border border-gray-300 rounded-full w-full sm:flex-grow py-3 px-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your coupon code"
              />
              <button
                onClick={() => {
                  handleVerifySchoolCoupon("school"), setCouponState("school");
                }}

                 
                disabled={loading || !schoolCouponCode}
                className="w-full sm:w-[300px] mt-2 sm:mt-0 bg-[#4b2aad] text-white rounded-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a2588] transition duration-200 ease-in-out"
              >
                {loading ? "Verifying..." : "Apply Coupon"}
              </button>
            </div>



            </div>
            
          </div>
          {schoolCouponApplied && (
                <p className="text-sm text-green-600 mb-2 text-center">
                  Coupon applied! Your billing cycle is set to match the coupon.
                </p>
              )}
            {schoolVerificationMessage && (
              <p className="mt-2 text-sm text-center mb-[30px] text-gray-600">
                {schoolVerificationMessage}
              </p>
            )}

          <div className="flex flex-col lg:flex-row justify-center items-stretch lg:space-x-8 space-y-8 lg:space-y-0  mx-auto">
            <div
              // className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1"
              className={`rounded-3xl p-6 shadow flex flex-col flex-1 transition-all duration-300 ${
                userDetails?.package === "AI Teacha Premium"
                  ? "border-2 border-green-500 bg-white"
                  : "border border-gray-200 bg-white hover:border-[#4b2aad]"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">AiTeacha Premium</h3>
              <p className="text-2xl font-bold mb-2">
                {getCurrencySign(currency)}{" "}
                {prices.premium[currency][billingCycle].toLocaleString()}
                {currency === "USD" && billingCycle === "year" && (
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    {getCurrencySign(currency)}
                    {(prices.premium[currency][billingCycle] / 12).toFixed(
                      2
                    )}{" "}
                    monthly
                  </span>
                )}
                {currency === "GBP" && billingCycle === "year" && (
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    {getCurrencySign(currency)}
                    {(prices.premium[currency][billingCycle] / 12).toFixed(
                      2
                    )}{" "}
                    monthly
                  </span>
                )}
                {billingCycle === "year" && currency === "NGN" && (
                  <span className="font-medium text-sm text-red-500 line-through decoration-red-500">
                    ₦240,000
                  </span>
                )}
                {billingCycle === "term" && currency === "NGN" && (
                  <span className="font-medium text-sm text-red-500 line-through decoration-red-500">
                    ₦80,000
                  </span>
                )}
              </p>
              <p className="mb-4 mt-2 text-sm text-gray-600">
                Full AiTeacha suite for schools with classroom, assignment, and
                report features.
              </p>
              <ul className="list-disc pl-0 space-y-2 mb-6 flex-grow">
                <strong
                  className={`text-xl ${
                    userDetails?.package === "AI Teacha Premium"
                      ? "text-green-600 "
                      : "text-[#6200EE] "
                  }`}
                >
                  Everything in Pro, Plus...
                </strong>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  Institution-wide monitoring of teachers and students activity
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  Moderation features to prioritize student safety and
                  compliance
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Data Privacy
                  Agreements (DPA)
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Personalized AI
                  training and tool customizations
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  Special pricing and discounts on bulk licenses for schools
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Unlimited chat
                  and resource histories
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} /> Access to add
                  up to 15 teachers
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmark className="shrink-0" size={20} /> Dedicated
                  support for your school or institution
                </li>
              </ul>

              {renderPlanButton("premium", "Premium", "Ai Teacha Premium")}
            </div>

            <div
              // className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col   flex-1"
              className={`rounded-3xl p-6 shadow flex flex-col flex-1 transition-all duration-300 ${
                userDetails?.package === "AI Teacha Diamond"
                  ? "border-2 border-green-500 bg-white"
                  : "border border-gray-200 bg-white hover:border-[#4b2aad]"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">AiTeacha Diamond</h3>
              <p className="text-2xl font-bold mb-2">
                {getCurrencySign(currency)}{" "}
                {prices.diamond[currency][billingCycle].toLocaleString()}
                {currency === "USD" && billingCycle === "year" && (
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    {getCurrencySign(currency)}
                    {(prices.premium[currency][billingCycle] / 12).toFixed(
                      2
                    )}{" "}
                    monthly
                  </span>
                )}
                {currency === "GBP" && billingCycle === "year" && (
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    {getCurrencySign(currency)}
                    {(prices.premium[currency][billingCycle] / 12).toFixed(
                      2
                    )}{" "}
                    monthly
                  </span>
                )}
                {billingCycle === "year" && currency === "NGN" && (
                  <span className="font-medium text-sm text-red-500 line-through decoration-red-500">
                    ₦480,000
                  </span>
                )}
                {billingCycle === "term" && currency === "NGN" && (
                  <span className="font-medium text-sm text-red-500 line-through decoration-red-500">
                    ₦160,000
                  </span>
                )}
              </p>
              <p className="mb-4 mt-2 text-sm text-gray-600">
                Full AiTeacha suite for schools with classroom, assignment, and
                report features.
              </p>
              <ul className="list-disc pl-0 space-y-2 mb-6 flex-grow">
                <strong
                  className={`text-xl ${
                    userDetails?.package === "AI Teacha Diamond"
                      ? "text-green-600 "
                      : "text-[#6200EE] "
                  }`}
                >Everything in Pro, Plus...</strong>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  Institution-wide monitoring of teachers and students activity
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  Moderation features to prioritize student safety and
                  compliance
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />Data Privacy Agreements (DPA)</li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />Personalized AI training and tool customizations</li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  Special pricing and discounts on bulk licenses for schools
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />Unlimited chat and resource histories</li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />Access to add up to 30 teachers</li>
                <li className="flex items-center gap-2">
                  <IoCheckmark className="shrink-0" size={20} /> Dedicated support for your school or institution</li>
              </ul>

              {renderPlanButton("diamond", "Diamond", "Ai Teacha Diamond")}
            </div>

            <div
              // className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1"
              className={`rounded-3xl p-6 shadow flex flex-col flex-1 transition-all duration-300 ${
                userDetails?.package === "AI Teacha Enterprise"
                  ? "border-2 border-green-500 bg-white"
                  : "border border-gray-200 bg-white hover:border-[#4b2aad]"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">
                AiTeacha Enterprise
              </h3>
              <p className="text-2xl font-bold mb-2">Custom Pricing</p>
              <p className="mb-4 mt-2 text-sm text-gray-600">
                Custom discounted pricing for schools, districts, institutions,
                and tutorial centers.
              </p>
              <ul className="list-disc pl-0 space-y-2 mb-6 flex-grow">
                <strong>Everything in Premium, Plus...</strong>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />Designed for large schools and institutions</li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  The AiTeacha Enterprise Plan is tailored for organizations
                  with 15 or more educators seeking comprehensive AI solutions
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />Dedicated account manager and priority support</li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  On-site training and implementation support (where applicable)
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />
                  Advanced analytics and reporting for institution-wide insights
                </li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />Custom integrations and API access</li>
                <li className="flex items-center gap-2 border-b-2 border-dashed pb-2 border-gray-300">
                  <IoCheckmark className="shrink-0" size={20} />Scalable solutions for growing educational needs</li>
                <li className="flex items-center gap-2">
                  <IoCheckmark className="shrink-0" size={20} /> 
                  Contact us today or use our Quote Calculator to receive
                  customized pricing and exclusive discounts for your
                  institution.
                </li>
              </ul>
              <button
                onClick={() => navigate("/dashboard/upgrade/support")}
                disabled={
                  loadingPlan === "enterprise" ||
                  userDetails?.package === "AI Teacha Enterprise"
                }
                className={`w-full px-2 py-2 rounded-full text-lg font-medium transition mt-auto text-center ${
                  userDetails?.package === "AI Teacha Enterprise"
                    ? "bg-black  text-white cursor-not-allowed"
                    : "bg-white text-[#6200EE] border border-[#6200EE] hover:bg-[#6200EE] hover:text-white   transition"
                }`}
              >
                {userDetails?.package === "AI Teacha Enterprise"
                  ? "Current Plan"
                  : loadingPlan === "enterprise"
                  ? "Processing..."
                  : "Contact Sales"}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*============== THE SUBSRCIPTION OPTIONS FOR INDIVIDUAL =========== */}

      {/* {isAdmin && (
          <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col">
            <h3 className="text-lg font-semibold mb-4">AiTeacha Admin Plan</h3>
            <p className="text-2xl font-bold mb-2">
              {getCurrencySign(currency)} {prices.admin[currency][billingCycle]}
              {currency === "USD" && billingCycle === "year" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  {getCurrencySign(currency)}
                  {(prices.admin[currency][billingCycle] / 12).toFixed(2)}{" "}
                  monthly
                </span>
              )}
              {currency === "GBP" && billingCycle === "year" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  {getCurrencySign(currency)}
                  {(prices.admin[currency][billingCycle] / 12).toFixed(2)}{" "}
                  monthly
                </span>
              )}
              {billingCycle === "year" && currency === "NGN" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  ₦
                  {(
                    prices.admin[currency][billingCycle] / 12
                  ).toLocaleString()}{" "}
                  monthly
                </span>
              )}
            </p>
            <p className="mb-4 mt-2 text-sm text-gray-600">
              Special Admin access with essential capabilities for management
              and moderation.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
              <strong>Everything in Premium, Plus...</strong>
              <li>Access to all user data and analytics</li>
              <li>Full control over user management</li>
              <li>Ability to broadcast platform-wide announcements</li>
              <li>Advanced moderation tools</li>
              <li>Priority support from the dev team</li>
            </ul>
            <Button
              onClick={() => {
                setSelectedPlan("admin");
                setIsDialogOpen(true);
              }}
              disabled={
                loadingPlan === "admin" ||
                userDetails?.package === "AiTeacha Admin"
              }
              className={`bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center ${
                userDetails?.package === "AiTeacha Admin"
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "hover:bg-[#4a2fa3]"
              }`}
            >
              {userDetails?.package === "AiTeacha Admin"
                ? "Current Plan"
                : loadingPlan === "admin"
                ? "Processing..."
                : "Switch to Admin Plan"}
            </Button>
          </div>
        )} */}

      {isPaymentPage && (
        <center>
          <Link to="/dashboard/home">
            <Button
              variant={"outlined"}
              className="bg-black text-white w-1/4 rounded-md my-4"
            >
              <span className="text-white"> Pay Later</span>
            </Button>
          </Link>
        </center>
      )}
      <div className="mt-12">
        <PricingFaq />
      </div>

      {selectedPlan && (
        <PaymentMethodDialog
          planName={selectedPlan}
          onSelectPaymentMethod={handlePayment}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onOpenChange={setIsDialogOpen}
          currency={currency}
        />
      )}
    </div>
  );
};

export default Upgrade;
