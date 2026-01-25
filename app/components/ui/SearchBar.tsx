"use client"
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";


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

    <div className={`flex items-center gap-2 max-w-md`}>

      {/* Magnifying glass icon */}
      <Search
        size={20}
        className="text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          flex-1
          bg-black/20
          px-4 py-2
          rounded-md
          border border-gray-500
          text-white
          placeholder-gray-400
          ${className}
        `}
      />
    </div>
    
  )
};

export default SearchBar;
