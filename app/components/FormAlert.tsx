// Reusable form alert component for displaying success or error messages.

// Usage examples:
// <FormAlert type="success" message="Product created successfully!" />
// <FormAlert type="error" message="Something went wrong" />

type FormAlertProps = {
  type: "success" | "error";
  message: string;
};


const FormAlert = ({type, message}: FormAlertProps) => {

  // Guard: do not render anything if no message is provided
  if (!message) return null;

  const baseClasses = "text-sm mt-2";
  const colorClasses =
    type === "success"
      ? "text-green-600"
      : "text-red-600";

  return (
    <p className={`${baseClasses} ${colorClasses}`}>
      {message}
    </p>
  );
};


export default FormAlert;
