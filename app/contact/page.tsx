import ContactForm from "../components/ContactForm";

const ContactPage = () => {


  return (
    <div>

      {/* HERO */}
      <div className=" bg-kilodarkgrey py-24 ">
        <div className="
          max-w-7xl mx-auto
          px-6 md:px-16 
          text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-kilored">
            Contact Us
          </h2>
          <p className="text-base md:text-lg text-gray-200 max-w-[800px] mx-auto mt-8">
              Have any questions? <br /> Reach out and we'll be sure to get back to you as soon as we can.
          </p>
        </div>
      </div>
  
        <ContactForm />
              
    </div>
  );
};

export default ContactPage;
