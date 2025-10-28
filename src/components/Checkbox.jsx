import React from 'react';

const Checkbox = ({ 
    className = '',
    onChange,
    inputRef,
    ...props 
}) => {
    // Use native input with appearance-none, bg-background for unchecked, #61b9f4 for checked
    const checkboxClasses = `appearance-none relative h-4 w-4 rounded border-2 border-border bg-background checked:bg-[#406ae1] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim();

    return (
        <div className="inline-flex items-center">
            <input
                type="checkbox"
                ref={inputRef}
                onChange={onChange}
                className={checkboxClasses}
                {...props}
            />
        </div>
    );
}

export default Checkbox;