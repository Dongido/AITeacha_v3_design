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

const FaqsSection: React.FC = () => {
  const faqsList: Faq[] = [
    {
      q: "What is AiTeacha?",
      a: "AiTeacha is an educational platform designed to enhance learning experiences through AI-powered tools and resources.",
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
    {
      q: "Is AiTeacha suitable for international educators?",
      a: "Yes, AiTeacha is designed to support educators from around the world, with resources that cater to international standards and practices.",
    },
    {
      q: "What support and resources are available to AiTeacha users?",
      a: "AiTeacha provides extensive support resources, including tutorials, user guides, and a dedicated customer support team to assist users.",
    },
  ];

  return (
    <section className="leading-relaxed mt-24 ">
      <section className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden overlow-hidden">
        <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
        <section>
          <figcaption className="desc z-10 relative text-center px-2">
            <h3 className="text-gray-300 font-semibold text-xl ">
              More About Us
            </h3>
            <h1 className="text-3xl md:text-4xl lg:text-6xl text-white font-semibold">
              Frequently Asked Questions
            </h1>
          </figcaption>
        </section>
      </section>
      <div className="space-y-2 text-center"></div>
      <div className="mt-14 max-w-2xl px-4 md:px-8 mx-auto">
        {faqsList.map((item, idx) => (
          <FaqsCard key={idx} idx={idx} faqsList={item} />
        ))}
      </div>
    </section>
  );
};

export default FaqsSection;
