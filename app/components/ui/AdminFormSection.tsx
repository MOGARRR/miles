import { ReactNode } from "react";

type AdminFormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const AdminFormSection = ({
  title,
  description,
  children,
}: AdminFormSectionProps) => {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-xl text-kilotext">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-kilotextgrey mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

export default AdminFormSection;