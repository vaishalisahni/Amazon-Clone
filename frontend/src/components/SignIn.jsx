import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AmazonLogo from '../assets/logo-amazon.svg';
import toast from 'react-hot-toast';

const FIELD_ERRORS = {
  nameEmpty: 'Please enter your full name.',
  nameShort: 'Name must be at least 2 characters.',
  emailEmpty: 'Please enter your email address.',
  emailInvalid: 'Please enter a valid email address.',
  passwordEmpty: 'Please enter a password.',
  passwordShort: 'Passwords must be at least 6 characters.',
  passwordWeak: 'Password must contain at least one number or special character.',
  confirmMismatch: "Passwords don't match. Please re-enter.",
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const SignIn = () => {
  const [isSignin, setIsSignin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordView, setPasswordView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const clearErrors = () => {
    setFieldErrors({});
    setServerError('');
  };

  const validateSignup = () => {
    const errors = {};
    if (!name.trim()) errors.name = FIELD_ERRORS.nameEmpty;
    else if (name.trim().length < 2) errors.name = FIELD_ERRORS.nameShort;

    if (!email.trim()) errors.email = FIELD_ERRORS.emailEmpty;
    else if (!validateEmail(email)) errors.email = FIELD_ERRORS.emailInvalid;

    if (!password) errors.password = FIELD_ERRORS.passwordEmpty;
    else if (password.length < 6) errors.password = FIELD_ERRORS.passwordShort;
    else if (!/[\d!@#$%^&*]/.test(password)) errors.password = FIELD_ERRORS.passwordWeak;

    if (password !== confirmPassword) errors.confirmPassword = FIELD_ERRORS.confirmMismatch;

    return errors;
  };

  const validateSignin = () => {
    const errors = {};
    if (!email.trim()) errors.email = FIELD_ERRORS.emailEmpty;
    else if (!validateEmail(email)) errors.email = FIELD_ERRORS.emailInvalid;
    if (!password) errors.password = FIELD_ERRORS.passwordEmpty;
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    const errors = isSignin ? validateSignin() : validateSignup();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      if (isSignin) {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        await register(name.trim(), email, password);
        toast.success('Account created! Welcome to Amazon.');
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || '';
      // Map server messages to user-friendly ones
      if (msg.includes('already exists')) {
        setFieldErrors({ email: 'An account with this email already exists. Try signing in.' });
      } else if (msg.includes('Invalid email or password')) {
        setServerError('The email or password you entered is incorrect. Please try again.');
      } else if (msg.toLowerCase().includes('password')) {
        setFieldErrors({ password: msg });
      } else {
        setServerError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (toSignin) => {
    setIsSignin(toSignin);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    clearErrors();
  };

  const FieldError = ({ field }) =>
    fieldErrors[field] ? (
      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <div className="flex flex-col items-center gap-4 p-6 min-h-[80vh] bg-white">
      <Link to="/">
        <img src={AmazonLogo} alt="Amazon" className="h-10" />
      </Link>

      <div className="border border-gray-300 rounded-lg p-6 w-full max-w-sm shadow-sm">
        <h1 className="text-2xl font-medium mb-4">{isSignin ? 'Sign in' : 'Create account'}</h1>

        {serverError && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-300 rounded p-3 flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          {!isSignin && (
            <div>
              <label className="text-sm font-bold block mb-1">Your name</label>
              <input
                type="text"
                className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 ${fieldErrors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-400 focus:ring-[#febd69] focus:border-[#febd69]'}`}
                placeholder="First and last name"
                value={name}
                onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: '' })); }}
                autoComplete="name"
              />
              <FieldError field="name" />
            </div>
          )}

          <div>
            <label className="text-sm font-bold block mb-1">Email</label>
            <input
              type="email"
              className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 ${fieldErrors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-400 focus:ring-[#febd69] focus:border-[#febd69]'}`}
              placeholder="Enter email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })); setServerError(''); }}
              autoComplete="email"
            />
            <FieldError field="email" />
          </div>

          <div>
            <label className="text-sm font-bold block mb-1">Password</label>
            <div className="relative">
              <input
                type={passwordView ? 'text' : 'password'}
                className={`w-full border rounded p-2 text-sm pr-10 focus:outline-none focus:ring-1 ${fieldErrors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-400 focus:ring-[#febd69] focus:border-[#febd69]'}`}
                placeholder={isSignin ? 'Enter password' : 'At least 6 characters'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })); }}
                autoComplete={isSignin ? 'current-password' : 'new-password'}
              />
              <button type="button" className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700" onClick={() => setPasswordView(!passwordView)}>
                {passwordView ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            <FieldError field="password" />
            {!isSignin && password && (
              <PasswordStrength password={password} />
            )}
          </div>

          {!isSignin && (
            <div>
              <label className="text-sm font-bold block mb-1">Re-enter password</label>
              <input
                type="password"
                className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 ${fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-400 focus:ring-[#febd69] focus:border-[#febd69]'}`}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(p => ({ ...p, confirmPassword: '' })); }}
                autoComplete="new-password"
              />
              <FieldError field="confirmPassword" />
            </div>
          )}

          {!isSignin && (
            <p className="text-xs text-gray-600">
              By creating an account, you agree to Amazon's{' '}
              <span className="text-[#007185] hover:text-[#c45500] cursor-pointer">Conditions of Use</span> and{' '}
              <span className="text-[#007185] hover:text-[#c45500] cursor-pointer">Privacy Notice</span>.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Please wait...
              </span>
            ) : isSignin ? 'Sign in' : 'Create your Amazon account'}
          </button>
        </form>

        {isSignin && (
          <>
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-3 text-xs text-gray-500">New to Amazon?</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>
            <button
              onClick={() => switchMode(false)}
              className="w-full border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100 transition-colors"
            >
              Create your Amazon account
            </button>
          </>
        )}

        {!isSignin && (
          <p className="text-sm mt-4">
            Already have an account?{' '}
            <button onClick={() => switchMode(true)} className="text-[#007185] hover:text-[#c45500] hover:underline font-medium">
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

function PasswordStrength({ password }) {
  const score = [
    password.length >= 6,
    password.length >= 10,
    /[A-Z]/.test(password),
    /[\d!@#$%^&*]/.test(password),
  ].filter(Boolean).length;

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const textColors = ['text-red-600', 'text-orange-500', 'text-yellow-600', 'text-green-600'];

  return (
    <div className="mt-1.5">
      <div className="flex gap-0.5 mb-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? colors[score - 1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs ${textColors[score - 1] || 'text-gray-400'}`}>
        Password strength: {labels[score - 1] || 'Very weak'}
      </p>
    </div>
  );
}

export default SignIn;