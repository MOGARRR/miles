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
    <section className={
      `
      filter
      flex mt-4
      `}>
      <div className="md:bg-kilodarkgrey p-5  md:border rounded-md">
        <div className="border-b-1 md:text-xl text-2xl text-center mb-2">
          <h1>Filter By Category:</h1>
        </div>

        <div
          className={`grid md:grid-flow-col grid-cols-3 gap-3${
            categories.length >= 12 ? "grid-rows-2" : "grid-rows-1"
          }`}
        >
          {categories.map((category) => {
            const isChecked = selectedCategories.includes(category.id);
            return (
              <label
                key={category.id}
                className="flex items-center gap-2 cursor-pointer select-none p-3"
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
                  className={`min-w-5 h-5 flex items-center justify-center border-2 rounded transition-colors ${
                    isChecked ? "bg-kilored border-none" : "border-gray-400"
                  }`}
                >
                  {isChecked && <Check />}
                </span>

                <span className="lg:text-md text-lg">{category.title}</span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FilterMenu;
