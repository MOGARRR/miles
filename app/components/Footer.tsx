import Image from "next/image";
import { Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer 
      className="
        footer  
        border-t border-gray-700
        bg-[#1c1c21] text-white
        px-8 py-4 rounded-none"
    >
      
      
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6 md:gap-12 text-center md:text-left">
        <div>
          <Image 
            src="/images/kiloboy-logo.jpg" 
            alt="KiloBoy logo" 
            width={80} 
            height={80} 
          />
        </div>
      

        <div className="text-center space-y-1">
          <h1 className="text-lg">© {new Date().getFullYear()} KILOBOY ARTWORK</h1>

          <Link
            href="/privacy"
            className="text-xs text-white hover:text-red-400 transition"
          >
            Privacy Policy & Terms & Conditions
          </Link>

        </div>

        <div className="text-center md:text-right space-y-1 ">
          <p> (111) 111-1111 </p>
          <p> email@email.com</p>

          <div className="flex justify-center md:justify-end mt-2">
            <a href="https://www.instagram.com/kiloboyartwork/" aria-label="Instagram">
            <Instagram 
              size={24}
              className="text-white hover:text-red-400 transition" />
            </a>
          </div>

        </div>

      </div>
      
    </footer>
  )
};

export default Footer;
