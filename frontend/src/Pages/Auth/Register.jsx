import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';


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
    setShow
}) {
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <div className="relative">
                <TextInput
                    id={id}
                    name={id}
                    type={inputType}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    required
                    className={`w-full ${isPassword ? 'pr-10' : ''}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <span className="text-xs font-medium">{show ? 'Hide' : 'Show'}</span>
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
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Create an Account
            </h2>

            {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg p-3">
                    {errors.general[0]}
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
                />

                <Field
                    id="email"
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email?.[0]}
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
                />

                <div className="pt-2">
                    <PrimaryButton type="submit" disabled={loading} className="w-full">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}