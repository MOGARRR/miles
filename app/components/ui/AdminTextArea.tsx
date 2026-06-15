type Props = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
};

const AdminTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 4,
}: Props) => {
  return (
    <div>
      <label className="block mb-1 text-sm text-kilotextlight">
        {label}
      </label>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="
          w-full
          rounded-lg
          border border-[#3a3a41]
          bg-kiloblack
          px-3 py-2
          text-sm
          min-h-[100px]
        "
      />
    </div>
  );
};

export default AdminTextarea;