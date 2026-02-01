import clsx from "clsx";

type SubmitButtonProps = {
  children: React.ReactNode; // Button text or content
  variant?: "primary" | "secondary"; // Visual style of the button 
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  
};

const SubmitButton = ({
  children,
  variant = "primary",
  isLoading = false,
  loadingText,
  disabled = false,
  className,
  type = "submit",
  onClick,
  
}: SubmitButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={clsx(
        // base styles (match LinkButton)
        "text-center",
        "text-sm md:text-base font-semibold",
        "px-4 py-[9px] md:px-4 md:py-2",
        "mt-8",
        "cursor-pointer",
        "border border-[#3a3a41] rounded-lg",
        "transition-colors duration-200",
        "disabled:opacity-40 disabled:cursor-not-allowed",

        className,

        // variants
        variant === "primary" &&
          "bg-kilored text-white hover:bg-[#B53535]", //red button
        variant === "secondary" &&
          "bg-kiloblack text-white hover:bg-[#0f0f11]" //black button 
      )}
    >
      {isLoading ? loadingText ?? "Submitting…" : children}
    </button>
  );
};

export default SubmitButton;