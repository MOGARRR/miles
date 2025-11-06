const PrivacyPage = () => {
  return (
    <div className="px-8 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl">
            Privacy Policy (UPDATE THIS LATER)
          </h1>
          <p className="text-sm opacity-70">
            Last updated: January 1, 2025
          </p>
        </header>

        {/* Section 1 */}
        <section>
          <h2 className="text-xl mb-2">1. Introduction</h2>
          <p className="text-sm leading-relaxed opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel
            risus ut lacus consequat efficitur. Curabitur pharetra, lorem sed
            varius fringilla, velit enim sagittis eros, at viverra turpis nulla
            sed est. Suspendisse potenti.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl mb-2">2. Information We Collect</h2>
          <p className="text-sm leading-relaxed opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            imperdiet, libero a gravida mattis, mi magna convallis justo, vel
            accumsan felis ex at est. Cras sit amet massa vel leo convallis
            convallis.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl mb-2">3. How We Use Your Information</h2>
          <p className="text-sm leading-relaxed opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            facilisi. Quisque et sem vel magna pulvinar luctus. Vestibulum ante
            ipsum primis in faucibus orci luctus et ultrices posuere cubilia
            curae; Suspendisse accumsan metus at sem pretium tincidunt.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl mb-2">4. Contact Us</h2>
          <p className="text-sm leading-relaxed opacity-90">
            If you have any questions about this Privacy Policy, you can contact us at:  
            <br />
            <span className="block mt-1">
              email@email.com
            </span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
