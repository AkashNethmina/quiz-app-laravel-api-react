import { useState, useEffect } from 'react';

export default function QuizTimer({ expiresAt, onExpire }) {
    const [remaining, setRemaining] = useState(0);

    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
        if (!expiresAt) return;

        const targetTime = new Date(expiresAt).getTime();

        const calculateRemaining = () => {
            const now = Date.now();
            const diff = Math.floor((targetTime - now) / 1000);
            return diff > 0 ? diff : 0;
        };

        let diff = calculateRemaining();
        setRemaining(diff);

        if (diff <= 0) {
            onExpireRef.current();
            return;
        }

        const intervalId = setInterval(() => {
            diff = calculateRemaining();
            setRemaining(diff);

            if (diff <= 0) {
                clearInterval(intervalId);
                onExpireRef.current();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [expiresAt]);

    // Format MM:SS
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Color logic
    let colorClass = 'text-green-600 bg-green-50';
    if (remaining <= 10) {
        colorClass = 'text-red-600 bg-red-50';
    } else if (remaining <= 30) {
        colorClass = 'text-amber-600 bg-amber-50';
    }

    return (
        <div className={`px-4 py-2 rounded-lg font-bold text-lg inline-flex items-center gap-2 ${colorClass}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {formattedTime}
        </div>
    );
}
