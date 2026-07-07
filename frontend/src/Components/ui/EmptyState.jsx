export default function EmptyState({ message, actionLabel, onAction }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5 text-primary-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
            </div>
            
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">No quizzes or data yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
                {message || "There is nothing to display here yet."}
            </p>
            
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 active:scale-[0.98] text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-primary-600/10 transition-all duration-200"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
