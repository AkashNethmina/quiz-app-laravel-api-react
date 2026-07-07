import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

function Field({
    id,
    label,
    type = 'text',
    autoComplete,
    isPassword,
    value,
    onChange,
    error,
    show,
    setShow,
    icon: IconComponent
}) {
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <div className="relative">
                {IconComponent && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <IconComponent className="w-4.5 h-4.5" />
                    </div>
                )}
                <TextInput
                    id={id}
                    name={id}
                    type={inputType}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    required
                    placeholder={
                        id === 'name' ? 'Jane Doe' : 
                        id === 'email' ? 'jane@example.com' : 
                        '••••••••'
                    }
                    className={`w-full ${IconComponent ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {show ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                )}
            </div>
            <InputError message={error} className="mt-1" />
        </div>
    );
}

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
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
            await register(
                form.name,
                form.email,
                form.password,
                form.password_confirmation
            );

            navigate('/verify-email');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                setErrors({
                    general: [
                        err.response?.data?.message ??
                        'Registration failed. Please try again.',
                    ],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Create an Account</h2>
            </div>

            {errors.general && (
                <div className="bg-rose-50 border border-rose-100 text-sm font-semibold text-rose-800 rounded-xl p-4 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errors.general[0]}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Field
                    id="name"
                    label="Full Name"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name?.[0]}
                    icon={User}
                />

                <Field
                    id="email"
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email?.[0]}
                    icon={Mail}
                />

                <Field
                    id="password"
                    label="Password"
                    isPassword
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password?.[0]}
                    show={showPassword}
                    setShow={setShowPassword}
                    icon={Lock}
                />

                <Field
                    id="password_confirmation"
                    label="Confirm Password"
                    isPassword
                    autoComplete="new-password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation?.[0]}
                    show={showConfirmPassword}
                    setShow={setShowConfirmPassword}
                    icon={Lock}
                />

                <div className="pt-2">
                    <PrimaryButton type="submit" disabled={loading} className="w-full py-3">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="text-sm text-center text-gray-500 font-semibold">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-500 transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}