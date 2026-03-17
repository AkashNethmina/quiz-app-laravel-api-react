import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../lib/axios';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';

export default function VerifyEmail() {
    const { user, logout }  = useAuth();
    const [searchParams]    = useSearchParams();
    const navigate          = useNavigate();

    const justVerified = searchParams.get('verified') === '1';

    const [status, setStatus]   = useState(justVerified ? 'Your email has been verified!' : null);
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        setErrors({});
        setStatus(null);
        setLoading(true);
        try {
            const { data } = await axios.post('/email/verification-notification');
            setStatus(data.status ?? 'A new verification link has been sent to your email.');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                setErrors({ general: [err.response?.data?.message ?? 'Failed to send the verification email.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Verify Your Email</h2>

            <p className="text-sm text-gray-500 text-center mb-6">
                Thanks for signing up! Before getting started, please verify your email address by clicking
                the link we just emailed to you.
                {user?.email && (
                    <span className="block mt-1 font-medium text-gray-700">{user.email}</span>
                )}
            </p>

            {/* Success */}
            {status && (
                <div className="mb-4 bg-green-50 border border-green-200 text-sm text-green-700 rounded-lg p-3 text-center">
                    {status}
                </div>
            )}

            {/* Error */}
            {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg p-3">
                    {errors.general[0]}
                </div>
            )}

            <div className="space-y-3">
                {/* If already verified, go to dashboard */}
                {justVerified ? (
                    <PrimaryButton
                        onClick={() => navigate('/dashboard')}
                        className="w-full justify-center"
                    >
                        Go to Dashboard
                    </PrimaryButton>
                ) : (
                    <PrimaryButton
                        onClick={handleResend}
                        disabled={loading}
                        className="w-full justify-center"
                    >
                        {loading ? 'Sending...' : 'Resend Verification Email'}
                    </PrimaryButton>
                )}

                <SecondaryButton
                    onClick={handleLogout}
                    className="w-full justify-center text-center"
                >
                    Sign Out
                </SecondaryButton>
            </div>
        </div>
    );
}
