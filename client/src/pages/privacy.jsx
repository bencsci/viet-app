import React from "react";
import Footer from "../components/footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mt-12">
          <h1 className="text-3xl font-bold text-[#489DBA] mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8 pb-4 border-b border-gray-200">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Introduction
              </h2>
              <p className="text-gray-700 mb-3">
                Welcome to Qilingo. We respect your privacy and are committed to
                protecting your personal data. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when
                you use our language learning platform.
              </p>
              <p className="text-gray-700">
                Please read this Privacy Policy carefully. If you do not agree
                with the terms of this Privacy Policy, please do not access the
                application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Information We Collect
              </h2>
              <p className="text-gray-700 mb-3">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>Register for an account</li>
                <li>Set up your profile</li>
                <li>Use our interactive features</li>
                <li>Complete language assessments</li>
                <li>Communicate with us</li>
              </ul>
              <p className="text-gray-700">
                This information may include your name, email address, profile
                information, and language preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Google User Data
              </h2>
              <p className="text-gray-700 mb-3">
                If you choose to sign in using Google, we access certain Google
                account information, specifically:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>
                  Your profile information (name, email, profile picture) for
                  account creation and personalization
                </li>
                <li>
                  Your email address to communicate with you about your account
                  and services
                </li>
              </ul>
              <p className="text-gray-700 mb-3">
                <strong>Limited Use Disclosure:</strong> Qilingo's use and
                transfer to any other app of information received from Google
                APIs will adhere to the
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                  className="text-[#489DBA] hover:underline"
                >
                  {" "}
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <p className="text-gray-700 mb-3">
                We only use this information to:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>Provide our language learning services</li>
                <li>Maintain and improve our platform</li>
                <li>
                  Communicate with you about your account and our services
                </li>
                <li>Personalize your learning experience</li>
              </ul>
              <p className="text-gray-700">
                We do not sell your Google user data to third parties or use it
                for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Create and manage your account</li>
                <li>Process your requests and transactions</li>
                <li>Personalize your learning experience</li>
                <li>Communicate with you about our services</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Data Storage and Security
              </h2>
              <p className="text-gray-700 mb-3">
                We implement appropriate technical and organizational measures
                to protect your personal data against unauthorized or unlawful
                processing, accidental loss, destruction, or damage.
              </p>
              <p className="text-gray-700">
                We store your data on secure servers and use encryption to
                protect sensitive information transmitted online.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Data Retention
              </h2>
              <p className="text-gray-700">
                We will retain your personal information only for as long as is
                necessary to fulfill the purposes for which it was collected,
                including for the purposes of satisfying any legal, accounting,
                or reporting requirements. To determine the appropriate
                retention period, we consider the amount, nature, and
                sensitivity of the data, the potential risk of harm from
                unauthorized use or disclosure, and applicable legal
                requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Your Rights
              </h2>
              <p className="text-gray-700 mb-3">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate information</li>
                <li>The right to delete your information</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p className="text-gray-700">
                To exercise any of these rights, please contact us at
                privacy@qilingo.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date at the top. You
                are advised to review this Privacy Policy periodically for any
                changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="text-gray-700 font-medium mt-2">
                Email: benl275133@gmail.com
                <br />
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
