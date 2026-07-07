import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../lib/axios';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';

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
            const { data } = await axios.post('/reset-password', form);
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
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Reset Password</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
                Choose a new password for your account.
            </p>

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
                    <InputLabel htmlFor="password" value="New Password" />
                    <div className="relative">
                        <TextInput
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
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
                            <span className="text-xs font-medium">{showPassword ? 'Hide' : 'Show'}</span>
                        </button>
                    </div>
                    <InputError message={errors.password?.[0]} className="mt-1" />
                </div>

                {/* Confirm Password */}
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        name="password_confirmation"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required
                        className="w-full"
                    />
                    <InputError message={errors.password_confirmation?.[0]} className="mt-1" />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-600">
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}
