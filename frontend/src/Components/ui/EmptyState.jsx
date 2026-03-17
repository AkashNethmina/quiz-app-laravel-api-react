export default function EmptyState({ message, actionLabel, onAction }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
                {message || "There is nothing to display here yet."}
            </p>
            
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
