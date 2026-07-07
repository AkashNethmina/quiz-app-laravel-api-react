export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-primary-600/10 transition-all duration-200 ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
