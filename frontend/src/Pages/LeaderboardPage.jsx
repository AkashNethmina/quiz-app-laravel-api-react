import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';
import useAuth from '../hooks/useAuth';
import LeaderboardTable from '../Components/leaderboard/LeaderboardTable';
import { Trophy, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('global');
    
    // Global Tab State
    const [globalEntries, setGlobalEntries] = useState([]);
    const [globalLoading, setGlobalLoading] = useState(true);
    const [globalPage, setGlobalPage] = useState(1);
    const [globalTotalPages, setGlobalTotalPages] = useState(1);

    // Quiz Tab State
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState('');
    const [quizEntries, setQuizEntries] = useState([]);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizPage, setQuizPage] = useState(1);
    const [quizTotalPages, setQuizTotalPages] = useState(1);

    // Fetch Global Leaderboard
    const fetchGlobalLeaderboard = useCallback(async (page = 1) => {
        try {
            setGlobalLoading(true);
            const response = await axios.get(`/api/leaderboard?page=${page}`);
            setGlobalEntries(response.data.data);
            setGlobalPage(response.data.meta.current_page);
            setGlobalTotalPages(response.data.meta.last_page);
        } catch (error) {
            console.error('Error fetching global leaderboard:', error);
        } finally {
            setGlobalLoading(false);
        }
    }, []);

    // Fetch Quizzes for Dropdown
    const fetchQuizzes = useCallback(async () => {
        try {
            const response = await axios.get('/api/quizzes');
            setQuizzes(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    }, []);

    // Fetch Quiz Leaderboard
    const fetchQuizLeaderboard = useCallback(async (quizId, page = 1) => {
        if (!quizId) return;
        try {
            setQuizLoading(true);
            const response = await axios.get(`/api/leaderboard/quiz/${quizId}?page=${page}`);
            setQuizEntries(response.data.data);
            setQuizPage(response.data.meta.current_page);
            setQuizTotalPages(response.data.meta.last_page);
        } catch (error) {
            console.error(`Error fetching leaderboard for quiz ${quizId}:`, error);
            setQuizEntries([]);
        } finally {
            setQuizLoading(false);
        }
    }, []);

    // Initial Load
    useEffect(() => {
        fetchGlobalLeaderboard();
        fetchQuizzes();
    }, [fetchGlobalLeaderboard, fetchQuizzes]);

    // Handle Quiz Selection Change
    useEffect(() => {
        if (activeTab === 'quiz' && selectedQuizId) {
            fetchQuizLeaderboard(selectedQuizId, 1);
        }
    }, [activeTab, selectedQuizId, fetchQuizLeaderboard]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Trophy className="w-6.5 h-6.5 text-yellow-500" />
                        Leaderboard
                    </h1>
                    <p className="text-gray-500 text-xs mt-1">See how you rank against other players globally or by quiz attempts.</p>
                </div>
                <div>
                    <Link
                        to="/quizzes"
                        className="inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-500 active:scale-[0.98] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200"
                    >
                        <BookOpen className="w-4 h-4" />
                        Play Quizzes
                    </Link>
                </div>
            </div>

            {/* Segment Tab Controls */}
            <div className="bg-slate-100/80 border border-slate-200/40 p-1 rounded-xl w-full sm:w-fit flex">
                <button
                    onClick={() => setActiveTab('global')}
                    className={`flex-1 sm:flex-initial text-center px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'global'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    Global Standings
                </button>
                <button
                    onClick={() => setActiveTab('quiz')}
                    className={`flex-1 sm:flex-initial text-center px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'quiz'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    Filtered By Quiz
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'global' ? (
                <div className="space-y-6">
                    <LeaderboardTable 
                        entries={globalEntries} 
                        type="global" 
                        isLoading={globalLoading} 
                        currentUserId={user?.id} 
                    />
                    
                    {/* Pagination */}
                    {globalTotalPages > 1 && (
                        <div className="flex items-center justify-between border border-gray-100 bg-white px-4 py-3.5 sm:px-6 rounded-2xl shadow-sm">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => fetchGlobalLeaderboard(globalPage - 1)}
                                    disabled={globalPage === 1}
                                    className="relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchGlobalLeaderboard(globalPage + 1)}
                                    disabled={globalPage === globalTotalPages}
                                    className="relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500">
                                        Page <span className="text-gray-900 font-bold">{globalPage}</span> of <span className="text-gray-900 font-bold">{globalTotalPages}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => fetchGlobalLeaderboard(globalPage - 1)}
                                        disabled={globalPage === 1}
                                        className="p-1.5 text-gray-500 border border-gray-100 hover:bg-slate-50 disabled:opacity-30 rounded-lg transition"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => fetchGlobalLeaderboard(globalPage + 1)}
                                        disabled={globalPage === globalTotalPages}
                                        className="p-1.5 text-gray-500 border border-gray-100 hover:bg-slate-50 disabled:opacity-30 rounded-lg transition"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Quiz Selector */}
                    <div className="max-w-xs space-y-1.5">
                        <label htmlFor="quiz" className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Select Quiz
                        </label>
                        <select
                            id="quiz"
                            name="quiz"
                            className="block w-full rounded-lg border border-gray-200 py-2.5 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition bg-white"
                            value={selectedQuizId}
                            onChange={(e) => setSelectedQuizId(e.target.value)}
                        >
                            <option value="" disabled>Select a quiz...</option>
                            {quizzes.map((quiz) => (
                                <option key={quiz.id} value={quiz.id}>
                                    {quiz.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedQuizId ? (
                        <div className="space-y-6">
                            <LeaderboardTable 
                                entries={quizEntries} 
                                type="quiz" 
                                isLoading={quizLoading} 
                                currentUserId={user?.id} 
                            />

                            {/* Pagination */}
                            {quizTotalPages > 1 && (
                                <div className="flex items-center justify-between border border-gray-100 bg-white px-4 py-3.5 sm:px-6 rounded-2xl shadow-sm">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        <button
                                            onClick={() => fetchQuizLeaderboard(selectedQuizId, quizPage - 1)}
                                            disabled={quizPage === 1}
                                            className="relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => fetchQuizLeaderboard(selectedQuizId, quizPage + 1)}
                                            disabled={quizPage === quizTotalPages}
                                            className="relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500">
                                                Page <span className="text-gray-900 font-bold">{quizPage}</span> of <span className="text-gray-900 font-bold">{quizTotalPages}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => fetchQuizLeaderboard(selectedQuizId, quizPage - 1)}
                                                disabled={quizPage === 1}
                                                className="p-1.5 text-gray-500 border border-gray-100 hover:bg-slate-50 disabled:opacity-30 rounded-lg transition"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => fetchQuizLeaderboard(selectedQuizId, quizPage + 1)}
                                                disabled={quizPage === quizTotalPages}
                                                className="p-1.5 text-gray-500 border border-gray-100 hover:bg-slate-50 disabled:opacity-30 rounded-lg transition"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto mt-6">
                            <Trophy className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                            <h3 className="text-sm font-semibold text-gray-900">No quiz selected</h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                                Select a quiz from the dropdown list above to view scores and participant ranks.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
