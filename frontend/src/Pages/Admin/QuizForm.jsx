import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../../lib/axios';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';
import { ArrowLeft, AlertCircle } from 'lucide-react';

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
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <Link to="/admin/quizzes" className="text-xs font-semibold text-primary-600 hover:text-primary-500 mb-3 inline-flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Quizzes
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Quiz Settings' : 'Create New Quiz'}
                </h1>
                <p className="text-gray-500 text-xs mt-1">Configure your challenge attributes below.</p>
            </div>

            {/* Form container */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                {errors.general && (
                    <div className="mb-6 bg-rose-50 border border-rose-100 text-sm font-semibold text-rose-800 rounded-xl p-4 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{errors.general[0]}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <InputLabel htmlFor="title" value="Quiz Title" />
                        <TextInput
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. React hooks depth assessment"
                            className="w-full"
                        />
                        <InputError message={errors.title?.[0]} className="mt-1" />
                    </div>

                    {/* Description */}
                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe what core metrics this quiz evaluates..."
                            className="w-full rounded-xl border border-gray-200 py-3 px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition placeholder-gray-400 bg-white"
                        />
                        <InputError message={errors.description?.[0]} className="mt-1" />
                    </div>

                    {/* Time Limit */}
                    <div>
                        <InputLabel htmlFor="time_limit" value="Time Limit (Seconds)" />
                        <TextInput
                            type="number"
                            id="time_limit"
                            name="time_limit"
                            min="10"
                            value={form.time_limit}
                            onChange={handleChange}
                            required
                            className="w-full sm:w-1/3"
                        />
                        <p className="mt-1.5 text-[10px] font-semibold text-gray-400">Minimum limit: 10 seconds.</p>
                        <InputError message={errors.time_limit?.[0]} className="mt-1" />
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                        <SecondaryButton
                            type="button"
                            onClick={() => navigate('/admin/quizzes')}
                            className="px-5 py-2.5"
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Quiz Settings'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
