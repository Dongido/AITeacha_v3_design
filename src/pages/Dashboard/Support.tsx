import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import { contactUs } from "../../api/auth";
import { contactSlice } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";

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
    <div className="bg-gray-50 ">
      {" "}
      <section>
        {" "}
        <div className="mt-4">
          {" "}
          <div className="max-w-screen-xl shadow-md border mx-auto mt-12 px-4 py-8 rounded-t-3xl text-center md:px-8">
            <ul className="flex flex-wrap gap-x-8 gap-y-6 items-center lg:gap-x-18 list-none justify-center">
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
          </div>
        </div>{" "}
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
          {" "}
          <img
            className="w-full dark:hidden"
            src="https://images.template.net/78027/Free-Contact-Us-Illustration-JPEG-1.jpg"
            alt="Contact image"
          />{" "}
          <img
            className="w-full hidden dark:block"
            src="https://images.template.net/78027/Free-Contact-Us-Illustration-JPEG-1.jpg"
            alt="Contact image"
          />{" "}
          <div className="md:mt-0">
            {" "}
            <h2 className="mb-4 text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Submit a Support Ticket{" "}
            </h2>{" "}
            <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
              Please describe your issue in detail, and one of our experts will
              get back to you as soon as possible.{" "}
            </p>{" "}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {" "}
              <div className="flex space-x-4">
                {" "}
                <div className="flex-1">
                  {" "}
                  <Input
                    name="firstname"
                    type="text"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                  />{" "}
                </div>{" "}
                <div className="flex-1">
                  {" "}
                  <Input
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    type="text"
                    placeholder="Last Name"
                    required
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email Address"
                  required
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  type="text"
                  placeholder="Subject of your request"
                  required
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <TextArea
                  name="message_content"
                  value={formData.message_content}
                  onChange={handleChange}
                  placeholder="Describe your issue"
                  required
                />{" "}
              </div>{" "}
              <div className="text-center">
                {" "}
                <Button
                  type="submit"
                  disabled={loading}
                  variant={"gradient"}
                  className="inline-flex items-center text-white focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full dark:focus:ring-primary-900"
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
