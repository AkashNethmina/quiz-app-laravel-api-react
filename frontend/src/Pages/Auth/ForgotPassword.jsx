import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../lib/axios';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';

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
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Forgot Password</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
                Enter your email and we'll send you a password reset link.
            </p>

            {/* Success banner */}
            {status && (
                <div className="mb-4 bg-green-50 border border-green-200 text-sm text-green-700 rounded-lg p-3">
                    {status}
                </div>
            )}

            {/* General error */}
            {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg p-3">
                    {errors.general[0]}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                    />
                    <InputError message={errors.email?.[0]} className="mt-1" />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Sending...' : 'Email Password Reset Link'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-600">
                Remembered your password?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
