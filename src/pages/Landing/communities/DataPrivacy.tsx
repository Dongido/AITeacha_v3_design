import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const DataPrivacy = () => {
  return (
    <div>
      <div>
        <Navbar />
        <section className="bg-gray-100 text-gray-800 py-24 ">
          <section className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden overlow-hidden">
            <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
            <section>
              <figcaption className="desc z-10 relative px-2">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-6 text-header text-white">
                  {" "}
                  Data Privacy Addendum (DPA)
                </h1>
                <h2 className="text-xl text-gray-300 text-center">
                  Version: 1.0 | <br /> Effective Date: 01/07/2023 | <br />
                  Last Updated: 11/12/2024
                </h2>
              </figcaption>
            </section>
          </section>

          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-primary mt-6 text-center mb-6"></h2>
            <p className="text-lg leading-relaxed mb-8">
              <span className="text-lg font-bold">
                {" "}
                This Data Privacy Addendum (“DPA” or “Addendum”)
              </span>{" "}
              is an integral part of the agreement (“Agreement”) between AI
              Teacha, a subsidiary of ICEDT Consult Ltd, Nigeria, and the
              Educational Institution, School, District, or organization
              (“Institution”) identified in the Agreement. This DPA governs the
              processing of personal data through the AiTeacha Learning
              Management System (LMS) and ensures compliance with Nigerian,
              African, and global data protection laws.
            </p>
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-primary">
                1. Definitions
              </h2>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>
                  <strong>Data Protection Laws:</strong> Includes Nigeria Data
                  Protection Regulation (NDPR), African Union Convention on
                  Cybersecurity and Personal Data Protection (Malabo
                  Convention), General Data Protection Regulation (GDPR), Child
                  Rights Act (Nigeria), and other applicable laws concerning
                  data protection.
                </li>
                <li>
                  <strong>Personal Information:</strong> Any information that
                  identifies or can be used to identify a natural person,
                  including but not limited to names, contact details,
                  educational records, and other identifiers.
                </li>
                <li>
                  <strong>Processing:</strong> Any operation performed on
                  Personal Information, such as collection, recording, storage,
                  use, disclosure, or deletion.
                </li>
                <li>
                  <strong>Sub-processor:</strong> A third-party entity appointed
                  by AiTeacha to process Personal Information on its behalf.
                </li>
                <li>
                  <strong>Security Breach:</strong> Unauthorized access, use,
                  alteration, or disclosure of Personal Information.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                2. Scope of Processing
              </h2>
              <p className="text-gray-700">
                AiTeacha will process Personal Information only:
              </p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>To fulfill its obligations under the Agreement.</li>
                <li>As instructed by the Institution.</li>
                <li>In compliance with applicable Data Protection Laws.</li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                3. Roles and Responsibilities
              </h2>
              <p className="text-gray-700">
                <strong>a. Institution as Controller:</strong> The Institution
                retains ownership and control over Personal Information,
                determining the purpose and means of data processing.
              </p>
              <p className="text-gray-700">
                <strong>b. AiTeacha as Processor:</strong> AiTeacha processes
                Personal Information solely on behalf of the Institution and in
                accordance with its documented instructions.
              </p>

              <h2 className="text-xl font-semibold text-primary">
                4. Data Processing Requirements
              </h2>
              <p className="text-gray-700">AiTeacha will:</p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>
                  Ensure all personnel handling Personal Information are bound
                  by confidentiality obligations.
                </li>
                <li>
                  Assist the Institution in responding to data subject rights
                  requests (e.g., access, deletion, correction).
                </li>
                <li>
                  Notify the Institution promptly of any third-party complaints,
                  legal requests, or investigations concerning Personal
                  Information.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                5. Data Security Measures
              </h2>
              <p className="text-gray-700">
                AiTeacha will implement administrative, technical, and physical
                safeguards to protect Personal Information, including:
              </p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>Encryption of data during transit and at rest.</li>
                <li>
                  Access control mechanisms to limit data access to authorized
                  personnel.
                </li>
                <li>Regular vulnerability assessments and security audits.</li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                6. Security Breaches
              </h2>
              <p className="text-gray-700">
                In the event of a Security Breach, AiTeacha will:
              </p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>Notify the Institution without undue delay.</li>
                <li>
                  Provide a detailed report on the breach, including its nature,
                  affected data, and mitigation steps.
                </li>
                <li>
                  Cooperate with the Institution to meet its regulatory
                  obligations and mitigate risks.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                7. Sub-processors
              </h2>
              <p className="text-gray-700">
                AiTeacha may engage Sub-processors for specific data processing
                activities, subject to:
              </p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>Written approval from the Institution.</li>
                <li>
                  Ensuring Sub-processors meet the same data protection
                  standards outlined in this DPA.
                </li>
                <li>
                  Maintaining an updated list of Sub-processors and notifying
                  the Institution of changes 30 days in advance.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                8. Data Transfers
              </h2>
              <p className="text-gray-700">
                AiTeacha will not transfer Personal Information outside Nigeria
                or Africa without ensuring:
              </p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>Compliance with applicable data transfer regulations.</li>
                <li>
                  Implementation of adequate safeguards, such as Standard
                  Contractual Clauses or equivalent mechanisms.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                9. Data Retention and Deletion
              </h2>
              <p className="text-gray-700">AiTeacha will:</p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>
                  Retain Personal Information only as long as required to
                  fulfill the Agreement or comply with legal obligations.
                </li>
                <li>
                  Return or securely delete Personal Information upon request or
                  termination of the Agreement, except where retention is
                  mandated by law.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                10. Rights of Data Subjects
              </h2>
              <p className="text-gray-700">
                The Institution, as the data controller, is responsible for
                addressing data subject rights. AiTeacha will assist by:
              </p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>Providing mechanisms for data access and correction.</li>
                <li>
                  Supporting deletion requests as required under applicable
                  laws.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                11. Audits and Compliance
              </h2>
              <p className="text-gray-700">AiTeacha will:</p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>
                  Provide necessary documentation to demonstrate compliance with
                  this DPA.
                </li>
                <li>
                  Allow the Institution to conduct audits once per calendar
                  year, with reasonable notice.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">
                12. Changes to this Addendum
              </h2>
              <p className="text-gray-700">
                AiTeacha may update this DPA to reflect changes in regulations
                or processing practices. Institutions will be notified 30 days
                prior to any material changes.
              </p>

              <h2 className="text-xl font-semibold text-primary">
                13. Governing Law
              </h2>
              <p className="text-gray-700">
                This DPA is governed by the laws of the Federal Republic of
                Nigeria. Any disputes arising from this Addendum will be subject
                to the jurisdiction of Nigerian courts.
              </p>

              <h2 className="text-xl font-semibold text-primary">
                14. Contact Information
              </h2>
              <p className="text-gray-700">
                For questions or concerns regarding this DPA, please contact:
              </p>
              <ul className="list-inside list-disc text-gray-700 space-y-2">
                <li>
                  <strong>AiTeacha</strong>
                </li>
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@aiteacha.com"
                    className="text-blue-500"
                  >
                    support@aiteacha.com
                  </a>
                </li>
                <li>Phone: +234 70 89115000</li>
                <li>Address: 65 Gbasemo Street, Aga Ikorodu, Lagos, Nigeria</li>
              </ul>
            </section>

            <div className="mt-8 text-center">
              <p className="text-gray-700">*Acknowledgment*</p>
              <p className="text-gray-600">
                By entering into the Agreement, the Institution acknowledges and
                agrees to the terms of this DPA. Together, we ensure the safe,
                ethical, and compliant use of educational data.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DataPrivacy;
