import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../lib/axios';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';
import { Mail, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

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
                    await axios.get('/api/user');
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
        <div className="space-y-6 text-center">
            {/* Verification Icon Header */}
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto text-primary-600 animate-pulse">
                {loading ? (
                    <Loader className="w-7 h-7 animate-spin" />
                ) : (
                    <Mail className="w-7 h-7" />
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
                <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">
                    Thanks for signing up! Before getting started, please verify your email address by clicking
                    the link we just emailed to you.
                    {user?.email && (
                        <span className="block mt-1 font-bold text-gray-800">{user.email}</span>
                    )}
                </p>
            </div>

            {/* Success */}
            {status && (
                <div className="bg-emerald-50 border border-emerald-100 text-sm font-semibold text-emerald-800 rounded-xl p-4 flex flex-col items-center gap-1.5 justify-center">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{status}</span>
                    </div>
                    {justVerified && (
                        <span className="text-xs text-emerald-600 animate-pulse">Redirecting to dashboard…</span>
                    )}
                </div>
            )}

            {/* Error */}
            {errors.general && (
                <div className="bg-rose-50 border border-rose-100 text-sm font-semibold text-rose-800 rounded-xl p-4 flex items-start gap-2 text-left">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errors.general[0]}</span>
                </div>
            )}

            <div className="space-y-3 pt-2">
                {justVerified ? (
                    <PrimaryButton
                        onClick={() => navigate('/dashboard')}
                        className="w-full justify-center py-3"
                    >
                        Go to Dashboard
                    </PrimaryButton>
                ) : (
                    <PrimaryButton
                        onClick={handleResend}
                        disabled={loading}
                        className="w-full justify-center py-3"
                    >
                        {loading ? 'Sending link...' : 'Resend Verification Email'}
                    </PrimaryButton>
                )}

                <SecondaryButton
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full justify-center py-3"
                >
                    Sign Out
                </SecondaryButton>
            </div>
        </div>
    );
}
