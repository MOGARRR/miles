type AdminInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  step?: string;
  min?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

const AdminInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  error,
  maxLength,
  step,
  min,
  inputMode,
}: AdminInputProps) => {
  return (
    <div>
      <label className="block mb-1 font-semibold text-kilotextlight">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        step={step}
        min={min}
        inputMode={inputMode}
        className="
          w-full
          rounded-lg
          border border-[#3a3a41]
          bg-kiloblack
          px-3 py-2
          text-sm
          outline-none
          focus:border-kilored/60
        "
      />

      {error && (
        <p className="text-sm text-kilored mt-1">
          {error}
        </p>
      )}

      {maxLength && (
        <p className="text-xs text-kilotextgrey mt-1">
          Max {maxLength} characters
        </p>
      )}
    </div>
  );
};

export default AdminInput;