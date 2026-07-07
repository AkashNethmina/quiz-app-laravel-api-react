import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-600">QuizApp</h1>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
