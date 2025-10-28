import React, { forwardRef } from 'react';

const Textarea = forwardRef(({ className, ...props }, ref) => {
    Textarea.displayName = 'Textarea';
    return (
        <textarea
        ref={ref}
        className={`w-full px-3 py-2 bg-surface border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y ${className || ''}`}
        {...props}
        />
    );
});

export default Textarea;