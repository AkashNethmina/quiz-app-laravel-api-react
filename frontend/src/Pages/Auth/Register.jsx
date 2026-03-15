import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate     = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.password_confirmation);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                setErrors({ general: [err.response?.data?.message ?? 'Registration failed. Please try again.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ id, label, type = 'text', autoComplete }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                autoComplete={autoComplete}
                value={form[id]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[id] && <p className="mt-1 text-xs text-red-600">{errors[id][0]}</p>}
        </div>
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h1>

                {errors.general && (
                    <p className="mb-4 text-sm text-red-600">{errors.general[0]}</p>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <Field id="name"                 label="Name"             autoComplete="name" />
                    <Field id="email"                label="Email"            type="email"    autoComplete="email" />
                    <Field id="password"             label="Password"         type="password" autoComplete="new-password" />
                    <Field id="password_confirmation" label="Confirm Password" type="password" autoComplete="new-password" />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg py-2 text-sm transition"
                    >
                        {loading ? 'Creating account…' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
