import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../lib/axios';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
    const [searchParams]    = useSearchParams();
    const navigate          = useNavigate();

    const [form, setForm]     = useState({
        token:                 searchParams.get('token') ?? '',
        email:                 searchParams.get('email') ?? '',
        password:              '',
        password_confirmation: '',
    });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/reset-password', form);
            // On success, redirect to login with a status hint
            navigate('/login?reset=1');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                setErrors({ general: [err.response?.data?.message ?? 'Password reset failed. The link may have expired.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
                <p className="text-sm text-gray-500 font-medium mt-1.5">
                    Choose a new password for your account.
                </p>
            </div>

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
                    <InputLabel htmlFor="password" value="New Password" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Lock className="w-4.5 h-4.5" />
                        </div>
                        <TextInput
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
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

                {/* Confirm Password */}
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Lock className="w-4.5 h-4.5" />
                        </div>
                        <TextInput
                            id="password_confirmation"
                            name="password_confirmation"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full pl-10"
                        />
                    </div>
                    <InputError message={errors.password_confirmation?.[0]} className="mt-1" />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                        className="w-full py-3"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="text-sm text-center text-gray-500 font-semibold">
                <Link to="/login" className="text-primary-600 hover:text-primary-500 transition-colors">
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}
