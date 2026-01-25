"use client"
import React from "react";

// -----------------------------
// PROPS TYPE
// -----------------------------
// SearchBar is a controlled input component.
// The parent owns the state (value) and passes
// updates back via the onChange callback.

type SearchBarProps = {
  value: string;                      // Current search value
  onChange: (value: string) => void;  // Callback to update search state
  placeholder?: string;               // Optional placeholder text
  className?: string;                 // Optional styles (layout overrides)
};

// -----------------------------
// SEARCH BAR COMPONENT
// -----------------------------
// This component is responsible ONLY for rendering
// the search input UI. It contains no filtering logic.

const SearchBar = ({
  value, 
  onChange, 
  placeholder = "Search...", 
  className ="",
}: SearchBarProps) => {

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        bg-black/20
        w-full max-w-md
        px-4 py-2 ml-10 mt-10
        rounded-md
        border border-gray-500
        text-white
        placeholder-gray-400
        ${className}
      `}
    />
  )
};

export default SearchBar;
