import React, { useState, useEffect } from "react";
import Image from "next/image";
import arrowDropdown from "../../assets/icons/admin_icon/arrow_dropdown.svg";

const Dropdown = ({
  datas,
  label,
  placeholder,
  onSelect,
  value,
  idKey,
  nameKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");

  useEffect(() => {
    if (value && typeof value === "object" && value[idKey]) {
      setSelected(value);
    } else {
      setSelected(value || "");
    }
  }, [value, idKey]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (dataValue) => {
    setSelected(dataValue);
    setIsOpen(false);
    if (onSelect) {
      onSelect(dataValue);
    }
  };

  return (
    <div className="relative">
      {/* Label */}
      <label className="block mb-1">{label}</label>

      <div
        className="cursor-pointer border-[1px] border-[#D6D9E4] pr-4 pl-3 py-3 rounded-[8px] mt-1 bg-white text-[#9AA1B9] flex items-center justify-between"
        onClick={toggleDropdown}
      >
        <span className={`${selected ? 'text-black' : ''}`}>{selected[nameKey] || placeholder}</span>
        <Image src={arrowDropdown} alt="dropdown arrow" />
      </div>

      {isOpen && (
        <div
          className="absolute w-full bg-white border rounded-md shadow-md mt-1 z-10 max-h-[200px] overflow-y-auto"
          role="listbox"
        >
          {datas.map((data) => (
            <div
              key={data[idKey]}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleSelect(data)}
              role="data"
            >
              {data[nameKey]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
