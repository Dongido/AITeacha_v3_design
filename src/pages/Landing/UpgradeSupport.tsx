import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const UpgradeSupport = () => {
  return (
    <>
      <Navbar />

      <div className="flex items-center text-xl mt-24 font-bold rounded-md text-black w-full gap-12">
        <main className="w-1/2">
          <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
            <div className="max-w-xl space-y-3">
              <h3 className="text-primary font-semibold">
                Request an AiTeacha quote!
              </h3>
              <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                We are so excited to be partnering with you!
              </p>
              <p>
                Please email us at:
                <br />
                <a href="mailto:quotes@curipod.com" className="text-primary">
                  quotes@aiteacha.com
                </a>
              </p>
            </div>
          </div>
        </main>

        <div className="w-1/2">
          <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
            <div className="max-w-xl space-y-3">
              <h3 className="text-primary font-semibold">Please include:</h3>
              <ul className="list-disc space-y-2">
                <li>Your name</li>
                <li>Email</li>
                <li>Number of schools you want AiTeacha for</li>
                <li>Your school's name</li>
                <li>Your district's name</li>
                <li>Your role at your school/district</li>
                <li>...and anything else we should know.</li>
              </ul>
              <p>
                You will receive a formal quote within 24 hours of your request.
              </p>
              <p>
                Questions or concerns? Contact Uche at:
                <br />
                <a
                  href="mailto:amanda.aitkens@curipod.com"
                  className="text-primary"
                >
                  uchenwaobi@aiteacha.com
                </a>{" "}
                ||
                <a href="tel:+4792943686" className="text-primary">
                  +234 803-8563-171,
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UpgradeSupport;
