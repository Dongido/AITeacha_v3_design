import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
// Removed Switch import as it's no longer used
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PricingFaq from "./components/PricingFaq";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<
    "month" | "threeMonths" | "year"
  >("month");
  const [currency, setCurrency] = useState<"NGN" | "USD" | "GBP">("NGN");
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();

        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json();

        setUserCountry(geoData.country);
        // Set default currency based on detected country
        switch (geoData.country) {
          case "NG":
            setCurrency("NGN");
            break;
          case "US":
            setCurrency("USD");
            break;
          case "GB":
            setCurrency("GBP");
            break;
          default:
            setCurrency("USD"); // Default to USD for other countries
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
        // Fallback to USD if location detection fails
        setCurrency("USD");
      }
    };

    fetchUserLocation();
  }, []);

  const prices = {
    free: {
      NGN: { month: "₦0", threeMonths: "₦0", year: "₦0" },
      USD: { month: "$0", threeMonths: "$0", year: "$0" },
      GBP: { month: "£0", threeMonths: "£0", year: "£0" },
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
      // Enterprise pricing is custom, not fixed monthly/yearly rates
      NGN: { month: "Custom", threeMonths: "Custom", year: "Custom" },
      USD: { month: "Custom", threeMonths: "Custom", year: "Custom" },
      GBP: { month: "Custom", threeMonths: "Custom", year: "Custom" },
    },
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as "NGN" | "USD" | "GBP");
  };

  const handleVerifyCoupon = async () => {
    setLoading(true);
    setVerificationMessage(null);
    // Simulate API call for coupon verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (couponCode === "AITEACHA20") {
      setVerificationMessage("Coupon applied successfully! 20% discount.");
      // In a real application, you'd apply the discount to the prices here or
      // store the coupon status to be applied during checkout.
    } else {
      setVerificationMessage("Invalid or expired coupon code.");
    }
    setLoading(false);
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
    <div className="flex flex-col min-h-screen bg-white">
      <section>
        <Navbar />
      </section>
      <section className="mt-24">
        <section className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden">
          <span className="absolute inset-0 z-0 p-5 justify-center top-[rem]"></span>
          <figcaption className="desc z-10 relative px-2">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-6 text-white">
              Our Subscription Plans
            </h1>
            <p className="text-center text-md md:text-lg lg:text-xl font-bold text-gray-200">
              Simple & Transparent Pricing for Educators & Schools
            </p>
            <div className="flex justify-center items-center mx-auto text-center text-gray-400 max-w-4xl mb-6">
              <span>
                <h2>
                  We offer a Free plan for educators with limited access, a Pro
                  plan with more Pro tools and classroom features, a Premium
                  plan with full AiTeacha suite for schools with maximum number
                  of 15 educators and an Enterprise plan for larger schools with
                  more than 15 educators.
                </h2>
              </span>
            </div>
          </figcaption>
        </section>
      </section>

      <div className="mt-12">
        <div className="flex flex-col md:flex-row justify-between  mb-6 px-4">
          <div className="w-full md:w-60 mb-4 md:mb-0">
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
              {userCountry === "NG" && <option value="NGN">NGN (Naira)</option>}
              <option value="USD">USD (Dollar)</option>
              <option value="GBP">GBP (Pounds)</option>
            </select>
          </div>

          <div className="w-full md:w-60">
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
          <div className="mx-auto px-4 py-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
              For Individuals
            </h2>

            <div className="flex flex-col lg:flex-row justify-center items-stretch lg:space-x-8 space-y-8 lg:space-y-0">
              <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-4">AiTeacha Free</h3>
                <p className="text-2xl font-bold mb-2">
                  {prices.free[currency][billingCycle]}
                </p>
                <p className="mb-4 mt-2 text-sm text-gray-600">
                  Get started for Free, learn how AiTeacha saves you time and
                  generates tailored resources.
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
                  <strong>Save time, get resources...</strong>
                  <li>Unlimited use of our essential free tools</li>
                  <li>Generate tailored, high-quality resources</li>
                  <li>
                    15 Time-Saving Tools to simplify lesson planning,
                    assessments, and more
                  </li>
                  <li>Easily download and save your generated resources</li>
                  <li>
                    Interact with Zyra, our AI Chat Assistant, built exclusively
                    for educators and students
                  </li>
                  <li>AI Image generation for educators and students</li>
                </ul>
                <Button
                  onClick={() => navigate("/auth/onboarding")}
                  className="w-full py-2 rounded-md bg-primary text-white hover:bg-[#4a2fa3] transition mt-auto"
                >
                  Sign Up for Free
                </Button>
              </div>

              {/* AiTeacha Basic Card (visible only for NGN) */}
              {currency === "NGN" && (
                <div className="border rounded-lg p-6 bg-white shadow-md flex flex-col flex-1">
                  <h3 className="text-xl font-semibold mb-4 text-black">
                    AiTeacha Basic
                  </h3>
                  <p className="text-3xl font-bold mb-2">
                    {getCurrencySign(currency)}
                    {(
                      prices.basic[currency][billingCycle] as number
                    ).toLocaleString()}
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
                          (prices.basic[currency][billingCycle] as number) / 12
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        monthly
                      </span>
                    )}
                  </p>
                  <p className="mb-4 mt-2 text-sm text-gray-600">
                    An affordable entry plan for teachers with access to
                    essential AI tools for lesson planning and content creation.
                  </p>

                  <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
                    <strong>Everything in Free, Plus...</strong>
                    <li>
                      Access to all<strong> 45 AI tools </strong> under the{" "}
                      <strong>"My Tools"</strong> section
                    </li>
                    <li>
                      {" "}
                      Unlimited content generation for lesson plans,
                      assessments, and more.{" "}
                    </li>
                    <li>
                      Generate AI-powered slides and export directly to
                      Microsoft PowerPoint
                    </li>
                    <li>Unlimited AI-generated images and labeled diagrams.</li>
                    <li>
                      Download and save all your generated resources for offline
                      use.
                    </li>
                    <li> No Classroom Management</li>
                  </ul>
                  <Button
                    onClick={() => navigate("/auth/onboarding")}
                    className="bg-primary text-white w-full py-2 rounded-md transition duration-200 mt-auto text-lg font-medium hover:bg-[#4a2fa3]"
                  >
                    Subscribe to Basic
                  </Button>
                </div>
              )}

              {/* AiTeacha Pro Card */}
              <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-4">AiTeacha Pro</h3>
                <p className="text-2xl font-bold mb-2">
                  {getCurrencySign(currency)}{" "}
                  {(
                    prices.pro[currency][billingCycle] as number
                  ).toLocaleString()}
                  {(currency === "USD" ||
                    currency === "GBP" ||
                    currency === "NGN") &&
                    billingCycle === "year" && (
                      <span className="font-medium text-sm text-gray-700 block mt-1">
                        {" "}
                        {getCurrencySign(currency)}
                        {(
                          (prices.pro[currency][billingCycle] as number) / 12
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        monthly
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
                  onClick={() => navigate("/auth/onboarding")}
                  className="bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center hover:bg-[#4a2fa3]"
                >
                  Subscribe to Pro
                </Button>
              </div>
            </div>
          </div>

          {/* Pricing Cards for Schools */}
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
              For Schools
            </h2>

            <div className="flex flex-col lg:flex-row justify-center items-stretch lg:space-x-8 space-y-8 lg:space-y-0 mx-auto">
              {/* AiTeacha Premium Card */}
              <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-4">AiTeacha Premium</h3>
                <p className="text-2xl font-bold mb-2">
                  {getCurrencySign(currency)}{" "}
                  {(
                    prices.premium[currency][billingCycle] as number
                  ).toLocaleString()}
                  {(currency === "USD" ||
                    currency === "GBP" ||
                    currency === "NGN") &&
                    billingCycle === "year" && (
                      <span className="font-medium text-sm text-gray-700 block mt-1">
                        {" "}
                        {getCurrencySign(currency)}
                        {(
                          (prices.premium[currency][billingCycle] as number) /
                          12
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        monthly
                      </span>
                    )}
                </p>
                <p className="mb-4 mt-2 text-sm text-gray-600">
                  Full AiTeacha suite for schools with classroom, assignment,
                  and report features.
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
                  <strong>Everything in Pro, Plus...</strong>
                  <li>
                    Institution-wide monitoring of teachers and students
                    activity
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
                  onClick={() => navigate("/auth/onboarding")}
                  className="bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center hover:bg-[#4a2fa3]"
                >
                  Subscribe to Premium
                </Button>
              </div>

              <div className="border rounded-lg p-6 bg-gray-50 shadow-md flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-4">
                  AiTeacha Enterprise
                </h3>
                <p className="text-2xl font-bold mb-2">Custom Pricing</p>
                <p className="mb-4 mt-2 text-sm text-gray-600">
                  Custom discounted pricing for schools, districts,
                  institutions, and tutorial centers.
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
                    On-site training and implementation support (where
                    applicable)
                  </li>
                  <li>
                    Advanced analytics and reporting for institution-wide
                    insights
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
                  className="bg-primary text-white w-full py-2 rounded-md transition mt-auto text-center hover:bg-[#4a2fa3]"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <PricingFaq />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
