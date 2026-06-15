import { ReactNode } from "react";

type AdminFormProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const AdminForm = ({
  title,
  description,
  children,
}: AdminFormProps) => {
  return (
    <div
      className="
        max-w-[768px]
        mx-auto
        px-6 md:px-16 py-8
        mb-10
        rounded-lg
        border border-[#3a3a41]
        bg-kilodarkgrey
      "
    >
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl text-kilored mb-2">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-kilotextgrey">
            {description}
          </p>
        )}
      </div>

      {/* FORM CONTENT */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default AdminForm;