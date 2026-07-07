import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const innerRef = useRef(null);
    const inputRef = ref ?? innerRef;

    useEffect(() => {
        if (isFocused) {
            inputRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 shadow-sm transition-all duration-200 ' +
                className
            }
            ref={inputRef}
        />
    );
});