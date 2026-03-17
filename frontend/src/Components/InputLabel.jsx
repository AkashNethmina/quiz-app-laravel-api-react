export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block text-xs font-medium text-gray-500 uppercase mb-1 ${className}`}>
            {value ? value : children}
        </label>
    );
}
