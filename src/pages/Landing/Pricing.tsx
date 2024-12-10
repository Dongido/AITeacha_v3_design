import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Switch } from "../../components/ui/Switch";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BlogApp from "./components/BlogSlider";
import { useNavigate } from "react-router-dom";
const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [currency, setCurrency] = useState<"NGN" | "USD" | "GBP">("NGN");

  const navigate = useNavigate();

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
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as "NGN" | "USD");
  };
  const toggleBillingCycle = () => {
    setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"));
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
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Header />
      </section>
      <div className="mt-24 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Our Subscription Plans
        </h2>
        <div className="flex justify-center items-center mx-auto text-center max-w-xl mb-6">
          <span>
            <h2 className=" text-xl font-bold ">
              Simple & Transparent Pricing for Educators & Schools
            </h2>
            <h2>
              We offer a Free plan for educators with limited access, a Pro plan
              with more Pro tools and classroom features, a Premium plan with
              full AI Teacha suite for schools with maximum number of 15
              educators and an Enterprise plan for larger schools with more than
              15 educators.
            </h2>
          </span>
        </div>

        <div className="flex justify-between">
          <div className="mb-8 w-60 mx-auto flex items-center justify-between">
            <span className="text-xl font-medium text-gray-800">Monthly</span>
            <Switch
              checked={billingCycle === "yearly"}
              onCheckedChange={toggleBillingCycle}
              thumbColor="primary"
            />
            <span className="text-xl font-medium text-gray-800">Yearly</span>
          </div>
          <div className="w-60 my-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 bg-gray-50 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold mb-4">AI Teacha Free</h3>
            <p className="text-2xl font-bold mb-2">
              {prices.free[currency][billingCycle]}
            </p>
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
            <Button className="w-full py-2 rounded-md bg-primary text-white hover:bg-[#4a2fa3] transition mt-auto">
              Sign Up for Free
            </Button>
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
            <Button className="w-full py-2 rounded-md bg-primary text-white hover:bg-[#4a2fa3] transition mt-auto">
              Subscribe to Pro
            </Button>
          </div>

          <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col">
            <h3 className="text-lg font-semibold mb-4">AI Teacha Premium </h3>
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
            <Button className="w-full py-2 rounded-md bg-primary text-white hover:bg-[#4a2fa3] transition mt-auto">
              Subscribe to Premium
            </Button>
          </div>
        </div>
        <div className="border rounded-lg p-6 bg-gray-50 text-center mt-4 shadow-md flex flex-col">
          <h3 className="text-lg font-semibold mb-4">AI Teacha Enterprise</h3>

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
            onClick={() => navigate("/upgrade/support")}
            className="w-full py-2 rounded-md bg-primary text-white hover:bg-[#4a2fa3] transition mt-auto"
          >
            Get a Quote
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
