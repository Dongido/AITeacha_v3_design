import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
const Privacy = () => {
  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Navbar />
      </section>
      <section className="relative bg-blight w-full h-[60vh] mt-24 pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden overlow-hidden">
        <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
        <section>
          <figcaption className="desc z-10 relative">
            <h1 className="text-6xl font-bold text-center my-2 text-header text-white">
              {" "}
              Privacy Policy
            </h1>
            <h2 className="text-lg text-gray-300 text-center">
              We guarantee your data privacy
            </h2>
          </figcaption>
        </section>
      </section>

      <div className="mt-16">
        <div className="rounded-t-3xl  max-w-4xl mx-auto px-8 py-8 ">
          We value your trust and are deeply committed to safeguarding the
          privacy and security of all personal information entrusted to us. Our
          platform is designed with a focus on transparency, safety, and
          compliance with regional and international data privacy laws relevant
          to Nigeria and Africa. This Privacy Policy outlines how we collect,
          use, and protect your information while ensuring adherence to the
          highest standards of privacy. <br />
          <br />
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                1. Compliance with Data Privacy Laws AI Teacha complies with
                applicable data privacy laws, including but not limited to:
              </h2>
              <div className="ml-4">
                The Nigeria Data Protection Regulation (NDPR) African Union
                Convention on Cyber Security and Personal Data Protection
                (Malabo Convention) General Data Protection Regulation (GDPR)
                for international standards Relevant local and regional privacy
                legislation where applicable. We implement rigorous technical,
                administrative, and physical safeguards to ensure the
                confidentiality, integrity, and availability of all personal
                information collected through our platform.
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              2. Information We Collect
            </h2>
            <div className="ml-4">
              We do not require users to submit personally identifiable
              information (PII) to use our platform. However, when provided
              voluntarily, the types of data we may collect include:
              <ul className="list-disc ml-6">
                <li>
                  Names, email addresses, or other contact details for account
                  creation and communication.
                </li>
                <li>
                  School or institutional information necessary for service
                  delivery.
                </li>
                <li>
                  Non-identifiable data such as user activity for analytics
                  purposes.
                </li>
              </ul>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              3. How We Use Your Information
            </h2>
            <div className="ml-4">
              The data we collect is used solely to:
              <ul className="list-disc ml-6">
                <li>Provide and improve our AI-powered tools and services.</li>
                <li>
                  Enhance user experience by personalizing content and
                  recommendations.
                </li>
                <li>
                  Ensure compliance with legal and regulatory requirements.
                </li>
                <li>
                  Communicate updates, features, and educational opportunities.
                </li>
              </ul>
              <p>
                We strictly prohibit the sale of any personal information to
                third parties.
              </p>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              4. Data Privacy and Management
            </h2>
            <div className="ml-4">
              AI Teacha prioritizes privacy and ensures that:
              <ul className="list-disc ml-6">
                <li>
                  The platform is designed to minimize the collection of PII and
                  discourage the submission of sensitive data.
                </li>
                <li>
                  Any inadvertently submitted PII is promptly identified,
                  securely deleted, and treated as a privacy breach.
                </li>
                <li>
                  Data is encrypted during transmission and at rest to protect
                  against unauthorized access.
                </li>
                <li>
                  A dedicated team monitors data management practices to uphold
                  strict privacy standards.
                </li>
              </ul>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              5. Safeguards for Responsible AI Usage
            </h2>
            <div className="ml-4">
              AI Teacha incorporates robust safeguards to promote responsible
              use of AI in education, including:
              <ul className="list-disc ml-6">
                <li>
                  Built-in alerts to caution against sharing sensitive or
                  personal information.
                </li>
                <li>
                  Notifications highlighting the importance of factual accuracy
                  and reducing potential bias in content.
                </li>
                <li>
                  Tools to support educators in using AI safely, securely, and
                  effectively.
                </li>
              </ul>
              <p>
                Our user-friendly interface is designed to prioritize safety,
                security, and reliability in every interaction.
              </p>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              6. Data Sharing and Disclosure
            </h2>
            <div className="ml-4">
              AI Teacha only shares data under the following circumstances:
              <ul className="list-disc ml-6">
                <li>With explicit user consent.</li>
                <li>
                  To comply with legal obligations or respond to lawful
                  requests.
                </li>
                <li>
                  With trusted service providers who process data on our behalf,
                  subject to strict confidentiality agreements.
                </li>
              </ul>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              7. Your Rights
            </h2>
            <div className="ml-4">
              As a user, you have the following rights regarding your data:
              <ul className="list-disc ml-6">
                <li>
                  The right to access, correct, or delete your personal
                  information.
                </li>
                <li>
                  The right to object to the processing of your data or withdraw
                  consent.
                </li>
                <li>
                  The right to lodge a complaint with a data protection
                  authority if you believe your privacy rights have been
                  violated.
                </li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at [Insert
                Contact Email].
              </p>
            </div>
            <h2 className="text-lg font-semibold  text-gray-900">
              8. Protecting Student Privacy
            </h2>
            <div className="ml-4">
              AI Teacha is designed to protect student privacy by:
              <ul className="list-disc ml-6">
                <li>
                  Prohibiting the collection of student PII unless explicitly
                  authorized.
                </li>
                <li>
                  Encouraging educators to use anonymized or generic data when
                  interacting with AI tools.
                </li>
                <li>
                  Complying with data protection laws that safeguard children
                  and student information.
                </li>
              </ul>
            </div>
            <h2 className="text-lg font-semibold  text-gray-900">
              9. Updates to the Privacy Policy
            </h2>
            <div className="ml-4">
              <p>
                We may update this Privacy Policy periodically to reflect
                changes in laws, regulations, or our practices. Users will be
                notified of significant updates through email or in-app
                notifications. Continued use of our platform after updates
                indicates acceptance of the revised policy.
              </p>
            </div>
            <h2 className="text-lg font-semibold  text-gray-900">
              10. Contact Us
            </h2>
            <div className="ml-4">
              <p>
                If you have any questions, concerns, or suggestions regarding
                this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc ml-6">
                <li>Email: [Insert Email Address]</li>
                <li>Phone: [Insert Phone Number]</li>
                <li>Address: [Insert Address]</li>
              </ul>
              <p>
                Your privacy is our priority, and we are committed to creating a
                secure, trusted platform for educators and institutions across
                Nigeria and Africa.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
