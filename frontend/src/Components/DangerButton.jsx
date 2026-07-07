export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center px-4 py-2.5 bg-red-600 border border-transparent rounded-lg text-sm font-semibold text-white shadow-sm shadow-red-600/10 hover:bg-red-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none transition-all duration-200 ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
