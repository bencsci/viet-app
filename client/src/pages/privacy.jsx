import React from "react";
import Footer from "../components/Footer";
const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mt-12">
          <h1 className="text-3xl font-bold text-[#489DBA] mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8 pb-4 border-b border-gray-200">
            Last Updated: 4/10/2025
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Introduction
              </h2>
              <p className="text-gray-700 mb-3">
                Welcome to Qilingo, a personal project designed to help users
                learn languages through AI-powered conversations. This Privacy
                Policy explains how your personal information is collected,
                used, and protected when you use our language learning platform.
              </p>
              <p className="text-gray-700">
                Please read this Privacy Policy carefully. If you do not agree
                with the terms of this Privacy Policy, please do not access or
                use the application.
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
                <li>Engage in language conversations with our AI</li>
                <li>Use translation features</li>
                <li>Use text-to-speech functionality</li>
                <li>Complete language assessments</li>
              </ul>
              <p className="text-gray-700">
                This information may include your name, email address, profile
                information, language preferences, and conversation history.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Google Services Integration
              </h2>
              <p className="text-gray-700 mb-3">
                Qilingo uses Google Translate API and Google Text-to-Speech
                services to provide translation and audio pronunciation
                features. When you use these features:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>
                  Text you submit for translation may be sent to Google's
                  servers
                </li>
                <li>
                  Text submitted for speech synthesis may be processed by
                  Google's Text-to-Speech service
                </li>
              </ul>
              <p className="text-gray-700 mb-3">
                <strong>Limited Use Disclosure:</strong> Qilingo's use and
                transfer of information received from Google APIs adheres to the
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                  className="text-[#489DBA] hover:underline"
                >
                  {" "}
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Google User Authentication
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
                </li>
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
                <li>Provide AI-powered language conversations</li>
                <li>Enable translation and text-to-speech services</li>
                <li>Create and manage your account</li>
                <li>Personalize your learning experience</li>
                <li>Improve our language learning features</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Data Storage and Security
              </h2>
              <p className="text-gray-700 mb-3">
                As Qilingo is a personal project/website, we implement
                reasonable security measures to protect your data. However,
                please be aware that no method of electronic storage or
                transmission over the internet is 100% secure.
              </p>
              <p className="text-gray-700">
                We use standard security protocols and mechanisms to protect
                your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Data Retention
              </h2>
              <p className="text-gray-700">
                We retain your personal information only for as long as
                necessary to provide you with the language learning services.
                You may request deletion of your account and associated data at
                any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Your Rights
              </h2>
              <p className="text-gray-700 mb-3">
                You have certain rights regarding your personal information,
                including:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate information</li>
                <li>The right to delete your information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p className="text-gray-700">
                To exercise any of these rights, please contact us at the email
                address below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the updated Privacy Policy
                on this page and updating the "Last Updated" date at the top.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please
                contact:
              </p>
              <p className="text-gray-700 font-medium mt-2">
                Email: qilingochat@gmail.com
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
