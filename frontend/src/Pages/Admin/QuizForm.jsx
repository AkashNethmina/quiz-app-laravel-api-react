import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../../lib/axios';

export default function AdminQuizForm() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        time_limit: 60,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingInit, setIsLoadingInit] = useState(isEditMode);

    useEffect(() => {
        if (!isEditMode) return;

        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`/api/admin/quizzes/${id}`);
                const data = res.data.data || res.data;
                setForm({
                    title: data.title || '',
                    description: data.description || '',
                    time_limit: data.time_limit || 60,
                });
            } catch (error) {
                console.error("Failed to load quiz for editing", error);
                alert("Could not load quiz.");
                navigate('/admin/quizzes');
            } finally {
                setIsLoadingInit(false);
            }
        };

        fetchQuiz();
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            if (isEditMode) {
                await axios.put(`/api/admin/quizzes/${id}`, form);
            } else {
                await axios.post('/api/admin/quizzes', form);
            }
            navigate('/admin/quizzes');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setErrors({ general: ['Failed to save quiz. Please try again.'] });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingInit) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-8">
                <Link to="/admin/quizzes" className="text-sm font-medium text-primary-600 hover:text-primary-800 mb-4 inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Quizzes
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">Configure your quiz settings below.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                {errors.general && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg p-4">
                        {errors.general[0]}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                            Quiz Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Advanced JavaScript Concepts"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title[0]}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Briefly describe what this quiz is about..."
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description[0]}</p>}
                    </div>

                    {/* Time Limit */}
                    <div>
                        <label htmlFor="time_limit" className="block text-sm font-semibold text-gray-700 mb-1">
                            Time Limit (Seconds) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="time_limit"
                            name="time_limit"
                            min="10"
                            value={form.time_limit}
                            onChange={handleChange}
                            required
                            className="w-full sm:w-1/3 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.time_limit && <p className="mt-1 text-xs text-red-500">{errors.time_limit[0]}</p>}
                        <p className="mt-2 text-xs text-gray-500">Minimum time limit is 10 seconds.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <Link
                            to="/admin/quizzes"
                            className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition shadow-sm"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
