import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import logo from '../assets/logo.png';
import { 
    ArrowRight, 
    Trophy, 
    BookOpen, 
    Sparkles, 
    CheckCircle2, 
    Play, 
    ShieldAlert 
} from 'lucide-react';

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-linen flex flex-col antialiased">
            {/* Top Navigation Bar (Dark Pine) */}
            <header className="sticky top-0 z-40 w-full border-b border-[#003b17] bg-[#002b11]/90 backdrop-blur-md text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                <img src={logo} alt="Questra" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">Questra</span>
                        </div>

                        {/* Navigation Right */}
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <Link 
                                    to="/dashboard" 
                                    className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#00eb5b] hover:bg-[#00ca4e] active:scale-[0.98] text-[#002b11] rounded-lg text-sm font-bold shadow-sm transition-all duration-200"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="text-sm font-bold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="inline-flex items-center justify-center bg-[#00eb5b] hover:bg-[#00ca4e] active:scale-[0.98] text-[#002b11] px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all duration-200"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Dark Pine Hero Section */}
            <div className="bg-gradient-to-b from-[#002b11] to-[#001c0a] text-white py-16 sm:py-24 border-b border-[#003b17] relative overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#00eb5b]/10 blur-[130px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-15%] w-[50%] h-[55%] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#003117_1px,transparent_1px),linear-gradient(to_bottom,#003117_1px,transparent_1px)] bg-[size:24px_36px] opacity-25 pointer-events-none" />

                <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl animate-slide-up">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#003b17] border border-[#005420] text-xs font-semibold text-[#00eb5b] mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Next-Gen Learning Experience
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                            Challenge Your Knowledge with <span className="text-[#00eb5b]">Questra.</span>
                        </h1>
                        <p className="text-base sm:text-lg text-emerald-100/75 leading-relaxed font-semibold">
                            Challenge yourself, track your personal progress in real-time, climb the global ranking leaderboard, and refine your technical engineering skills with our modern quiz application.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            {isAuthenticated ? (
                                <Link 
                                    to="/quizzes" 
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00eb5b] hover:bg-[#00ca4e] active:scale-[0.98] text-[#002b11] rounded-xl text-base font-bold shadow-md transition-all duration-200"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Browse & Play Quizzes
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        to="/register" 
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00eb5b] hover:bg-[#00ca4e] active:scale-[0.98] text-[#002b11] rounded-xl text-base font-bold shadow-md transition-all duration-200"
                                    >
                                        Get Started for Free
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link 
                                        to="/login" 
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#003b17] border border-[#005420] hover:bg-[#00471b] active:scale-[0.98] text-white rounded-xl text-base font-bold transition-all duration-200"
                                    >
                                        Sign In to Play
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Hero Interactive UI Card Mockup */}
                    <div className="flex-1 w-full max-w-md lg:max-w-none animate-fade-in text-gray-900">
                        <div className="relative bg-white rounded-3xl border border-gray-100/80 shadow-2xl p-6 sm:p-8 flex flex-col justify-between aspect-[4/3] max-w-lg mx-auto">
                            {/* Upper Details */}
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interactive Preview</span>
                                    <div className="h-6 w-14 bg-emerald-50 rounded-full flex items-center justify-center text-xs font-semibold text-emerald-600 border border-emerald-100/60">
                                        Active
                                    </div>
                                </div>
                                
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-snug">
                                    Which of the following is correct about <span className="text-[#00aa6c]">typeof null</span> in JavaScript?
                                </h3>

                                {/* Demo Option Cards */}
                                <div className="space-y-2.5">
                                    <div className="p-3.5 rounded-xl border border-[#00eb5b]/30 bg-[#e8fdf0] flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-2 border-[#00eb5b] flex items-center justify-center shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#00eb5b]"></div>
                                        </div>
                                        <span className="text-sm font-bold text-[#002b11]">It returns &quot;object&quot;</span>
                                    </div>
                                    <div className="p-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition flex items-center gap-3 cursor-pointer">
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0"></div>
                                        <span className="text-sm font-semibold text-gray-600">It returns &quot;null&quot;</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lower Action buttons */}
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50 text-xs">
                                <span className="font-semibold text-gray-400">Question 3 of 10</span>
                                <div className="px-3.5 py-2 bg-[#002b11] text-white rounded-lg font-bold flex items-center gap-1 pointer-events-none">
                                    Next
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Feature Cards Grid Section (White background content area) */}
            <section className="bg-white py-16 sm:py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Features engineered for learning</h2>
                        <p className="text-gray-500 font-medium text-sm mt-2">Enjoy a fast, smooth, responsive learning environment built with React.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<BookOpen className="w-6 h-6 text-primary-600" />}
                            title="Diverse Quizzes"
                            description="Take challenges on programming concepts, framework design, and general topics created by expert administrators."
                        />
                        <FeatureCard 
                            icon={<Trophy className="w-6 h-6 text-primary-600" />}
                            title="Global Leaderboards"
                            description="Climb the global and quiz-specific player rankings by resolving questions accurately and setting fastest scores."
                        />
                        <FeatureCard 
                            icon={<CheckCircle2 className="w-6 h-6 text-[#00aa6c]" />}
                            title="Instant Results"
                            description="Receive granular score reports and correct-choice summaries the exact second you click the submit button."
                        />
                    </div>
                </div>
            </section>

            {/* Footer (Dark Pine) */}
            <footer className="bg-[#002b11] border-t border-[#003b17] py-8 text-center text-xs text-gray-400 font-medium mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-300">&copy; {new Date().getFullYear()} Questra. All rights reserved.</p>
                    <div className="flex gap-4 text-gray-400">
                        <span className="hover:text-white transition cursor-pointer">Terms</span>
                        <span className="hover:text-white transition cursor-pointer">Privacy</span>
                        <span className="hover:text-white transition cursor-pointer">API Integration</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-6 rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-600/[0.02] transition-all duration-300 bg-white">
            <div className="w-12 h-12 rounded-xl bg-[#faf1ed] flex items-center justify-center mb-5">
                {icon}
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
        </div>
    );
}
