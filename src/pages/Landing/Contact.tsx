import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { Button } from "../../components/ui/Button";
const Contact = () => {
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      ),
      contact: " 65, Gbasemo Street, Aga Ikorodu, Lagos Nigeria",
      title: "Our office",
      label:
        "Visit us at our local office. We would love to get to know in person.",
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
          />
        </svg>
      ),
      contact: "+234 708-9115-000",
      title: "Phone",
      label:
        "Drop us an email and you will receive a reply within a short time.",
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      ),
      contact: "info@aiteacha.com",
      title: "Email",
      label: "Give us a call. Our Experts are ready to talk to you.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section>
        <Navbar />
      </section>
      <div className="mt-24">
        <section className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden overlow-hidden">
          <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
          <section>
            <figcaption className="desc z-10 relative">
              <h1 className="text-6xl font-bold text-center my-2 text-header text-white">
                {" "}
                Get in Touch with Us
              </h1>
              <h2 className="text-xl text-gray-300 text-center">
                We are always here right by your side
              </h2>
            </figcaption>
          </section>
        </section>

        <div className="mt-24">
          <div className="max-w-screen-xl shadow-md border  mx-auto my-12 px-4 py-8 rounded-t-3xl text-center md:px-8">
            <ul className=" flex flex-wrap gap-x-8 gap-y-6 items-center lg:gap-x-18">
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
        </div>
        <section>
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
            <div className=" md:mt-0">
              <h2 className="mb-4 text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                We’d love to hear from you!
              </h2>
              <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                Please fill out the form below, and we will get back to you as
                soon as possible.
              </p>

              <form className="space-y-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input type="text" placeholder="First Name" required />
                  </div>
                  <div className="flex-1">
                    <Input type="text" placeholder="Last Name" required />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input type="email" placeholder="Email Address" required />
                  </div>
                  <div className="flex-1">
                    <Input type="tel" placeholder="Phone Number" required />
                  </div>
                </div>

                <div>
                  <TextArea placeholder="Your Message" required />
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    variant={"gradient"}
                    className="inline-flex items-center text-white  focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full dark:focus:ring-primary-900"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
