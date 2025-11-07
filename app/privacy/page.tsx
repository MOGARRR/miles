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
      {/* Page Header */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold">
          Privacy Policy
        </h1>
        <p className="text-sm md:text-base opacity-70">
          Last updated: January 1, 2025
        </p>
      </header>

      {/* Section 1 */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel
          risus ut lacus consequat efficitur. Curabitur pharetra, lorem sed
          varius fringilla, velit enim sagittis eros, at viverra turpis nulla
          sed est. Suspendisse potenti.
        </p>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
          imperdiet, libero a gravida mattis, mi magna convallis justo, vel
          accumsan felis ex at est. Cras sit amet massa vel leo convallis
          convallis.
        </p>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          facilisi. Quisque et sem vel magna pulvinar luctus. Vestibulum ante
          ipsum primis in faucibus orci luctus et ultrices posuere cubilia
          curae; Suspendisse accumsan metus at sem pretium tincidunt.
        </p>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">4. Contact Us</h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          If you have any questions about this Privacy Policy, you can contact us at:
          <br />
          <span className="block mt-1 text-[#E14747] font-medium">
            email@email.com
          </span>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;
