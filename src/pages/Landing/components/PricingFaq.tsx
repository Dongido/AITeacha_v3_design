import { useRef, useState } from "react";

interface Faq {
  q: string;
  a: string;
}

interface FaqsCardProps {
  faqsList: Faq;
  idx: number;
}

const FaqsCard: React.FC<FaqsCardProps> = ({ faqsList, idx }) => {
  const answerElRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState(false);
  const [answerH, setAnswerH] = useState("0px");

  const handleOpenAnswer = () => {
    if (answerElRef.current) {
      const answerElH = answerElRef.current.childNodes[0] as HTMLElement;
      setState(!state);
      setAnswerH(`${answerElH.offsetHeight + 20}px`);
    }
  };

  return (
    <div
      className="space-y-3 mt-5 overflow-hidden border-b border-gray-300"
      key={idx}
      onClick={handleOpenAnswer}
    >
      <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-800 font-medium">
        {faqsList.q}
        {state ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700  ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 12H4"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15.5L16.5 11L15.075 9.6L12 12.675L8.925 9.6L7.5 11L12 15.5ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
              fill="#010101"
            />
          </svg>
        )}
      </h4>
      <div
        ref={answerElRef}
        className="duration-300"
        style={state ? { height: answerH } : { height: "0px" }}
      >
        <div className="bg-gray-200 p-2 rounded-md">
          <p className="text-gray-900">{faqsList.a}</p>
        </div>
      </div>
    </div>
  );
};

const PricingFaq: React.FC = () => {
  const faqsList: Faq[] = [
    {
      q: "Is AiTeacha still free for teachers?",
      a: "Yes! AiTeacha offers the AiTeacha Free plan, which is free forever. This plan ensures that teachers across Nigeria and Africa can access essential tools to enhance teaching and learning at no cost.",
    },
    {
      q: "How can I access all the features of AiTeacha Pro, Premium, and Enterprise?",
      a: "To unlock advanced features such as in-depth analytics, administrative controls, and customizations, you can upgrade to AiTeacha Pro or AiTeacha Premium as an individual educator. For schools or districts, the AiTeacha Enterprise plan offers tailored solutions. Request a quote to explore how it fits your institution's needs.",
    },
    {
      q: "Can I still get premium features if my school doesn’t have an Enterprise license?",
      a: "Absolutely! If your school hasn’t adopted AiTeacha Enterprise, you can subscribe to either AiTeacha Pro or AiTeacha Premium as an individual. These plans provide access to premium tools instantly. Simply click 'Upgrade' in the app to subscribe.",
    },
    {
      q: "What are the costs for AiTeacha plans?",
      a: "AiTeacha Free: Free Forever\nAiTeacha Pro (Individual Educators):\n- Billed Monthly: ₦5,000 per month\n- Billed Yearly (8% Discount): ₦55,000 per year\nAiTeacha Premium (Individual Educators):\n- Billed Monthly: ₦20,000 per month\n- Billed Yearly (17% Discount): ₦200,000 per year\nAiTeacha Enterprise (Schools and Districts):\nPricing is customized based on the number of users and features required. Request a quote to get a tailored plan.",
    },
    {
      q: "How does AiTeacha’s pricing compare to other platforms?",
      a: "AiTeacha is designed specifically for educators and students, offering affordable pricing tailored to African schools. Compared to general-purpose AI tools, AiTeacha provides superior value with tools and features optimized for education—all at significantly lower costs.",
    },
    {
      q: "What happens if I subscribe to AiTeacha Pro or Premium and my school later opts for Enterprise?",
      a: "No problem! If your school transitions to an Enterprise license, we’ll offer a prorated refund for your AiTeacha Pro or Premium subscription. Be sure to use your school email when signing up to simplify the process.",
    },
    {
      q: "Are there usage limits for free and paid plans?",
      a: "Free Users: AiTeacha Free has usage limits to ensure equitable access for all. Most users won’t reach the limit until late in the month, but heavy users may experience earlier restrictions. Limits reset monthly, and you’ll receive a warning as you approach the limit. Pro, Premium, and Enterprise Users: Enjoy unlimited usage, except in rare cases for extreme usage (top 0.1% of users).",
    },
    {
      q: "How will I know if I’m nearing my limit as a free user?",
      a: "Free user limits adjust dynamically based on platform usage. Notifications will alert you as you approach your limit. For unlimited access, consider upgrading to AiTeacha Pro, AiTeacha Premium, or encouraging your school to adopt AiTeacha Enterprise.",
    },
    {
      q: "Is AiTeacha still free for teachers?",
      a: "Yes! AiTeacha offers the AiTeacha Free plan, which is free forever. This plan ensures that teachers across Nigeria and Africa can access essential tools to enhance teaching and learning at no cost.",
    },
    {
      q: "Who can benefit from AiTeacha?",
      a: "Students, educators, schools, and parents can benefit from AiTeacha by accessing personalized learning solutions and resources.",
    },
    {
      q: "How does AiTeacha work?",
      a: "AiTeacha uses advanced AI algorithms to analyze learning needs and provide tailored content to support diverse educational goals.",
    },
    {
      q: "How can I get started with AiTeacha?",
      a: "Getting started is easy! Simply sign up on the AiTeacha website, choose your subscription plan, and start exploring the features.",
    },
    {
      q: "How secure is my data on AiTeacha?",
      a: "Your data security is our priority. AiTeacha uses robust security measures to protect user data and ensure privacy.",
    },
    {
      q: "How does billing work on AiTeacha?",
      a: "Billing on AiTeacha is subscription-based, with various plans available to suit different needs. Payments can be managed through your account settings.",
    },
    {
      q: "Can I customize the generated content?",
      a: "Yes, AiTeacha allows users to customize content to meet specific learning objectives and preferences.",
    },
    {
      q: "Is AI customizable with different curriculum standards?",
      a: "AiTeacha supports customization for various curriculum standards, making it adaptable for different educational frameworks.",
    },
  ];

  return (
    <section className="leading-relaxed max-w-screen-xl mt-12 mx-auto px-4 md:px-8">
      <div className="space-y-2 text-center">
        <h3 className="text-primary font-semibold text-xl">
          More About Pricing
        </h3>
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 font-semibold">
          Pricing FAQ for AiTeacha Plans
        </h1>
      </div>
      <div className="mt-14 max-w-2xl mx-auto">
        {faqsList.map((item, idx) => (
          <FaqsCard key={idx} idx={idx} faqsList={item} />
        ))}
      </div>
    </section>
  );
};

export default PricingFaq;
