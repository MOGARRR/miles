import Link from "next/link";
import clsx from "clsx";


type LinkButtonProps = {
  href: string; // Destination URL for the button
  children: React.ReactNode; // Button text or content
  variant?: "primary" | "secondary"; // Visual style of the button primary=red ; secondary = black
  className?: string;
};

const LinkButton = ({ href, children, variant = "primary", className }: LinkButtonProps) => {
  return (
    <Link
      href={href}
      //clsx = helper to combine classNames
      className={clsx(
        // base styles (apply to all buttons)
        "text-center",
        "text-sm md:text-base font-semibold",
        "px-4 py-[9px] md:px-4 md:py-3",
        "border border-[#3a3a41] rounded-lg ",
        "transition-colors duration-200",

        className,

        // variants
        variant === "primary" && "bg-kilored text-white hover:bg-[#B53535]",
        variant === "secondary" && "bg-kiloblack text-white hover:bg-[#0f0f11]", 

        
      )}
    >
      {children}
    </Link>
  );
};

export default LinkButton;