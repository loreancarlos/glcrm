import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

interface ComboboxOption {
  id: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  allowClear = false,
  disabled = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // When value changes, update search term with selected option's label
    const selectedOption = options.find((opt) => opt.id === value);
    setSearchTerm(selectedOption?.label || "");
  }, [value, options]);

  const filteredOptions = options.filter((option) =>
    (option.label ? option.label.toLowerCase() : "").includes(
      searchTerm.toLowerCase()
    )
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    if (!e.target.value && allowClear) {
      onChange("");
    }
  };

  const handleOptionClick = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    const selectedOption = options.find((opt) => opt.id === optionId);
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 ${
                value === option.id
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-900"
              }`}
              onClick={() => handleOptionClick(option.id)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
