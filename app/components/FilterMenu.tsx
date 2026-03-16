import React from "react";
import { Category } from "@/src/types/category";
import { Check } from "lucide-react";

interface Props {
  categories: Category[];
  selectedCategories: number[];
  setSelectedCategories: Function;
}

const FilterMenu: React.FC<Props> = ({
  categories,
  selectedCategories,
  setSelectedCategories,
}) => {
  return (
    <section className=" " >

      <div className="
        bg-kiloblack
        border border-[#3a3a41]
        rounded-xl
        p-5
        shadow-md
        ">

        {/* HEADER */}
        <div className="
          text-sm text-kilotextlight mb-4">
          <p className="tracking-wide">Filter By Category</p>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-wrap gap-6">
        
          {categories.map((category) => {
            const isChecked = selectedCategories.includes(category.id);
            return (
              <label
                key={category.id}
                className="
                  flex items-center gap-2
                  cursor-pointer 
                  select-none
                  group
                  "
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    setSelectedCategories((prev: number[]) =>
                      prev.includes(category.id)
                        ? prev.filter((id) => id !== category.id)
                        : [...prev, category.id],
                    );
                  }}
                  // Hides default style and is only visible by screen readers
                  className="sr-only"
                />

                {/* Custom checkbox */}
                <span
                  className={`
                    w-5 h-5 
                    flex items-center justify-center 
                    border-2 rounded transition
                    border-gray-500 group-hover:border-kilored
                     ${
                    isChecked ? "bg-kilored border-none" : "border-gray-400"
                  }`}
                >
                  {isChecked && <Check size={14} className="text-white" />}
                </span>

                <span className={`
                  text-sm
                  transition
                  ${
                    isChecked
                      ? "text-white"
                      : "text-kilotextlight group-hover:text-white"
                  }
                `}
                >
                  {category.title}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FilterMenu;
