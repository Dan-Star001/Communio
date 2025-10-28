import React from 'react'; // Importing React for component creation

const Input = ({
    className = '',
    type = 'text',
    ...props
}) => {
    const inputClasses = `flex w-full pt-5 pb-1.25 px-2.5 rounded-[10px] border border-input bg-background text-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 text-base peer peer-focus:border-transparent peer-not(:placeholder-shown):border-transparent ${className}`.trim();

    return (
        <input
            type={type}
            className={inputClasses}
            {...props}
        />
    );
};

export default Input;