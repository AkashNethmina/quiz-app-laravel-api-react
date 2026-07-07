import { useState, useEffect } from 'react';
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
    const verifyUrl    = searchParams.get('verify_url');

    const [status, setStatus]   = useState(justVerified ? 'Your email has been verified!' : null);
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    // Auto-verify if verifyUrl is provided
    useEffect(() => {
        if (!verifyUrl) return;

        setLoading(true);
        axios.get(verifyUrl)
            .then(async () => {
                setStatus('Your email has been verified!');
                
                // Fetch user data again to update the email_verified_at field in AuthContext
                try {
                    const { data } = await axios.get('/api/user');
                    // We don't have a direct setter in AuthContext, but page reload will pick it up
                    // For a smoother UX, we just redirect to dashboard and let RequireVerified or App root reload it.
                } catch (e) {
                    console.error('Failed to reload user session', e);
                }

                setTimeout(() => {
                    // Force a hard reload to ensure AuthContext picks up the new user state
                    // Alternatively, we could just reload the window Location which naturally fetches user again
                    window.location.href = '/dashboard?verified=1';
                }, 2000);
            })
            .catch((err) => {
                setErrors({ general: [err.response?.data?.message ?? 'Failed to verify email. The link may have expired.'] });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [verifyUrl]);

    // Auto-redirect to dashboard a couple of seconds after email is verified
    useEffect(() => {
        if (!justVerified) return;
        const timer = setTimeout(() => navigate('/dashboard', { replace: true }), 2500);
        return () => clearTimeout(timer);
    }, [justVerified, navigate]);

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
                    {justVerified && (
                        <span className="block mt-1 text-green-500">Redirecting to dashboard…</span>
                    )}
                </div>
            )}

            {/* Error */}
            {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg p-3">
                    {errors.general[0]}
                </div>
            )}

            <div className="space-y-3">
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
