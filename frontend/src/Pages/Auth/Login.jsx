import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

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
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Sign in to your account</h2>
            </div>

            {passwordReset && (
                <div className="bg-emerald-50 border border-emerald-100 text-sm font-semibold text-emerald-800 rounded-xl p-4 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    Password reset successfully. Please sign in.
                </div>
            )}

            {errors.general && (
                <div className="bg-rose-50 border border-rose-100 text-sm font-semibold text-rose-800 rounded-xl p-4 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errors.general[0]}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Mail className="w-4.5 h-4.5" />
                        </div>
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full pl-10"
                        />
                    </div>
                    <InputError message={errors.email?.[0]} className="mt-1" />
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <InputLabel htmlFor="password" value="Password" className="mb-0" />
                        <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-500">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Lock className="w-4.5 h-4.5" />
                        </div>
                        <TextInput
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                    </div>
                    <InputError message={errors.password?.[0]} className="mt-1" />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                        className="w-full py-3"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="text-sm text-center text-gray-500 font-semibold">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-500 transition-colors">
                    Register
                </Link>
            </p>
        </div>
    );
}
