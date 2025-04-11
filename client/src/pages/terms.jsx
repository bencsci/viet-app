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
                Welcome to Qilingo. These Terms of Service govern your access to
                and use of the Qilingo website, mobile applications, and any
                other services provided by Qilingo.
              </p>
              <p className="text-gray-700">
                By accessing or using the Service, you agree to be bound by
                these Terms. If you disagree with any part of the Terms, you may
                not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                2. Accounts
              </h2>
              <p className="text-gray-700 mb-3">
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times. Failure to
                do so constitutes a breach of the Terms, which may result in
                immediate termination of your account on our Service.
              </p>
              <p className="text-gray-700 mb-3">
                You are responsible for safeguarding the password that you use
                to access the Service and for any activities or actions under
                your password.
              </p>
              <p className="text-gray-700">
                You agree not to disclose your password to any third party. You
                must notify us immediately upon becoming aware of any breach of
                security or unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                3. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-3">
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                Qilingo and its licensors. The Service is protected by
                copyright, trademark, and other laws of both the United States
                and foreign countries.
              </p>
              <p className="text-gray-700">
                Our trademarks and trade dress may not be used in connection
                with any product or service without the prior written consent of
                Qilingo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                4. User Content
              </h2>
              <p className="text-gray-700 mb-3">
                Our Service allows you to post, link, store, share and otherwise
                make available certain information, text, graphics, or other
                material ("Content"). You are responsible for the Content that
                you post on or through the Service, including its legality,
                reliability, and appropriateness.
              </p>
              <p className="text-gray-700 mb-3">
                By posting Content on or through the Service, you represent and
                warrant that:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>
                  The Content is yours and/or you have the right to use it and
                  the right to grant us the rights and license as provided in
                  these Terms.
                </li>
                <li>
                  The posting of your Content on or through the Service does not
                  violate the privacy rights, publicity rights, copyrights,
                  contract rights or any other rights of any person or entity.
                </li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to remove any Content from the Service at
                our discretion, without prior notice, for any reason whatsoever.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                5. Prohibited Uses
              </h2>
              <p className="text-gray-700 mb-3">
                You may use the Service only for lawful purposes and in
                accordance with these Terms. You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 space-y-2">
                <li>
                  In any way that violates any applicable national or
                  international law or regulation.
                </li>
                <li>
                  For the purpose of exploiting, harming, or attempting to
                  exploit or harm minors in any way.
                </li>
                <li>
                  To transmit, or procure the sending of, any advertising or
                  promotional material, including any "junk mail," "chain
                  letter," "spam," or any other similar solicitation.
                </li>
                <li>
                  To impersonate or attempt to impersonate Qilingo, a Qilingo
                  employee, another user, or any other person or entity.
                </li>
                <li>
                  In any way that infringes upon the rights of others, or in any
                  way is illegal, threatening, fraudulent, or harmful.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                6. Termination
              </h2>
              <p className="text-gray-700 mb-3">
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
              <p className="text-gray-700">
                Upon termination, your right to use the Service will immediately
                cease. If you wish to terminate your account, you may simply
                discontinue using the Service or contact us to request account
                deletion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700">
                In no event shall Qilingo, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                8. Disclaimer
              </h2>
              <p className="text-gray-700">
                Your use of the Service is at your sole risk. The Service is
                provided on an "AS IS" and "AS AVAILABLE" basis. The Service is
                provided without warranties of any kind, whether express or
                implied, including, but not limited to, implied warranties of
                merchantability, fitness for a particular purpose,
                non-infringement or course of performance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                9. Governing Law
              </h2>
              <p className="text-gray-700">
                These Terms shall be governed and construed in accordance with
                the laws of the United States, without regard to its conflict of
                law provisions. Our failure to enforce any right or provision of
                these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                10. Changes to Terms
              </h2>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. We will provide notice of any
                changes by posting the new Terms on this page. You are advised
                to review these Terms periodically for any changes. Changes to
                these Terms are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                11. Contact Us
              </h2>
              <p className="text-gray-700 mb-3">
                If you have any questions about these Terms, please contact us
                at:
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
