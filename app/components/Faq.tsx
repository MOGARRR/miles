const questions = [
  {
    id: 1,
    q: "Place a custom order",
    answer:
      "Submit your custom order inquiry with your idea, references, size preference, and desired timeline.",
  },

  {
    id: 2,
    q: "After submitting your inquiry",
    answer:
      "We'll discuss your vision, pricing, and project details.",
  },

  {
    id: 3,
    q: "Work begins",
    answer:
      "Once approved, work begins after payment confirmation.",
  },

  {
    id: 4,
    q: "Receive your custom piece",
    answer:
      "Your custom piece is created and shipped upon completion. Please note that custom orders may require additional production time depending on complexity and demand.",
  },

];

const Faq = () => {
  return (
    <section className="">
      <div
        className="
        max-w-[768px] mx-auto 
        px-6 md:px-16 py-16

        "
      >
        <h2 className="text-3xl mb-4 text-kilored text-center">
          HOW IT WORKS
        </h2>

        {questions.map((question) => (
          <div
            key={question.id}
            className="
          bg-kiloblack
          rounded-lg border border-[#3a3a41]
          my-8 p-6"
          >
            <h2 className="text-xl text-kilotextlight mb-2">{question.q}</h2>

            <p className="text-base text-kilotextgrey">{question.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
