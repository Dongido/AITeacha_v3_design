import React, { useState } from "react";
import { ChevronDown } from "lucide-react"; // optional, install via: npm install lucide-react

interface FAQItem {
  question: string;
  answer: string;
}

const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    { question: "What is AiTeacha?", answer: "AiTeacha is an educational platform designed to enhance learning experiences through AI-powered tools and resources." },
    { question: "Who can benefit from AiTeacha?", answer: "Students, educators, schools, and parents can benefit from AiTeacha by accessing personalized learning solutions and resources." },
    { question: "How does AiTeacha work?", answer: "AiTeacha uses advanced AI algorithms to analyze learning needs and provide tailored content to support diverse educational goals." },
    { question: "How can I get started with AiTeacha?", answer: "Getting started is easy! Simply sign up on the AiTeacha website, choose your subscription plan, and start exploring the features." },
    { question: "How secure is my data on AiTeacha?", answer: "Your data security is our priority. AiTeacha uses robust security measures to protect user data and ensure privacy." },
    { question: "How does billing work on AiTeacha?", answer: "Billing on AiTeacha is subscription-based, with various plans available to suit different needs. Payments can be managed through your account settings." },
    { question: "Can I customize the generated content?", answer: "Yes, AiTeacha allows users to customize content to meet specific learning objectives and preferences." },
    { question: "Is AI customizable with different curriculum standards?", answer: "AiTeacha supports customization for various curriculum standards, making it adaptable for different educational frameworks." },
    { question: "Is AiTeacha suitable for international educators?", answer: "Yes, AiTeacha is designed to support educators from around the world, with resources that cater to international standards and practices." },
    { question: "What support and resources are available to AiTeacha users?", answer: "AiTeacha provides extensive support resources, including tutorials, user guides, and a dedicated customer support team to assist users." },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h4 className="bg-gradient-to-r from-[#6200EE] to-[#F133E1] bg-clip-text text-transparent font-medium text-xl mb-2">
          More About Us
        </h4>
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="py-4">
            <button
              className="flex justify-between items-center w-full text-left focus:outline-none"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-gray-900 hover:text-purple-600 text-base md:text-lg cursor-pointer">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform duration-300 cursor-pointer ${
                  openIndex === index ? "rotate-180 text-purple-600" : ""
                }`}
              />
            </button>

            <div
              className={`mt-2 text-gray-600 text-sm md:text-base leading-relaxed transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;
