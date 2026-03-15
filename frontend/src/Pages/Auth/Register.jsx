import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate     = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.password_confirmation);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                setErrors({ general: [err.response?.data?.message ?? 'Registration failed. Please try again.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ id, label, type = 'text', autoComplete, isPassword }) => {
        const [show, setShow] = isPassword === 'main' ? [showPassword, setShowPassword] : [showConfirmPassword, setShowConfirmPassword];
        const inputType = isPassword ? (show ? 'text' : 'password') : type;

        return (
            <div>
                <label htmlFor={id} className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    {label}
                </label>
                <div className="relative">
                    <input
                        id={id}
                        name={id}
                        type={inputType}
                        autoComplete={autoComplete}
                        value={form[id]}
                        onChange={handleChange}
                        required
                        className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isPassword ? 'pr-10' : ''}`}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <span className="text-xs font-medium">{show ? 'Hide' : 'Show'}</span>
                        </button>
                    )}
                </div>
                {errors[id] && <p className="mt-1 text-xs text-red-500">{errors[id][0]}</p>}
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Create an Account</h2>

            {errors.general && (
                 <div className="mb-4 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg p-3">
                    {errors.general[0]}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Field id="name" label="Full Name" autoComplete="name" />
                <Field id="email" label="Email Address" type="email" autoComplete="email" />
                <Field id="password" label="Password" isPassword="main" autoComplete="new-password" />
                <Field id="password_confirmation" label="Confirm Password" isPassword="confirm" autoComplete="new-password" />

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
