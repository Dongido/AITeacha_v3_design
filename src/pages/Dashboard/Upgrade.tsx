import React, { useState } from "react";
import { Switch } from "../../components/ui/Switch";

const Upgrade = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const prices = {
    free: {
      monthly: "₦0",
      yearly: "₦0",
    },
    pro: {
      monthly: "₦5000",
      yearly: "₦55000",
    },
    premium: {
      monthly: "#25,000",
      yearly: "#250,000",
    },
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
        <span className=" text-xl font-medium text-gray-800">Monthly</span>
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
          <button className="bg-gray-300 text-gray-700 w-full py-2 rounded-md cursor-not-allowed mt-auto">
            Current Plan
          </button>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Pro Plan</h3>
          <p className="text-2xl font-bold mb-2">{prices.pro[billingCycle]}</p>
          <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
            <li>Unlimited use</li>
            <li>Fine-tuned GPT Prompt</li>
            <li>32 AI Tools</li>
            <li>Resources Download Enabled</li>
            <li>Team Collaboration</li>
            <li>Free Support</li>
          </ul>
          <button className="bg-[#5c3cbb] text-white w-full py-2 rounded-md hover:bg-[#4a2fa3] transition mt-auto">
            Upgrade to Pro
          </button>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Premium Plan</h3>
          <p className="text-2xl font-bold mb-2">
            {prices.premium[billingCycle]}
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
          <button className="bg-[#5c3cbb] text-white w-full py-2 rounded-md hover:bg-[#4a2fa3] transition mt-auto">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
