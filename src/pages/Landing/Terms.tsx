import Header from "./components/Header";
import Footer from "./components/Footer";
import BlogApp from "./components/BlogSlider";
const Terms = () => {
  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Header />
      </section>
      <div className="mt-32">
        <h2 className="text-4xl text-black text-center font-bold">
          Terms and Conditions
        </h2>
        <h2 className="text-sm text-gray-600 text-center">
          We guarantee your data privacy
        </h2>

        <div className="rounded-t-3xl shadow-md max-w-4xl mx-auto px-8 py-6 mt-8">
          <span className="font-bold text-2xl"> “AI TEACHA” APP</span>
          <br />
          <br />
          These Terms and Conditions ("Terms") govern your use of the{" "}
          <span className="font-bold">"Ai Teacha"</span> application ("App")
          provided by <span className="font-bold">AI Teacha </span>("Company")
          for schools and educational institutions. By accessing or using the
          App, you agree to comply with these Terms.
          <br />
          <br />
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                1. License
              </h2>
              <p className="text-gray-700">
                The Company grants you a non-exclusive, non-transferable license
                to use the App for educational purposes only, subject to these
                Terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                2. User Accounts
              </h2>
              <p className="text-gray-700">
                You may be required to create a user account to access and use
                the App. You are responsible for maintaining the confidentiality
                of your account information and agree to be solely responsible
                for all activities that occur under your account.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                3. Acceptable Use
              </h2>
              <p className="text-gray-700">
                You agree not to use the App in any way that violates applicable
                laws, regulations, or infringes upon the rights of others. You
                shall not upload, post, transmit, or distribute any content that
                is unlawful, harmful, or offensive.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                4. Intellectual Property
              </h2>
              <p className="text-gray-700">
                All intellectual property rights in the App, including but not
                limited to trademarks, copyrights, and patents, are owned by the
                Company. You shall not copy, modify, distribute, or exploit any
                part of the App without the Company's prior written consent.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                5. Data Privacy
              </h2>
              <p className="text-gray-700">
                The Company respects your privacy and handles your personal data
                in accordance with its Privacy Policy. By using the App, you
                consent to the Company's collection, use, and disclosure of your
                personal data as described in the Privacy Policy.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                6. Disclaimer of Warranty
              </h2>
              <p className="text-gray-700">
                The App is provided "as is" without any warranty or
                representation, whether express or implied. The Company does not
                guarantee that the App will be error-free, uninterrupted, or
                secure.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700">
                The Company shall not be liable for any direct, indirect,
                incidental, consequential, or special damages arising out of or
                in connection with the use of the App, even if the Company has
                been advised of the possibility of such damages.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                8. Termination
              </h2>
              <p className="text-gray-700">
                The Company may, at its sole discretion, suspend or terminate
                your access to the App at any time, without prior notice, for
                any reason or no reason.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                9. Governing Law
              </h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction where the Company is
                incorporated, without regard to its conflict of laws provisions.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-900">
                10. Amendments
              </h2>
              <p className="text-gray-700">
                The Company reserves the right to modify or update these Terms
                at any time. Your continued use of the App after such
                modifications shall constitute your acceptance of the updated
                Terms.
              </p>
              <br />
              <span className="italic font-bold">
                Please read these Terms carefully before using the Ai Teacha
                App. If you do not agree with any provision of these Terms, you
                should not use the App.
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
