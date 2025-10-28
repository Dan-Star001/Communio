import React, { forwardRef } from 'react';

const Switch = forwardRef(({ className, checked, onCheckedChange }, ref) => {
    return (
        <label className={`relative inline-flex items-center cursor-pointer ${className || ''}`}>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="sr-only"
            ref={ref}
        />
        <div
            className={`w-10 h-6 pt-0.5 rounded-full peer transition-colors duration-200 ${checked ? 'bg-black' : 'bg-muted'}`}
        >
            <div
            className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </div>
        </label>
    );
});
Switch.displayName = 'Switch';

export default Switch;