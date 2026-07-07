export default function LoadingSkeleton({ rows = 3, type = 'table' }) {
    if (type === 'stat') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded-lg w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-100 rounded-lg w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'card') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse flex flex-col justify-between h-48">
                        <div>
                            <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded-lg w-full mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded-lg w-5/6"></div>
                        </div>
                        <div className="flex gap-2.5 mt-4">
                            <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Default: 'table'
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-50">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="p-6 flex items-center justify-between gap-4 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded-lg w-1/4"></div>
                        <div className="h-4 bg-gray-100 rounded-lg w-1/6"></div>
                        <div className="h-4 bg-gray-100 rounded-lg w-1/6"></div>
                        <div className="h-8 bg-gray-100 rounded-lg w-20"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
