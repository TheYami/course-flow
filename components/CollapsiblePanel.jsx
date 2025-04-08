import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid"; // ใช้จาก v2


const CollapsiblePanel = ({ title, children }) => {
  console.log(`Rendering panel: ${title}`);
  const [isOpen, setIsOpen] = useState(true);

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <div className="w-full max-w-md mx-auto bg-white border-b-2 border-gray-200">
      <div
        className="flex items-center justify-between p-1 cursor-pointer"
        onClick={togglePanel}
      >
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </div>
      {isOpen && (
        <div className="border-t border-gray-200">
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

export default CollapsiblePanel;
