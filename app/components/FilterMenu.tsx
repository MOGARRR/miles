import React from 'react'
import { Category } from '@/src/types/category'
import { Check } from "lucide-react";

interface Props {
  categories: Category[],
  selectedCategories: number[],
  setSelectedCategories: Function
}

const FilterMenu: React.FC<Props> = ({ categories, selectedCategories, setSelectedCategories }) => {
  return (
     <section className={`filter lg:flex hidden mt-4`}>
              <div className="bg-kilodarkgrey p-5  border rounded-md">
                <div className="border-b-1 text-xl text-center mb-2">
                  <h1>Filter By:</h1>
                </div>

                <div
                  className={`grid grid-flow-col gap-3 ${
                    categories.length >= 12 ? "grid-rows-2" : "grid-rows-1"
                  }`}
                >
                  {categories.map((category) => {
                    const isChecked = selectedCategories.includes(category.id);
                    return (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 cursor-pointer select-none"
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
                            isChecked
                              ? "bg-kilored border-none"
                              : "border-gray-400"
                          }`}
                        >
                          {isChecked && <Check />}
                        </span>

                        <span>{category.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>
  )
}

export default FilterMenu