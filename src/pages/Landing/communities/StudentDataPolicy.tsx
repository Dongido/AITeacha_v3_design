import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const StudentDataPolicy = () => {
  return (
    <div>
      <Navbar />
      <section className="bg-gray-100 text-gray-800 py-24 ">
        <section className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden overlow-hidden">
          <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
          <section>
            <figcaption className="desc z-10 relative">
              <h1 className="text-6xl font-bold text-center my-2 text-header text-white">
                {" "}
                Student Data Policy
              </h1>
              <h2 className="text-xl text-gray-300 text-center">
                Last Updated: December 12, 2024
              </h2>
            </figcaption>
          </section>
        </section>

        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-primary mt-6 text-center mb-6"></h2>
          <p className="text-lg leading-relaxed mb-8">
            <span className="text-lg font-bold"> AI Teacha</span>, is committed
            to protecting the privacy and security of student data processed
            within its Learning Management System (LMS). This Student Data
            Policy complements our broader Privacy Policy and provides specific
            guidelines regarding the handling, use, and retention of student
            data in alignment with Nigerian and African data protection laws, as
            well as globally recognized standards.
          </p>

          <div className="p-6 md:p-10 space-y-6">
            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                1. Scope of the Policy
              </h2>
              <p>
                This policy applies to all personal information directly related
                to identifiable students that is processed as part of AI
                Teacha's educational services. Student data may include:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>
                  Data provided by educational institutions (e.g., enrollment
                  information).
                </li>
                <li>
                  Data collected or generated during the use of AI Teacha
                  services (e.g., performance metrics, interaction logs).
                </li>
              </ul>
              <p>
                This policy governs data collected from students in Nigeria,
                Africa, and other regions, ensuring compliance with laws such
                as:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Nigeria Data Protection Regulation (NDPR).</li>
                <li>
                  African Union Convention on Cybersecurity and Personal Data
                  Protection (Malabo Convention).
                </li>
                <li>Child Rights Act of Nigeria.</li>
                <li>Other global frameworks where applicable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                2. Ownership and Control
              </h2>
              <p>
                Student data is owned and controlled by the educational
                institution, which acts as the data controller, while AI Teacha
                operates as a data processor. This means AI Teacha processes
                student data strictly based on the instructions and
                authorizations provided by the institution.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                3. Use of Student Data
              </h2>
              <p>
                AI Teacha processes student data solely for authorized
                educational purposes, including:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Providing personalized learning experiences.</li>
                <li>Generating academic performance analytics.</li>
                <li>
                  Enhancing educational tools and content recommendations.
                </li>
                <li>
                  Supporting administrative functions such as attendance and
                  grading.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                4. Prohibited Uses
              </h2>
              <p>AI Teacha does not:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Use student data for targeted advertising.</li>
                <li>
                  Sell or disclose student data to third-party advertisers.
                </li>
                <li>
                  Build personal profiles unrelated to educational objectives.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                5. Data Security and Privacy Measures
              </h2>
              <p>
                AI Teacha employs robust security measures to safeguard student
                data, including:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>
                  Encryption of sensitive data during transmission and storage.
                </li>
                <li>
                  Access controls to limit data visibility to authorized
                  personnel only.
                </li>
                <li>
                  Regular security audits and assessments to identify and
                  mitigate risks.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                6. Data Sharing and Disclosure
              </h2>
              <p>
                Student data may only be shared under the following
                circumstances:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>
                  With authorized educators or administrators within the
                  institution.
                </li>
                <li>
                  With trusted service providers under contractual obligations
                  to protect data.
                </li>
                <li>As required by law or to comply with legal processes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                7. De-Identified Data Usage
              </h2>
              <p>
                AI Teacha may use de-identified data (data stripped of
                personally identifiable information) for:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Research and development of educational technologies.</li>
                <li>Improving AI algorithms and system functionality.</li>
                <li>
                  Demonstrating the effectiveness of AI Teacha's services.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                8. Data Retention Policy
              </h2>
              <p>
                AI Teacha retains student data only for as long as necessary to
                fulfill educational purposes. Retention policies include:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>
                  Automatic deletion or de-identification of inactive accounts
                  after a defined period.
                </li>
                <li>
                  Allowing educational institutions to submit requests for data
                  deletion at any time.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                9. Student and Parent Rights
              </h2>
              <p>Students and parents have the right to:</p>
              <ul className="list-disc list-inside mt-2">
                <li>
                  Access student data maintained by the institution via the LMS.
                </li>
                <li>Request corrections to inaccuracies in student data.</li>
                <li>
                  Request deletion of student data when it is no longer
                  required.
                </li>
              </ul>
              <p>
                Requests should be directed to the educational institution,
                which can facilitate actions with AI Teacha.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                10. Compliance and Transparency
              </h2>
              <p>
                AI Teacha complies with applicable student data protection laws,
                including NDPR and the Child Rights Act, and maintains a
                transparent approach to data practices by:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>
                  Clearly communicating data collection and use policies to
                  users.
                </li>
                <li>
                  Providing regular updates to institutions about changes in
                  policy or data practices.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                11. Amendments to the Policy
              </h2>
              <p>
                AI Teacha may update this policy to reflect changes in legal or
                operational requirements. Educational institutions will be
                notified of significant changes and provided the opportunity to
                review and accept these changes before they take effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2">
                12. Contact Information
              </h2>
              <p>
                For inquiries or concerns related to student data, please
                contact:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Email: support@aiteacha.com</li>
                <li>Phone: +234 70 89115000</li>
                <li>
                  Address: 65, Gbasemo Street, Aga Ikorodu, Lagos, Nigeria
                </li>
              </ul>
            </section>

            <footer className="text-center mt-8">
              <p className="text-sm font-semibold">
                Empowering Education Responsibly
              </p>
              <p>
                AI Teacha is committed to creating a secure and innovative
                learning environment that prioritizes the privacy and welfare of
                students. By using our services, educational institutions and
                users agree to the terms outlined in this policy.
              </p>
            </footer>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default StudentDataPolicy;
