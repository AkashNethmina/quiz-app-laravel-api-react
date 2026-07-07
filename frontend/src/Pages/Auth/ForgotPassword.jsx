import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../lib/axios';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail]     = useState('');
    const [status, setStatus]   = useState(null);   // success message from API
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setStatus(null);
        setLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie');
            const { data } = await axios.post('/forgot-password', { email });
            setStatus(data.status);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                setErrors({ general: [err.response?.data?.message ?? 'Something went wrong. Please try again.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Forgot Password</h2>
                <p className="text-sm text-gray-500 font-medium mt-1.5">
                    Enter your email and we'll send you a password reset link.
                </p>
            </div>

            {/* Success banner */}
            {status && (
                <div className="bg-emerald-50 border border-emerald-100 text-sm font-semibold text-emerald-800 rounded-xl p-4 flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{status}</span>
                </div>
            )}

            {/* General error */}
            {errors.general && (
                <div className="bg-rose-50 border border-rose-100 text-sm font-semibold text-rose-800 rounded-xl p-4 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errors.general[0]}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full pl-10"
                        />
                    </div>
                    <InputError message={errors.email?.[0]} className="mt-1" />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                        className="w-full py-3"
                    >
                        {loading ? 'Sending link...' : 'Email Password Reset Link'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="text-sm text-center text-gray-500 font-semibold">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-500 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}
