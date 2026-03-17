import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';
import useAuth from '../hooks/useAuth';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';

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
            // Assuming response format
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
                    <p className="mt-2 text-sm text-gray-700">See how you rank against other players.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        to="/quizzes"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Browse Quizzes
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'global'
                                ? 'border-primary-500 text-primary-600 font-semibold'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Global
                    </button>
                    <button
                        onClick={() => setActiveTab('quiz')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'quiz'
                                ? 'border-primary-500 text-primary-600 font-semibold'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        By Quiz
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'global' ? (
                <div className="space-y-4">
                    <LeaderboardTable 
                        entries={globalEntries} 
                        type="global" 
                        isLoading={globalLoading} 
                        currentUserId={user?.id} 
                    />
                    
                    {/* Pagination */}
                    {globalTotalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => fetchGlobalLeaderboard(globalPage - 1)}
                                    disabled={globalPage === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchGlobalLeaderboard(globalPage + 1)}
                                    disabled={globalPage === globalTotalPages}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Page <span className="font-medium">{globalPage}</span> of <span className="font-medium">{globalTotalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => fetchGlobalLeaderboard(globalPage - 1)}
                                            disabled={globalPage === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => fetchGlobalLeaderboard(globalPage + 1)}
                                            disabled={globalPage === globalTotalPages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Quiz Selector */}
                    <div className="max-w-xs">
                        <label htmlFor="quiz" className="block text-sm font-medium text-gray-700">
                            Select Quiz
                        </label>
                        <select
                            id="quiz"
                            name="quiz"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
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
                        <div className="space-y-4">
                            <LeaderboardTable 
                                entries={quizEntries} 
                                type="quiz" 
                                isLoading={quizLoading} 
                                currentUserId={user?.id} 
                            />

                            {/* Pagination */}
                            {quizTotalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        <button
                                            onClick={() => fetchQuizLeaderboard(selectedQuizId, quizPage - 1)}
                                            disabled={quizPage === 1}
                                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => fetchQuizLeaderboard(selectedQuizId, quizPage + 1)}
                                            disabled={quizPage === quizTotalPages}
                                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Page <span className="font-medium">{quizPage}</span> of <span className="font-medium">{quizTotalPages}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                <button
                                                    onClick={() => fetchQuizLeaderboard(selectedQuizId, quizPage - 1)}
                                                    disabled={quizPage === 1}
                                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => fetchQuizLeaderboard(selectedQuizId, quizPage + 1)}
                                                    disabled={quizPage === quizTotalPages}
                                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No quiz selected</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Select a quiz from the dropdown above to view its leaderboard.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
