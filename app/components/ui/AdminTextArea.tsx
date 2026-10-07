"use client";

import { useLayoutEffect, useRef } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
  showCount?: boolean;
};

const AdminTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 4,
  hint,
  showCount = false,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label className="block text-sm font-semibold text-kilotextlight">
          {label}
        </label>
        {showCount && (
          <span className="text-xs text-kilotextgrey tabular-nums">
            {value.length.toLocaleString()} characters
          </span>
        )}
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="
          w-full
          resize-y
          rounded-lg
          border border-[#3a3a41]
          bg-kiloblack
          px-3 py-3
          text-sm
          leading-relaxed
          text-kilotextlight
          outline-none
          focus:border-kilored/60
        "
      />

      {hint && (
        <p className="mt-1.5 text-xs text-kilotextgrey">{hint}</p>
      )}
    </div>
  );
};

export default AdminTextarea;
