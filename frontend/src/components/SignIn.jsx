import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AmazonLogo from '../assets/logo-amazon.svg';
import toast from 'react-hot-toast';

const SignIn = () => {
  const [isSignin, setIsSignin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordView, setPasswordView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignin) {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        await register(name, email, password);
        toast.success('Account created!');
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 min-h-[80vh] bg-white">
      <Link to="/">
        <img src={AmazonLogo} alt="Amazon" className="h-10" />
      </Link>

      <div className="border border-gray-300 rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-medium mb-4">{isSignin ? 'Sign in' : 'Create account'}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isSignin && (
            <div>
              <label className="text-sm font-bold block mb-1">Your name</label>
              <input
                type="text"
                className="w-full border border-gray-400 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#febd69] focus:border-[#febd69]"
                placeholder="First and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isSignin}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-bold block mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-400 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#febd69] focus:border-[#febd69]"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold block mb-1">Password</label>
            <div className="relative">
              <input
                type={passwordView ? 'text' : 'password'}
                className="w-full border border-gray-400 rounded p-2 text-sm pr-10 focus:outline-none focus:ring-1 focus:ring-[#febd69] focus:border-[#febd69]"
                placeholder={isSignin ? 'Enter password' : 'At least 6 characters'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={() => setPasswordView(!passwordView)}
              >
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
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
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
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isSignin ? 'Sign in' : 'Create your Amazon account'}
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
              onClick={() => { setIsSignin(false); setError(''); }}
              className="w-full border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100 transition-colors"
            >
              Create your Amazon account
            </button>
          </>
        )}

        {!isSignin && (
          <p className="text-sm mt-4">
            Already have an account?{' '}
            <button
              onClick={() => { setIsSignin(true); setError(''); }}
              className="text-[#007185] hover:text-[#c45500] hover:underline"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignIn;