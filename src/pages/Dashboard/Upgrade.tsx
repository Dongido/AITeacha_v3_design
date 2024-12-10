import React, { useState, useEffect } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { Switch } from "../../components/ui/Switch";
import { Button } from "../../components/ui/Button";
import { FLUTTERWAVE_PUBLIC } from "../../lib/utils";
import Logo from "../../assets/img/logo.png";
import { changeUserPlan } from "../../api/subscription";
import { useNavigate } from "react-router-dom";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
  ToastClose,
} from "../../components/ui/Toast";

interface UserDetails {
  id: string;
  email: string;
  role: string;
  package: string;
  firstname: string;
}

const Upgrade: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [currency, setCurrency] = useState<"NGN" | "USD" | "GBP">("NGN");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<
    "free" | "pro" | "premium" | "enterprise" | null
  >(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  const prices = {
    free: {
      NGN: { monthly: "₦0", yearly: "₦0" },
      USD: { monthly: "$0", yearly: "$0" },
      GBP: { monthly: "£0", yearly: "£0" },
    },
    pro: {
      NGN: { monthly: 5000, yearly: 55000 },
      USD: { monthly: 5, yearly: 55 },
      GBP: { monthly: 4, yearly: 50 },
    },
    premium: {
      NGN: { monthly: 20000, yearly: 200000 },
      USD: { monthly: 20, yearly: 200 },
      GBP: { monthly: 18, yearly: 190 },
    },
    enterprise: {
      NGN: { monthly: 100000, yearly: 1200000 },
      USD: { monthly: 100, yearly: 1200 },
      GBP: { monthly: 96, yearly: 1180 },
    },
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("ai-teacha-user");
    if (storedUser) {
      const userData: UserDetails = JSON.parse(storedUser);
      setUserDetails(userData);
    }
  }, []);

  const getFlutterwaveConfig = (plan: "pro" | "premium" | "enterprise") => ({
    public_key: FLUTTERWAVE_PUBLIC,
    tx_ref: `TX_${Date.now()}`,
    amount: prices[plan][currency][billingCycle],
    currency: currency,
    payment_options: "card, banktransfer, ussd",
    customer: {
      email: userDetails?.email || "default@email.com",
      phone_number: "08012345678",
      name: userDetails?.firstname || "Default User",
    },
    customizations: {
      title: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
      description: `Upgrade to ${
        plan.charAt(0).toUpperCase() + plan.slice(1)
      } Plan`,
      logo: Logo,
    },
  });

  const handlePayment = async (
    plan: "free" | "pro" | "premium" | "enterprise"
  ) => {
    setLoadingPlan(plan);

    const packageMap = {
      free: 1,
      pro: 2,
      premium: 3,
      enterprise: 4,
    };
    const packageId = packageMap[plan];
    const userId = parseInt(userDetails?.id || "0", 10);
    const duration = billingCycle === "yearly" ? "yearly" : "monthly";
    const updateLocalStorage = (updatedPlan: string) => {
      const storedUser = localStorage.getItem("ai-teacha-user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUserData = { ...userData, package: updatedPlan };
        localStorage.setItem("ai-teacha-user", JSON.stringify(updatedUserData));
        setUserDetails(updatedUserData);
      }
    };
    if (plan === "free") {
      try {
        const unit = 1;
        await changeUserPlan(packageId, userId, 1, duration, currency);
        setToastMessage("updated to free plan!");
        setToastVariant("default");
      } catch (err) {
        console.error(err);
        setToastMessage("Failed to switch to the Free plan.");
        setToastVariant("destructive");
      } finally {
        setShowToast(true);
        setLoadingPlan(null);
      }
      return;
    }

    const config = getFlutterwaveConfig(plan);
    const handleFlutterPayment = useFlutterwave(config);

    handleFlutterPayment({
      callback: async (response) => {
        console.log(response.status);
        if (response.status === "completed") {
          await changeUserPlan(packageId, userId, 1, duration, currency);
          updateLocalStorage(plan);
          setToastMessage("Payment Successful");
          setToastVariant("default");
        } else {
          setToastMessage("Payment Failed or Cancelled");
          setToastVariant("destructive");
        }
        closePaymentModal();
        setLoadingPlan(null);
      },
      onClose: () => {
        setLoadingPlan(null);
        console.log("Payment modal closed");
      },
    });
  };

  const toggleBillingCycle = () => {
    setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as "NGN" | "USD");
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

  return (
    <ToastProvider>
      <div className="mt-12">
        <div className="flex justify-between">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Welcome Back! 👋
          </h2>
          <div className="w-60">
            <label className="text-gray-700 font-medium mb-2 block">
              Select Currency
            </label>
            <select
              className="border rounded-md w-full py-2 px-3"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value="NGN">NGN (Naira)</option>
              <option value="USD">USD (Dollar)</option>
              <option value="GBP">GBP (Pounds)</option>
            </select>
          </div>
        </div>
        <h2 className=" text-xl font-bold ">
          Simple & Transparent Pricing for Educators & Schools
        </h2>
        <h2>
          We offer a Free plan for educators with limited access, a Pro plan
          with more Pro tools and classroom features, a Premium plan with full
          AI Teacha suite for schools with maximum number of 15 educators and an
          Enterprise plan for larger schools with more than 15 educators.
        </h2>
        <div className="mb-4 mt-4 w-60 mx-auto flex items-center justify-between">
          <span className="text-xl font-medium text-gray-800">Monthly</span>
          <Switch
            checked={billingCycle === "yearly"}
            onCheckedChange={toggleBillingCycle}
            thumbColor="primary"
          />
          <span className="text-xl font-medium text-gray-800">Yearly</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 bg-gray-50 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold mb-4">AI Teacha Free</h3>
            <p className="text-2xl font-bold mb-2">
              {prices.free[currency][billingCycle]}
            </p>

            {billingCycle === "yearly" && (
              <span className="font-medium text-sm text-gray-700"> </span>
            )}
            <p className="mb-4 mt-2 text-sm text-gray-600">
              Get started for Free, learn how AI Teacha saves you time and
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
                Interact with Zyra, our AI Chat Assistant, built exclusively for
                educators and students
              </li>
              <li>AI Image generation for educators and students</li>
            </ul>
            <button
              className={`w-full py-2 rounded-md mt-auto ${
                userDetails?.package === "Free"
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-[#4a2fa3] transition"
              }`}
              disabled={userDetails?.package === "Free"}
            >
              {userDetails?.package === "Free"
                ? "Current Plan"
                : "Downgrade to Free"}
            </button>
          </div>
          <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col">
            <h3 className="text-lg font-semibold mb-4">AI Teacha Pro</h3>
            <p className="text-2xl font-bold mb-2">
              {getCurrencySign(currency)} {prices.pro[currency][billingCycle]}
              {currency === "USD" && billingCycle === "yearly" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  {getCurrencySign(currency)}
                  {(prices.pro[currency][billingCycle] / 12).toFixed(2)} monthly
                </span>
              )}
              {currency === "GBP" && billingCycle === "yearly" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  {getCurrencySign(currency)}
                  {(prices.pro[currency][billingCycle] / 12).toFixed(2)} monthly
                </span>
              )}
              {billingCycle === "yearly" && currency === "NGN" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  ₦4,585 monthly
                </span>
              )}
            </p>
            <p className="mb-4 mt-2 text-sm text-gray-600">
              Upgrade to AI Teacha Pro for unlimited access to all resources and
              pro tools.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
              <strong>Everything in Free, Plus...</strong>
              <li>Unlock all 37 advanced, time-saving AI tools</li>
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
              <li>
                Unlimited AI-generated images perfect for engaging lessons
              </li>
              <li>Exclusive early access to new features and tools</li>
            </ul>
            <Button
              onClick={() => handlePayment("pro")}
              disabled={loadingPlan === "pro" || userDetails?.package === "pro"}
              className={`bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center ${
                userDetails?.package === "pro"
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "hover:bg-[#4a2fa3]"
              }`}
            >
              {userDetails?.package === "pro"
                ? "Current Plan"
                : loadingPlan === "pro"
                ? "Processing..."
                : "Upgrade to Pro"}
            </Button>
          </div>
          <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col">
            <h3 className="text-lg font-semibold mb-4">AI Teacha Premium</h3>
            <p className="text-2xl font-bold mb-2">
              {getCurrencySign(currency)}{" "}
              {prices.premium[currency][billingCycle]}
              {currency === "USD" && billingCycle === "yearly" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  {getCurrencySign(currency)}
                  {(prices.premium[currency][billingCycle] / 12).toFixed(
                    2
                  )}{" "}
                  monthly
                </span>
              )}
              {currency === "GBP" && billingCycle === "yearly" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  {getCurrencySign(currency)}
                  {(prices.premium[currency][billingCycle] / 12).toFixed(
                    2
                  )}{" "}
                  monthly
                </span>
              )}
              {billingCycle === "yearly" && currency === "NGN" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  ₦20,385 monthly
                </span>
              )}
            </p>
            <p className="mb-4 mt-2 text-sm text-gray-600">
              Full AI Teacha suite for schools with classroom, assignment, and
              report features.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
              <strong>Everything in Pro, Plus...</strong>
              <li>
                Institution-wide monitoring of teachers and students activity
              </li>
              <li>
                Moderation features to prioritize student safety and compliance
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
              onClick={() => handlePayment("premium")}
              disabled={
                loadingPlan === "premium" || userDetails?.package === "Premium"
              }
              className={`bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center ${
                userDetails?.package === "premium"
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "hover:bg-[#4a2fa3]"
              }`}
            >
              {userDetails?.package === "premium"
                ? "Current Plan"
                : loadingPlan === "premium"
                ? "Processing..."
                : "Upgrade to Premium"}
            </Button>
          </div>
        </div>
        <div className="border rounded-lg mt-4 text-center p-6 bg-gray-50 shadow-md flex flex-col">
          <h3 className="text-lg font-semibold ">AI Teacha Enterprise</h3>
          <p className="mb-4 mt-2 text-sm text-gray-600">
            Custom discounted pricing for schools, districts, institutions, and
            tutorial centers.
          </p>
          <ul className="list-none pl-5 space-y-2 mb-6 flex-grow">
            <strong>Everything in Premium, Plus...</strong>
            <li>Designed for large schools and institutions</li>
            <li>
              The AI Teacha Enterprise Plan is tailored for organizations with
              15 or more educators seeking comprehensive AI solutions
            </li>
            <li>
              Contact us today or use our Quote Calculator to receive customized
              pricing and exclusive discounts for your institution.
            </li>
          </ul>
          <Button
            onClick={() => navigate("/dashboard/upgrade/support")}
            disabled={
              loadingPlan === "enterprise" ||
              userDetails?.package === "Enterprise"
            }
            className={`bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center ${
              userDetails?.package === "enterprise"
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "hover:bg-[#4a2fa3]"
            }`}
          >
            {" "}
            {userDetails?.package === "Enterprise"
              ? "Current Plan"
              : loadingPlan === "enterprise"
              ? "Processing..."
              : "Contact Support"}{" "}
          </Button>{" "}
        </div>
      </div>
      {showToast && (
        <Toast variant={toastVariant} onOpenChange={setShowToast}>
          <ToastTitle>
            {toastVariant === "destructive" ? "Error" : "Success"}
          </ToastTitle>
          <ToastDescription>{toastMessage}</ToastDescription>
          <ToastClose />
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
};

export default Upgrade;
