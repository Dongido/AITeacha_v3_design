import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { changeUserPlan } from "../../api/subscription";
import { FLUTTERWAVE_PUBLIC } from "../../lib/utils";
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
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { verifyTransaction } from "../../api/subscription";
interface UserDetails {
  id: string;
  email: string;
  role: number;
  package: string;
  firstname: string;
}

type PlanType = "free" | "basic" | "pro" | "premium" | "enterprise" | "admin";
type CurrencyType = "NGN" | "USD" | "GBP";

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

const Upgrade: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [prices, setPrices] = useState(initialPrices);
  const [billingCycle, setBillingCycle] = useState<
    "month" | "threeMonths" | "year"
  >("month");

  const [currency, setCurrency] = useState<"NGN" | "USD" | "GBP">("NGN");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<
    "basic" | "pro" | "premium" | "enterprise" | "admin" | null
  >(null);
  const [loadingPlan, setLoadingPlan] = useState<null | string>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const user = useSelector(selectUser);

  useEffect(() => {
    if (discountPercentage > 0) {
      const discountedPrices = JSON.parse(JSON.stringify(initialPrices));

      Object.keys(discountedPrices).forEach((planKey) => {
        const plan = planKey as PlanType;
        Object.keys(discountedPrices[plan]).forEach((currKey) => {
          const curr = currKey as CurrencyType;
          if (typeof discountedPrices[plan][curr].month === "number") {
            discountedPrices[plan][curr].month -=
              (discountedPrices[plan][curr].month * discountPercentage) / 100;
            discountedPrices[plan][curr].threeMonths -=
              (discountedPrices[plan][curr].threeMonths * discountPercentage) /
              100;
            discountedPrices[plan][curr].year -=
              (discountedPrices[plan][curr].year * discountPercentage) / 100;
          }
        });
      });

      setPrices(discountedPrices);
    }
  }, [discountPercentage]);

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
    selectedPlan === "pro" ? "1" : selectedPlan === "premium" ? "15" : "0";

  const packageMap = {
    free: 1,
    basic: 5,
    pro: 2,
    premium: 3,
    enterprise: 4,
    admin: 2,
  };
  const getFlutterwaveConfig = (
    plan: "basic" | "pro" | "premium" | "enterprise" | "admin",
    userDetails: UserDetails | null,
    billingCycle: "month" | "threeMonths" | "year",
    currency: CurrencyType,
    prices: typeof initialPrices,
    noOfSeats: string
  ) => {
    const unit = billingCycle === "threeMonths" ? "month" : billingCycle;
    const duration = billingCycle === "threeMonths" ? 3 : 1;

    return {
      public_key: FLUTTERWAVE_PUBLIC,
      tx_ref: `TX_${unit}_${packageMap[plan]}_${Date.now()}`,
      amount: prices[plan][currency][billingCycle],
      currency: currency,
      payment_options: "card, banktransfer, ussd",
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
    plan: "basic" | "pro" | "premium" | "enterprise" | "admin"
  ) => {
    setLoadingPlan(plan);
    setSelectedPlan(plan);

    const amount = prices[plan][currency][billingCycle];
    const duration = billingCycle === "threeMonths" ? 3 : 1;
    const unit = billingCycle === "threeMonths" ? "month" : billingCycle;

    if (method === "flutterwave") {
      const currentConfig = getFlutterwaveConfig(
        plan,
        userDetails,
        unit,
        currency,
        prices,
        noOfSeats
      );

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
              console.log(
                "Transaction Verification Response:",
                verificationResponse
              );

              if (
                verificationResponse.status === "success" &&
                verificationResponse.data.paymentStatus === "success"
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
          "https://vd.aiteacha.com/api/payment/stripe/initiate",
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

  const handleVerifyCoupon = async () => {
    setLoading(true);
    setVerificationMessage("");

    if (couponApplied) {
      setVerificationMessage("Coupon code has already been applied.");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyCouponCode(couponCode);
      console.log(response);
      if (response.status === "success") {
        const discount = extractDiscountPercentage(couponCode);
        localStorage.setItem("couponApplied", "true");
        setDiscountPercentage(discount);
        setCouponApplied(true);
        //  applyDiscountToPrices(discount);
      }

      setVerificationMessage("Coupon code applied successfully!");
    } catch (error: any) {
      setVerificationMessage("Invalid coupon code");
    } finally {
      setLoading(false);
    }
  };

  const aitachaDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );
  const isPaymentPage = window.location.pathname === "/payment";
  const role = 1;
  const isAdmin = aitachaDetails.role === 1 || aitachaDetails.role_id === 1;

  return (
    <div className="mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Welcome! 👋
          </h2>
          <div className="w-full md:w-60">
            <label
              htmlFor="currency-select"
              className="text-gray-700 font-medium mb-2 block"
            >
              Select Currency
            </label>
            <select
              id="currency-select"
              className="border border-[#4b2aad] rounded-md w-full py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value="NGN">NGN (Naira)</option>
              <option value="USD">USD (Dollar)</option>
              <option value="GBP">GBP (Pounds)</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="coupon-input"
            className="text-gray-700 font-medium mb-2 block"
          >
            Enter Coupon Code
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="coupon-input"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border border-[#4b2aad] rounded-md w-full sm:flex-grow py-2 px-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your coupon code"
            />
            <button
              onClick={handleVerifyCoupon}
              disabled={loading || !couponCode}
              className="w-full sm:w-auto mt-2 sm:mt-0 bg-[#4b2aad] text-white rounded-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a2588] transition duration-200 ease-in-out"
            >
              {loading ? "Verifying..." : "Apply Coupon"}
            </button>
          </div>
          {verificationMessage && (
            <p className="mt-2 text-sm text-gray-600">{verificationMessage}</p>
          )}
        </div>

        <div className="mb-4 mt-8 w-full md:w-60 mx-auto flex flex-col items-center">
          <label htmlFor="billing-cycle-select" className="sr-only">
            Select Billing Cycle
          </label>
          <select
            id="billing-cycle-select"
            value={billingCycle}
            onChange={(e) =>
              setBillingCycle(
                e.target.value as "month" | "threeMonths" | "year"
              )
            }
            className="w-full p-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">Monthly</option>
            <option value="threeMonths">3 Months</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>

      <div>
        <div className=" mx-auto px-4 py-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
            For Individuals
          </h2>

          <div className="flex flex-col lg:flex-row justify-center items-stretch lg:space-x-8 space-y-8 lg:space-y-0">
            <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1">
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
              <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
                <strong>Save time, get resources...</strong>
                <li>Unlimited use of our essential free tools</li>
                <li>Generate tailored, high-quality resources</li>
                <li>
                  15 Time-Saving Tools to simplify lesson planning, assessments,
                  and more
                </li>
                <li>Easily download and save your generated resources</li>
                <li>
                  Interact with Zyra, our AI Chat Assistant, built exclusively
                  for educators and students
                </li>
                <li>AI Image generation for educators and students</li>
              </ul>
              <button
                className={`w-full py-2 rounded-md mt-auto ${userDetails?.package === "AiTeacha Free"
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-[#4a2fa3] transition"
                  }`}
                disabled={userDetails?.package === "AiTeacha Free"}
              >
                {userDetails?.package === "AiTeacha Free"
                  ? "Current Plan"
                  : "Downgrade to Free"}
              </button>
            </div>

            {currency === "NGN" && (
              <div className="border rounded-lg p-6 bg-white shadow-md flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-4 text-black">
                  AiTeacha Basic
                </h3>
                <p className="text-3xl font-bold mb-2">
                  {getCurrencySign(currency)}
                  {prices.basic[currency][billingCycle].toLocaleString()}
                  <span className="text-base font-normal text-gray-500">
                    {billingCycle === "month" && "/month"}
                    {billingCycle === "threeMonths" && "/3 months"}
                    {billingCycle === "year" && "/year"}
                  </span>
                  {billingCycle === "year" && (
                    <span className="font-medium text-sm text-gray-700 block mt-1">
                      {" "}
                      {getCurrencySign(currency)}
                      {(
                        prices.basic[currency][billingCycle] / 12
                      ).toLocaleString()}{" "}
                      monthly
                    </span>
                  )}
                </p>
                <p className="mb-4 mt-2 text-sm text-gray-600">
                  An affordable entry plan for teachers with access to essential
                  AI tools for lesson planning and content creation.
                </p>

                <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
                  <strong>Everything in Free, Plus...</strong>
                  <li>
                    Access to all<strong> 45 AI tools </strong> under the{" "}
                    <strong>"My Tools"</strong> section
                  </li>
                  <li>
                    {" "}
                    Unlimited content generation for lesson plans, assessments,
                    and more.{" "}
                  </li>
                  <li>
                    Generate AI-powered slides and export directly to Microsoft
                    PowerPoint
                  </li>
                  <li>Unlimited AI-generated images and labeled diagrams.</li>
                  <li>
                    Download and save all your generated resources for offline
                    use.
                  </li>
                  <li> No Classroom Management</li>
                </ul>
                <Button
                  onClick={() => {
                    setSelectedPlan("basic");
                    setIsDialogOpen(true);
                  }}
                  disabled={
                    loadingPlan === "basic" ||
                    userDetails?.package?.toLowerCase() === "aiteacha basic"
                  }
                  className={`bg-primary text-white w-full py-2 rounded-md transition duration-200 mt-auto text-lg font-medium ${userDetails?.package?.toLowerCase() === "aiteacha basic"
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "hover:bg-[#4a2fa3]"
                    }`}
                >
                  {userDetails?.package?.toLowerCase() === "aiteacha basic"
                    ? "Current Plan"
                    : loadingPlan === "basic"
                      ? "Processing..."
                      : "Upgrade to Basic"}
                </Button>
              </div>
            )}

            <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-4">AiTeacha Pro</h3>
              <p className="text-2xl font-bold mb-2">
                {getCurrencySign(currency)} {prices.pro[currency][billingCycle]}
                {currency === "USD" && billingCycle === "year" && (
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    {getCurrencySign(currency)}
                    {(prices.pro[currency][billingCycle] / 12).toFixed(2)}{" "}
                    monthly
                  </span>
                )}
                {currency === "GBP" && billingCycle === "year" && (
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    {getCurrencySign(currency)}
                    {(prices.pro[currency][billingCycle] / 12).toFixed(2)}{" "}
                    monthly
                  </span>
                )}
                {billingCycle === "year" && currency === "NGN" && (
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    ₦4,585 monthly]
                  </span>
                )}
              </p>
              <p className="mb-4 mt-2 text-sm text-gray-600">
                Upgrade to AiTeacha Pro for unlimited access to all resources
                and pro tools.
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
                <strong>Everything in Basic, Plus...</strong>
                <li>Unlock all 45 advanced, time-saving AI tools</li>
                <li>Unlimited content generation as you need</li>
                <li>
                  Generate unlimited AI-powered slides, exportable directly to
                  Microsoft PowerPoint
                </li>
                <li>Unlimited assignments for student evaluation needs</li>
                <li>
                  Unlimited student performance reports to track and enhance
                  learning outcomes
                </li>
                <li>Virtual Classroom access </li>
                <li>Full Access to Computer-Based Tests (CBT)</li>

              </ul>
              <Button
                onClick={() => {
                  setSelectedPlan("pro");
                  setIsDialogOpen(true);
                }}
                disabled={
                  loadingPlan === "pro" ||
                  userDetails?.package === "AI Teacha Pro"
                }
                className={`bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center ${userDetails?.package === "AiTeacha Pro"
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "hover:bg-[#4a2fa3]"
                  }`}
              >
                {userDetails?.package === "AI Teacha Pro"
                  ? "Current Plan"
                  : loadingPlan === "pro"
                    ? "Processing..."
                    : "Upgrade to Pro"}
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
            For Schools
          </h2>

          <div className="flex flex-col lg:flex-row justify-center items-stretch lg:space-x-8 space-y-8 lg:space-y-0  mx-auto">
            <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-4">AiTeacha Premium</h3>
              <p className="text-2xl font-bold mb-2">
                {getCurrencySign(currency)}{" "}
                {prices.premium[currency][billingCycle]}
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
                  <span className="font-medium text-sm text-gray-700">
                    {" "}
                    ₦20,385 monthly
                  </span>
                )}
              </p>
              <p className="mb-4 mt-2 text-sm text-gray-600">
                Full AiTeacha suite for schools with classroom, assignment, and
                report features.
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
                <strong>Everything in Pro, Plus...</strong>
                <li>
                  Institution-wide monitoring of teachers and students activity
                </li>
                <li>
                  Moderation features to prioritize student safety and
                  compliance
                </li>
                <li>Data Privacy Agreements (DPA)</li>
                <li>Personalized AI training and tool customizations</li>
                <li>
                  Special pricing and discounts on bulk licenses for schools
                </li>
                <li>Unlimited chat and resource histories</li>
                <li>Unlimited number of educators</li>
                <li>Dedicated support for your school or institution</li>
              </ul>
              <Button
                onClick={() => {
                  setSelectedPlan("premium");
                  setIsDialogOpen(true);
                }}
                disabled={
                  loadingPlan === "premium" ||
                  userDetails?.package === "AI Teacha Premium"
                }
                className={`bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center ${userDetails?.package === "premium"
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "hover:bg-[#4a2fa3]"
                  }`}
              >
                {userDetails?.package === "AI Teacha Premium"
                  ? "Current Plan"
                  : loadingPlan === "premium"
                    ? "Processing..."
                    : "Upgrade to Premium"}
              </Button>
            </div>

            <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-4">
                AiTeacha Enterprise
              </h3>
              <p className="text-2xl font-bold mb-2">Custom Pricing</p>
              <p className="mb-4 mt-2 text-sm text-gray-600">
                Custom discounted pricing for schools, districts, institutions,
                and tutorial centers.
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
                <strong>Everything in Premium, Plus...</strong>
                <li>Designed for large schools and institutions</li>
                <li>
                  The AiTeacha Enterprise Plan is tailored for organizations
                  with 15 or more educators seeking comprehensive AI solutions
                </li>
                <li>Dedicated account manager and priority support</li>
                <li>
                  On-site training and implementation support (where applicable)
                </li>
                <li>
                  Advanced analytics and reporting for institution-wide insights
                </li>
                <li>Custom integrations and API access</li>
                <li>Scalable solutions for growing educational needs</li>
                <li>
                  Contact us today or use our Quote Calculator to receive
                  customized pricing and exclusive discounts for your
                  institution.
                </li>
              </ul>
              <Button
                onClick={() => navigate("/dashboard/upgrade/support")}
                disabled={
                  loadingPlan === "enterprise" ||
                  userDetails?.package === "AI Teacha Enterprise"
                }
                className={`bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center ${userDetails?.package === "AI Teacha Enterprise"
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "hover:bg-[#4a2fa3]"
                  }`}
              >
                {userDetails?.package === "AI Teacha Enterprise"
                  ? "Current Plan"
                  : loadingPlan === "enterprise"
                    ? "Processing..."
                    : "Contact Sales"}{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
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
