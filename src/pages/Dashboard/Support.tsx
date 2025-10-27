import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import { contactUs } from "../../api/auth";
import { contactSlice } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";

const Support = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    message_content: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const contactMethods = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          {" "}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
          />{" "}
        </svg>
      ),
      contact: "+234 708-9115-000",
      title: "Phone",
      label: "Give us a call. Our Experts are ready to talk to you.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          {" "}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />{" "}
        </svg>
      ),
      contact: "info@aiteacha.com",
      title: "Email",
      label:
        "Drop us an email and you will receive a reply within a short time.",
    },
  ];
  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      subject: formData.subject,
      message_content: formData.message_content,
    };

    try {
      await dispatch(contactSlice(payload));
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        subject: "",
        message_content: "",
      });
      setSuccessMessage(
        "Your support request has been submitted. We'll get back to you shortly."
      );
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error submitting support form:", error);
    }
  };

  return (
    <div className="p-[30px]">

      <h4 className="font-semibold text-xl mb-[35px]">Contact Support</h4>
      {" "}
      <section>
        {" "}
        <div className="">
          {" "}
          {/* <div className="border  mx-auto mt-12 px-4 py-8 rounded-t-3xl text-center md:px-8">
            <ul className="bg-white border border-red-400 grid grid-cols-1 md:grid-cols-2  gap-[20px] gap-y-6 items-center lg:gap-x-18 list-none justify-center">
              {contactMethods.map((item, idx) => (
                <li key={idx}>
                  <h4 className="text-gray-900 text-lg font-bold">
                    {item.title}
                  </h4>
                  <h4 className="text-gray-800 text-sm max-w-xs">
                    {item.label}
                  </h4>
                  <div className="mt-3 flex justify-center items-center gap-x-3">
                    <div className="flex-none text-primary text-center">
                      {item.icon}
                    </div>
                    <p className="text-sm text-center">{item.contact}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div> */}


          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-[30px]">
              <div className="bg-white flex flex-col gap-4 rounded-xl p-[25px]">
                <BsTelephone className="text-primary font-bold" size={25}/>
                <div>
                  <p className="font-bold text-gray-700 m-0">Phone: +234 708-9115-000</p>
                  <p className="text-sm m-0">Give us a call. Our Experts are ready to talk to you.</p>
                </div>

              </div>
              <div className="bg-white rounded-xl p-[25px] flex flex-col gap-4">
                <AiOutlineMail className="text-primary font-bold" size={25} />
                
                <div>
                  <p className="font-bold text-gray-700 m-0">Email: info@aiteacha.com</p>
                  <p className="text-sm m-0">Drop us an email and you will receive a reply within a short time.</p>
                </div>


              </div>
            </div>
          </div>
        </div>{" "}
        <div className="border-2 gap-8 w-full bg-white rounded-2xl p-5 md:p-10  xl:gap-16 ">
          
          <div className="md:mt-0 w-full">
            {" "}
            <h2 className="mb-4 text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Submit a Support Ticket{" "}
            </h2>{" "}
            <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
              Please describe your issue in detail, and one of our experts will
              get back to you as soon as possible.{" "}
            </p>{" "}
            <form className="space-y-6 w-full" onSubmit={handleSubmit}>
              {" "}
              <div className="flex space-x-4">
                {" "}
                <div className="flex-1">
                  {" "}
                  <label htmlFor="" className="font-semibold">
                    First Name
                  </label>
                  <Input
                    name="firstname"
                    type="text"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="rounded-full border-gray-600"
                  />{" "}
                </div>{" "}
                <div className="flex-1">
                  {" "}
                  <label htmlFor="" className="font-semibold">
                    Last Name
                  </label>
                  <Input
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    type="text"
                    placeholder="Last Name"
                    required
                    className="rounded-full border-gray-600"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <label htmlFor="" className="font-semibold">
                    Email
                  </label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email Address"
                  required
                    className="rounded-full border-gray-600"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label htmlFor="" className="font-semibold">
                    Subject of your request
                  </label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  type="text"
                  placeholder="Subject of your request"
                  required
                    className="rounded-full border-gray-600"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label htmlFor="" className="font-semibold">
                    Describe your issue
                  </label>
                <TextArea
                  name="message_content"
                  value={formData.message_content}
                  onChange={handleChange}
                  placeholder="Describe your issue"
                  required
                    className="rounded-xl border-gray-600"
                />{" "}
              </div>{" "}
              <div className="text-center">
                {" "}
                <Button
                  type="submit"
                  disabled={loading}
                  variant={"gradient"}
                  className="inline-flex items-center text-white focus:ring-4 focus:ring-primary-300 font-medium rounded-full text-sm px-5 py-2.5 text-center w-full dark:focus:ring-primary-900"
                >
                  Send Request{" "}
                </Button>{" "}
                {successMessage && (
                  <p className="text-green-600 text-sm mt-2">
                    {successMessage}{" "}
                  </p>
                )}{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
};

export default Support;
