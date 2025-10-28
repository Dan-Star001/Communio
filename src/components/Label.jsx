import React from 'react'; // Importing React for component creation

const Label = ({
    className = '',
    children,
    floated = false, // Prop to control floated state
    ...props
}) => {

    // Build labelClasses with conditional styles
    const baseClasses = 'absolute left-2.5 text-base text-muted-foreground cursor-text transition-all duration-300 ease-in-out dark:text-dark-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
    const floatedClasses = floated ? 'top-0 text-sm font-medium text-primary -translate-y-0.5 dark:text-dark-primary' : 'top-1/2 -translate-y-1/2';
    const labelClasses = `${baseClasses} ${floatedClasses} ${className}`.trim();

    return (
        <label className={labelClasses} {...props}>
            {children}
        </label>
    );
};

export default Label;