import { useEffect } from 'react';

export default function Modal({ children, show = false, maxWidth = '2xl', closeable = true, onClose = () => {} }) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth] || 'sm:max-w-2xl';

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && show) {
                close();
            }
        };

        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [show, closeable, onClose]);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50 flex items-center justify-center min-h-screen">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
                onClick={close}
            />

            {/* Modal Box */}
            <div
                className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300 animate-slide-up w-full sm:mx-auto ${maxWidthClass}`}
            >
                {children}
            </div>
        </div>
    );
}
