import React from "react";
import Footer from "../components/footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mt-12">
          <h1 className="text-3xl font-bold text-[#489DBA] mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-600 mb-8 pb-4 border-b border-gray-200">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-3">
                Welcome to Qilingo, a personal project that offers AI-powered
                language learning through conversations. These Terms of Service
                govern your access to and use of the Qilingo website and its
                features.
              </p>
              <p className="text-gray-700">
                By accessing or using Qilingo, you agree to be bound by these
                Terms. If you disagree with any part of the Terms, you may not
                access or use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                2. Service Description
              </h2>
              <p className="text-gray-700 mb-3">
                Qilingo is a language learning platform that offers:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>AI-powered language conversations</li>
                <li>Translation services using Google Translate</li>
                <li>Text-to-speech functionality</li>
                <li>Vocabulary learning tools</li>
              </ul>
              <p className="text-gray-700">
                As Qilingo is a personal project, features may change, and the
                service is provided on an "as is" basis without warranties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                3. Accounts
              </h2>
              <p className="text-gray-700 mb-3">
                When you create an account, you must provide information that is
                accurate and complete. You are responsible for maintaining the
                security of your account and password.
              </p>
              <p className="text-gray-700">
                You agree not to share your account credentials with others. You
                must notify us immediately of any unauthorized access to your
                account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                4. User Content
              </h2>
              <p className="text-gray-700 mb-3">
                When using Qilingo, you may submit content such as text for
                translation or conversation. You retain ownership of this
                content, but grant us permission to use it to provide and
                improve our services.
              </p>
              <p className="text-gray-700">
                Please be aware that content submitted for translation or
                text-to-speech conversion may be processed using third-party
                services including Google APIs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                5. Acceptable Use
              </h2>
              <p className="text-gray-700 mb-3">
                You agree to use Qilingo only for lawful purposes and in
                accordance with these Terms. You agree not to use the service:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>In any way that violates applicable laws or regulations</li>
                <li>To harass, abuse, or harm others</li>
                <li>To distribute spam or malicious content</li>
                <li>
                  To attempt to interfere with the proper functioning of the
                  service
                </li>
                <li>
                  For any purpose that could damage the reputation of Qilingo or
                  its services
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                6. Third-Party Services
              </h2>
              <p className="text-gray-700 mb-3">
                Qilingo uses Google services including Google Translate and
                Text-to-Speech functionality. Your use of these features is
                subject to Google's terms of service and privacy policies.
              </p>
              <p className="text-gray-700">
                We are not responsible for the content, privacy practices, or
                policies of any third-party services integrated with Qilingo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                7. Disclaimer of Warranties
              </h2>
              <p className="text-gray-700">
                Qilingo is a personal project offered "as is" without warranties
                of any kind. We do not guarantee that the service will be
                error-free, secure, or available at all times. The accuracy of
                translations and language learning content cannot be guaranteed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-700">
                To the maximum extent permitted by law, we shall not be liable
                for any indirect, incidental, special, or consequential damages
                arising out of your use of or inability to use Qilingo,
                including but not limited to loss of data or inaccurate
                translations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                9. Changes to Terms
              </h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will
                provide notice of significant changes by posting the updated
                Terms on this page. Your continued use of Qilingo after changes
                are posted constitutes your acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                10. Contact
              </h2>
              <p className="text-gray-700 mb-3">
                If you have any questions about these Terms, please contact:
              </p>
              <p className="text-gray-700 font-medium">
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

export default Terms;
