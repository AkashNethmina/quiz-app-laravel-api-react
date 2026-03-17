import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const passwordReset = searchParams.get('reset') === '1';

    const [form, setForm] = useState({ email: '', password: '' });
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

            {passwordReset && (
                <div className="mb-4 bg-green-50 border border-green-200 text-sm text-green-700 rounded-lg p-3 text-center">
                    Password reset successfully. Please sign in.
                </div>
            )}

            {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg p-3">
                    {errors.general[0]}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full"
                    />
                    <InputError message={errors.email?.[0]} className="mt-1" />
                </div>

                {/* Password */}
                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <div className="relative">
                        <TextInput
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full pr-10"
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
                    <InputError message={errors.password?.[0]} className="mt-1" />
                    <div className="mt-1 text-right">
                        <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-600">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                    Register
                </Link>
            </p>
        </div>
    );
}
