import { ReactNode } from "react";
import Button from "./Button";


type AdminFormProps = {
  title: string;
  description?: string;
  children: ReactNode;
  onClose?: () => void;
};

const AdminForm = ({
  title,
  description,
  children,
  onClose,
  
}: AdminFormProps) => {
  return (
    <div
      className="
        relative
        w-full
        min-w-[420px]
        max-w-[900px]
        mx-auto
        px-6 md:px-16 py-8
        mb-10
        rounded-lg
        border border-[#3a3a41]
        bg-kilodarkgrey
      "
    >

      {/* CLOSE BUTTON TOP RIGHT */}
        {onClose && (
          <div className="absolute top-0 right-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="mt-0"
            >
              X
            </Button>
          </div>
        )}
        
   
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