
const questions = [
  {q: "How long does a custom piece take?", answer:"Timelines vary depending on complexity, but most custom pieces are completed within 2-4 weeks after approval."},

  {q: "What's the pricing for custom work?", answer:"Pricing depends on the size, medium, and complexity of the artwork. We'll provide a detailed quote after reviewing your request."},

  {q: "Can I request revisions?", answer:"Pricing depends on the size, medium, and complexity of the artwork. We'll provide a detailed quote after reviewing your request."},

  {q: "SAMPLE QUESTION", answer:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus rutrum neque vel luctus."},

]

const Faq = () => {
  return (
    <section className="">

      <div className="
        max-w-[768px] mx-auto 
        px-6 md:px-16 py-16

        ">
         <h2 className="text-3xl mb-4 text-kilored text-center"> 
          FREQUENTLY ASKED QUESTIONS 
        </h2>
    
    
        {questions.map((question) => (
          <div className="
          bg-kilodarkgrey 
          rounded-lg border border-[#3a3a41]
          my-8 p-6">
          <h2 className="text-xl text-kilotextlight mb-2">
            {question.q}
          </h2>

          <p className="text-base text-kilotextgrey">{question.answer}</p>
          </div>
        ))}

      </div>
     

    </section>
  )
};

export default Faq;
