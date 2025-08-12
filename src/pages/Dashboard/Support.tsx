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
      subject: formData.subject, // New field for support
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
      }, 5000); // Shorter timeout for success message
    } catch (error) {
      console.error("Error submitting support form:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="mt-24">
        <section className="bg-gray-50 ">
          <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
            <img
              className="w-full dark:hidden"
              src="https://images.template.net/78027/Free-Contact-Us-Illustration-JPEG-1.jpg"
              alt="Contact image"
            />
            <img
              className="w-full hidden dark:block"
              src="https://images.template.net/78027/Free-Contact-Us-Illustration-JPEG-1.jpg"
              alt="Contact image"
            />
            <div className="md:mt-0">
              <h2 className="mb-4 text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Submit a Support Ticket
              </h2>
              <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                Please describe your issue in detail, and one of our experts
                will get back to you as soon as possible.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      name="firstname"
                      type="text"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      type="text"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text"
                    placeholder="Subject of your request"
                    required
                  />
                </div>

                <div>
                  <TextArea
                    name="message_content"
                    value={formData.message_content}
                    onChange={handleChange}
                    placeholder="Describe your issue"
                    required
                  />
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={loading}
                    variant={"gradient"}
                    className="inline-flex items-center text-white focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full dark:focus:ring-primary-900"
                  >
                    Send Request
                  </Button>
                  {successMessage && (
                    <p className="text-green-600 text-sm mt-2">
                      {successMessage}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
