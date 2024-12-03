import React, { useState, useEffect } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { Switch } from "../../components/ui/Switch";
import { Button } from "../../components/ui/Button";
import { FLUTTERWAVE_PUBLIC } from "../../lib/utils";
import Logo from "../../assets/img/logo.png";
interface UserDetails {
  id: string;
  email: string;
  role: string;
  package: string;
  firstname: string;
}

const Upgrade: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<"pro" | "premium" | null>(
    null
  );

  const prices = {
    free: { monthly: "₦0", yearly: "₦0" },
    pro: { monthly: 5000, yearly: 55000 },
    premium: { monthly: 25000, yearly: 250000 },
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("ai-teacha-user");
    if (storedUser) {
      const userData: UserDetails = JSON.parse(storedUser);
      setUserDetails(userData);
    }
  }, []);

  const getFlutterwaveConfig = (plan: "pro" | "premium") => ({
    public_key: FLUTTERWAVE_PUBLIC,
    tx_ref: `TX_${Date.now()}`,
    amount: prices[plan][billingCycle],
    currency: "NGN",
    payment_options: "card, banktransfer, ussd",
    customer: {
      email: userDetails?.email || "default@email.com",
      phone_number: "08012345678",
      name: userDetails?.firstname || "Default User",
    },
    customizations: {
      title: plan === "pro" ? "Pro Plan" : "Premium Plan",
      description: `Upgrade to ${plan === "pro" ? "Pro" : "Premium"} Plan`,
      logo: Logo,
    },
  });

  const handlePayment = (plan: "pro" | "premium") => {
    setLoadingPlan(plan);
    const config = getFlutterwaveConfig(plan);
    const handleFlutterPayment = useFlutterwave(config);

    handleFlutterPayment({
      callback: (response) => {
        if (response.status === "successful") {
          alert("Payment Successful!");
        } else {
          alert("Payment Failed or Cancelled");
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
  return (
    <div className="mt-12">
      <h2 className="text-xl font-medium text-gray-900 mb-4">
        Welcome Back! 👋 View Subscription Plans
      </h2>

      <div className="mb-8 w-60 mx-auto flex items-center justify-between">
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
          <h3 className="text-lg font-semibold mb-4">Free Plan</h3>
          <p className="text-2xl font-bold mb-2">{prices.free[billingCycle]}</p>
          <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
            <li>Unlimited use</li>
            <li>Fine-tuned GPT Prompt</li>
            <li>16 AI Tools</li>
            <li>Resources Download Enabled</li>
            <li className="text-gray-400 line-through">Team Collaboration</li>
            <li className="text-gray-400 line-through">Free Support</li>
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
          <h3 className="text-lg font-semibold mb-4">Pro Plan</h3>
          <p className="text-2xl font-bold mb-2">
            ₦{prices.pro[billingCycle].toLocaleString()}
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
            <li>Unlimited use</li>
            <li>Fine-tuned GPT Prompt</li>
            <li>32 AI Tools</li>
            <li>Resources Download Enabled</li>
            <li>Team Collaboration</li>
            <li>Free Support</li>
          </ul>
          <Button
            onClick={() => handlePayment("pro")}
            disabled={loadingPlan === "pro" || userDetails?.package === "Pro"}
            className={`bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center ${
              userDetails?.package === "Pro"
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
          <h3 className="text-lg font-semibold mb-4">Premium Plan</h3>
          <p className="text-2xl font-bold mb-2">
            ₦{prices.premium[billingCycle].toLocaleString()}
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
            <li>Unlimited use</li>
            <li>Fine-tuned GPT Prompt</li>
            <li>32 AI Tools</li>
            <li>Resources Download Enabled</li>
            <li>Team Collaboration</li>
            <li>Free Support</li>
            <li>Create paid classes and handle payments</li>
            <li>Ability to add Team Members</li>
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
            {userDetails?.package === "Premium"
              ? "Current Plan"
              : loadingPlan === "premium"
              ? "Processing..."
              : "Upgrade to Premium"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
