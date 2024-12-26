import React, { useState, useEffect } from "react";
import Image from "next/image";
import arrowDropdown from "../../assets/icons/admin_icon/arrow_dropdown.svg";

const Dropdown = ({ options, label, placeholder, onSelect, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (optionValue) => {
    setSelected(optionValue);
    setIsOpen(false);
    if (onSelect) {
      onSelect(optionValue);
    }
  };

  return (
    <div className="relative">
      {/* Label */}
      <label className="block mb-1">{label}</label>

      <div
        className="cursor-pointer border-[1px]  border-[#D6D9E4] pr-4 pl-3 py-3 rounded-[8px] mt-1 bg-white text-[#9AA1B9] flex items-center justify-between"
        onClick={toggleDropdown}
      >
        <span>{selected || placeholder}</span>
        {/* Caret icon */}
        <Image src={arrowDropdown} />
      </div>

      {isOpen && (
        <div
          className="absolute w-full bg-white border rounded-md shadow-md mt-1 z-10"
          role="listbox"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleSelect(option.value)}
              role="option"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
