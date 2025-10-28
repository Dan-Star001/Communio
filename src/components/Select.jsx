import React, { useState, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ children, value, onValueChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

const SelectTrigger = forwardRef(({ children, className, onClick }, ref) => {
  return (
    <button
      ref={ref}
      className={`flex items-center justify-between w-full h-10 px-3 py-2 bg-surface border border-border rounded-md text-foreground text-sm ${className || ''}`}
      onClick={onClick}
    >
      {children}
      <ChevronDown className="h-4 w-4 ml-2" />
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder, className }) => {
  return (
    <span className={`truncate ${className || ''}`}>
      {placeholder}
    </span>
  );
};

const SelectContent = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`absolute z-10 mt-1 w-full bg-surface border border-border rounded-md shadow-lg ${isOpen ? 'block' : 'hidden'} ${className || ''}`}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onSelect: () => setIsOpen(false) })
        )}
      </div>
    </div>
  );
};

const SelectItem = ({ value, children, onSelect, className }) => {
  return (
    <div
      className={`px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer ${className || ''}`}
      onClick={() => {
        onSelect();
      }}
    >
      {children}
    </div>
  );
};


export default Select;
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };