import { Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function AuthLayout() {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-linen overflow-hidden px-4">
            {/* Background Decorative Blob Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-200/25 blur-[120px] pointer-events-none" />
            
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

            <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10 animate-slide-up">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                            <img src={logo} alt="Questra" className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Questra</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Test your knowledge. Build your skills.</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
