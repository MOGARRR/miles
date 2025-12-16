
import ContactForm from "../components/ContactForm";
import Faq from "../components/Faq";

const ContactPage = () => {


  return (
    <div className="">
      <div className="">
        <h1 className="text-5xl m-12 ">Contact Us</h1>
        
        <h1 className="text-xl m-12 ">
          Have any questions? <br /> Reach out and we'll be sure to get back to you as soon as we can.
        </h1>

        <ContactForm />

      </div>

      <div className="m-12">
        <Faq />

      </div>
      
      
    </div>
  );
};

export default ContactPage;
