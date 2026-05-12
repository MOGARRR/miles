const PrivacyPage = () => {
  return (
    <div
      className="
        flex flex-col 
        items-center 
        px-6 md:px-16 
        py-12 md:py-20 
        max-w-4xl 
        mx-auto 
        space-y-10
      "
    >
      <header className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
        <p className="text-sm md:text-base opacity-70">
          Effective Date: April 29, 2026
        </p>
      </header>

      <section className="space-y-3">
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          At KiloBoy Artwork, your privacy is important to us. This Privacy Policy
          explains how we collect, use, and protect your personal information
          when you visit our website or make a purchase.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Information We Collect</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          We may collect the following information when you use our website:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-base md:text-lg text-gray-200 leading-relaxed">
          <li>Name</li>
          <li>Email Address</li>
          <li>Shipping/Billing Address</li>
          <li>Phone Number</li>
          <li>
            Payment Information (processed securely through third-party payment
            providers)
          </li>
          <li>Order Details / Purchase History</li>
          <li>
            Any information submitted through contact or custom order forms
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          Your information may be used to:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-base md:text-lg text-gray-200 leading-relaxed">
          <li>Process and fulfill orders</li>
          <li>Respond to inquiries and custom commission requests</li>
          <li>Send order updates and customer support communications</li>
          <li>Improve website performance and user experience</li>
          <li>
            Send promotional emails/newsletters (only if you opt in)
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Payment Security</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          All payments are processed securely through third-party payment
          processors. We do not store or have direct access to your full payment
          details.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Sharing of Information</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          We do not sell, trade, or rent your personal information to third
          parties. Your information may be shared only with trusted service
          providers necessary to operate our business, such as payment
          processors, shipping carriers, or website hosting providers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Cookies &amp; Analytics</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          Our website may use cookies and analytics tools to improve browsing
          experience, track website traffic, and understand customer behavior.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Data Protection</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          We implement reasonable security measures to protect your personal
          information. However, no online transmission or storage system can be
          guaranteed 100% secure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Your Rights</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          You may request access to, correction of, or deletion of your personal
          information by contacting us at{" "}
          <a
            href="mailto:Kiloboyartwork@hotmail.com"
            className="text-kilored/90 font-medium"
          >
            Kiloboyartwork@hotmail.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Policy Updates</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          We reserve the right to update this Privacy Policy at any time.
          Changes will be posted on this page with an updated effective date.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          If you have any questions regarding this Privacy Policy, please contact
          us at:
          <br />
          <span className="mt-1 block">KiloBoy Artwork</span>
          <span className="mt-1 block text-kilored/90 font-medium">
            Kiloboyartwork@hotmail.com
          </span>
          <span className="mt-1 block text-kilored/90 font-medium">
            kiloboyartworkstudios.com
          </span>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;
