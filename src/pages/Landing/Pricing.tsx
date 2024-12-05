import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Switch } from "../../components/ui/Switch";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BlogApp from "./components/BlogSlider";
const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const prices = {
    free: { monthly: "₦0", yearly: "₦0" },
    pro: { monthly: 5000, yearly: 55000 },
    premium: { monthly: 25000, yearly: 250000 },
  };

  const toggleBillingCycle = () => {
    setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"));
  };
  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Header />
      </section>
      <div className="mt-24 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Our Subscription Plans
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
            <p className="text-2xl font-bold mb-2">
              {prices.free[billingCycle]}
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
              <li>Unlimited use</li>
              <li>Fine-tuned GPT Prompt</li>
              <li>16 AI Tools</li>
              <li>Resources Download Enabled</li>
              <li className="text-gray-400 line-through">Team Collaboration</li>
              <li className="text-gray-400 line-through">Free Support</li>
            </ul>
            <Button className="w-full py-2 rounded-md bg-primary text-white hover:bg-[#4a2fa3] transition mt-auto">
              Sign Up for Free
            </Button>
          </div>

          <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Pro Plan</h3>
            <p className="text-2xl font-bold mb-2">
              ₦{prices.pro[billingCycle].toLocaleString()}
              {billingCycle === "yearly" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  ₦4,585 monthly
                </span>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
              <li>Unlimited use</li>
              <li>Fine-tuned GPT Prompt</li>
              <li>32 AI Tools</li>
              <li>Resources Download Enabled</li>
              <li>Create Classes</li>
              <li>Free Support</li>
            </ul>
            <Button className="w-full py-2 rounded-md bg-primary text-white hover:bg-[#4a2fa3] transition mt-auto">
              Pro
            </Button>
          </div>

          <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Premium Plan</h3>
            <p className="text-2xl font-bold mb-2">
              ₦{prices.premium[billingCycle].toLocaleString()}{" "}
              {billingCycle === "yearly" && (
                <span className="font-medium text-sm text-gray-700">
                  {" "}
                  ₦20,385 monthly
                </span>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
              <li>Unlimited use</li>
              <li>Fine-tuned GPT Prompt</li>
              <li>32 AI Tools</li>
              <li>Resources Download Enabled</li>

              <li>Free Support</li>
              <li>Create paid classes and handle payments</li>
              <li>Ability to Add Team Members</li>
            </ul>
            <Button className="w-full py-2 rounded-md bg-primary text-white hover:bg-[#4a2fa3] transition mt-auto">
              Premium
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
