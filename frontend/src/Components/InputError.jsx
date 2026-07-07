export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={'text-xs mt-1.5 font-semibold text-red-500 ' + className}>
            {message}
        </p>
    ) : null;
}
