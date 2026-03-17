import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function AdminQuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Status Toggles
    const [togglingId, setTogglingId] = useState(null);

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, quizId: null, quizTitle: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/quizzes');
            setQuizzes(res.data.data || []);
        } catch (error) {
            console.error("Failed to load admin quizzes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handlePublishToggle = async (id, isCurrentlyPublished) => {
        setTogglingId(id);
        try {
            // Determine explicit endpoint structure if API handles publish mapping, assumed: patch /api/admin/quizzes/:id/publish
            await axios.patch(`/api/admin/quizzes/${id}/publish`, {
                is_published: !isCurrentlyPublished
            });
            
            // Re-fetch or update locally
            setQuizzes(prev => prev.map(q => q.id === id ? { ...q, is_published: !isCurrentlyPublished } : q));
        } catch (error) {
            console.error("Failed to toggle publish status", error);
            alert("Error updating publish status.");
        } finally {
            setTogglingId(null);
        }
    };

    const confirmDelete = (id, title) => {
        setDeleteModal({ isOpen: true, quizId: id, quizTitle: title });
    };

    const executeDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/admin/quizzes/${deleteModal.quizId}`);
            setQuizzes(prev => prev.filter(q => q.id !== deleteModal.quizId));
            setDeleteModal({ isOpen: false, quizId: null, quizTitle: '' });
        } catch (error) {
            console.error("Failed to delete quiz", error);
            alert("Error deleting quiz.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Quizzes</h1>
                    <p className="text-gray-500 text-sm mt-1">Create, edit, and publish quizzes across your platform</p>
                </div>
                <button
                    onClick={() => navigate('/admin/quizzes/create')}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-sm"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create Quiz
                </button>
            </div>

            {/* Content Display */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <LoadingSkeleton type="table" rows={6} />
                ) : quizzes.length === 0 ? (
                    <EmptyState 
                        message="No quizzes engineered yet. Get started by drafting one." 
                        actionLabel="Create Quiz" 
                        onAction={() => navigate('/admin/quizzes/create')}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Questions</th>
                                    <th className="px-6 py-4 text-center">Time Limit</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {quizzes.map(quiz => (
                                    <tr key={quiz.id} className="hover:bg-gray-50/50 transition duration-150">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{quiz.title}</div>
                                            {quiz.description && (
                                                <div className="text-sm text-gray-500 truncate max-w-[200px] mt-0.5">
                                                    {quiz.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {quiz.is_published ? (
                                                <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                                                {quiz.questions_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600 font-medium">
                                            {quiz.time_limit}s
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-3 flex-wrap">
                                                {/* Publish Toggle Button */}
                                                <button
                                                    onClick={() => handlePublishToggle(quiz.id, quiz.is_published)}
                                                    disabled={togglingId === quiz.id}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                                                        quiz.is_published 
                                                        ? 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50' 
                                                        : 'bg-primary-50 border-primary-100 text-primary-700 hover:bg-primary-100 disabled:opacity-50'
                                                    }`}
                                                >
                                                    {togglingId === quiz.id ? 'Wait...' : quiz.is_published ? 'Unpublish' : 'Publish'}
                                                </button>

                                                <button
                                                    onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}
                                                    className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50/50 hover:bg-primary-50 rounded-lg transition"
                                                >
                                                    Edit
                                                </button>
                                                
                                                <button
                                                    onClick={() => navigate(`/admin/quizzes/${quiz.id}/questions`)}
                                                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                                >
                                                    Questions
                                                </button>
                                                
                                                <button
                                                    onClick={() => confirmDelete(quiz.id, quiz.title)}
                                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete Quiz"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Danger Modal */}
            <ConfirmDialog 
                isOpen={deleteModal.isOpen}
                title="Delete Quiz"
                message={`Are you absolutely sure you want to delete "${deleteModal.quizTitle}"? This will permanently erase the quiz, all its questions, and every user attempt associated with it. This cannot be undone.`}
                onConfirm={executeDelete}
                onCancel={() => setDeleteModal({ isOpen: false, quizId: null, quizTitle: '' })}
                isLoading={isDeleting}
            />
        </div>
    );
}
