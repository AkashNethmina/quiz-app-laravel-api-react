import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate  = useNavigate();

    const [form, setForm]     = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                setErrors({ general: [err.response?.data?.message ?? 'Login failed. Please try again.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Sign Into Your Account</h2>

            {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg p-3">
                    {errors.general[0]}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-xs font-medium text-gray-500 uppercase mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {/* Simple text eye toggle, could be icon */}
                            <span className="text-xs font-medium">{showPassword ? 'Hide' : 'Show'}</span>
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-600">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Register
                </Link>
            </p>
        </div>
    );
}
