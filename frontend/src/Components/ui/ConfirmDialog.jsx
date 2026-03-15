export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
                onClick={onCancel}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden transform transition-all">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500">{message}</p>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
