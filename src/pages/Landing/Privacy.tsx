import Header from "./components/Header";
import Footer from "./components/Footer";
const Privacy = () => {
  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Header />
      </section>
      <div className="mt-32">
        <h2 className="text-4xl text-black text-center font-bold">
          Privacy Policy
        </h2>
        <h2 className="text-sm text-gray-600 text-center">
          We guarantee your data privacy
        </h2>

        <div className="rounded-t-3xl shadow-md max-w-4xl mx-auto px-8 py-6 mt-8">
          <span className="font-bold text-2xl"> “AI TEACHA” APP</span>
          <br />
          <br />
          This Privacy Policy ("Policy") describes how
          <span className="font-bold">"Ai Teacha"</span> ("Company," "we," or
          "us") collects, uses, and shares personal information when you use the{" "}
          <span className="font-bold">"AI Teacha "</span>application ("App") for
          schools and educational institutions. By accessing or using the App,
          you consent to the practices described in this Policy.
          <br />
          <br />
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                1. Information We Collect
              </h2>
              <div className="ml-4">
                <p className="text-gray-700">
                  <strong>a. Personal Information:</strong> We may collect
                  personal information such as your name, email address, and
                  school/educational institution details when you create an
                  account or interact with the App.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>b. Usage Information:</strong> We may collect
                  information about how you use the App, including your
                  interactions, preferences, and settings.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>c. Device Information:</strong> We may collect
                  device-specific information, such as your device model,
                  operating system, and unique device identifiers, to optimize
                  App performance.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                2. Use of Information
              </h2>
              <div className="ml-4">
                <p className="text-gray-700">
                  <strong>a. Provide Services:</strong> We use the collected
                  information to provide and improve the App, personalize your
                  experience, and fulfill your requests.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>b. Communication:</strong> We may use your contact
                  information to communicate with you about the App, updates,
                  promotions, or respond to your inquiries.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>c. Analytics:</strong> We may use aggregated and
                  anonymized data for analytics purposes to understand App usage
                  patterns and improve our services.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>d. Compliance:</strong> We may use your information to
                  comply with legal obligations, enforce our Terms and
                  Conditions, or protect our rights, property, or safety.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                3. Data Sharing
              </h2>
              <div className="ml-4">
                <p className="text-gray-700">
                  <strong>a. Third-Party Service Providers:</strong> We may
                  share your information with trusted third-party service
                  providers who assist us in operating, analyzing, and improving
                  the App. These providers are obligated to maintain the
                  confidentiality and security of your information.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>b. Legal Requirements:</strong> We may disclose your
                  information if required to comply with applicable laws,
                  regulations, legal processes, or government requests.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>c. Business Transfers:</strong> In the event of a
                  merger, acquisition, or sale of all or a portion of our
                  assets, your information may be transferred as part of the
                  transaction, subject to the acquirer's Privacy Policy.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                4. Data Security
              </h2>
              <div className="ml-4">
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures
                  to protect your information against unauthorized access,
                  alteration, disclosure, or destruction.
                </p>
                <p className="text-gray-700 mt-2">
                  Despite our efforts, no method of transmission over the
                  Internet or electronic storage is 100% secure. We cannot
                  guarantee absolute security.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                5. Children's Privacy
              </h2>
              <p className="text-gray-700">
                The App is intended for use by schools and educational
                institutions and is not directed towards individuals under the
                age of 13. We do not knowingly collect personal information from
                children under 13. If we become aware that we have collected
                personal information from a child under 13, we will take steps
                to delete it.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                6. Your Choices
              </h2>
              <div className="ml-4">
                <p className="text-gray-700">
                  <strong>a. Account Information:</strong> You may review,
                  update, or delete your account information by contacting us.
                  However, please note that certain information may be retained
                  as required by law or for legitimate business purposes.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>b. Communication Preferences:</strong> You may opt out
                  of receiving promotional emails from us by following the
                  instructions in the email or contacting us.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                7. International Data Transfers
              </h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in
                countries outside your jurisdiction. By using the App, you
                consent to the transfer and processing of your information in
                accordance with this Policy.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                8. Updates to this Policy
              </h2>
              <p className="text-gray-700">
                We may update this Policy from time to time. We will notify you
                of any significant changes by posting the updated Policy on our
                website or through other communication channels. Your continued
                use of the App after the changes will constitute your acceptance
                of the updated Policy.
              </p>
              <br />
              If you have any questions or concerns regarding this Privacy
              Policy, please contact us at support@aiteacha.com
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
