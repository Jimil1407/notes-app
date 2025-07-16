import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || 'Sign up failed');
      }
      alert('Sign up successful, please login');
      setMode('login');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleLogin = async () => {
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:3001/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || 'Login failed');
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Ripple effect for buttons
  function createRipple(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const target = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = target.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    target.appendChild(circle);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 flex flex-col items-center animate-fade-in">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <span className="text-4xl font-extrabold text-blue-600 tracking-tight select-none">Likho</span>
          <span className="text-lg font-semibold text-gray-500">(लिखो)</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900">Welcome</h1>
        {/* Mode Switch */}
        <div className="flex justify-center mb-8 gap-4 w-full">
          <button
            className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-200 text-lg relative overflow-hidden ${mode === 'signup' ? 'bg-blue-100 text-blue-900 shadow border-2 border-blue-400' : 'bg-white text-gray-500 border border-gray-200 hover:bg-blue-50'}`}
            onClick={e => { createRipple(e); setMode('signup'); }}
            type="button"
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-200 text-lg relative overflow-hidden ${mode === 'login' ? 'bg-blue-500 text-white shadow border-2 border-blue-500' : 'bg-white text-gray-500 border border-gray-200 hover:bg-blue-50'}`}
            onClick={e => { createRipple(e); setMode('login'); }}
            type="button"
          >
            Login
          </button>
        </div>
        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 w-full text-center bg-red-100 text-red-700 border border-red-300 rounded p-2 font-semibold animate-fade-in">
            {errorMsg}
          </div>
        )}
        {/* Form */}
        <form
          className="w-full flex flex-col gap-4 animate-fade-in"
          onSubmit={e => { e.preventDefault(); mode === 'signup' ? handleSignUp() : handleLogin(); }}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base focus:shadow-lg"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base focus:shadow-lg"
              required
            />
          </div>
          <button
            type="submit"
            onClick={createRipple}
            className={`w-full py-3 rounded-lg font-bold shadow transition text-lg mt-2 relative overflow-hidden
              ${mode === 'signup'
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-900 border-2 border-blue-400'
                : 'bg-blue-500 hover:bg-blue-400 text-white border-2 border-blue-500'}
            `}
          >
            {mode === 'signup' ? 'Sign Up' : 'Login'}
          </button>
        </form>
        {/* Switch Mode Link */}
        <div className="text-center mt-6 w-full">
          {mode === 'signup' ? (
            <>
              <span className="text-gray-500 text-base">Already have an account? </span>
              <button
                className="text-blue-500 hover:underline text-base bg-transparent border-none outline-none cursor-pointer font-semibold"
                onClick={e => { createRipple(e); setMode('login'); }}
                type="button"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-500 text-base">New user? </span>
              <button
                className="text-blue-500 hover:underline text-base bg-transparent border-none outline-none cursor-pointer font-semibold"
                onClick={e => { createRipple(e); setMode('signup'); }}
                type="button"
              >
                Sign up here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Add this to your global CSS for ripple effect:
// .ripple { position: absolute; border-radius: 50%; background: rgba(0,0,0,0.08); animation: ripple 0.5s linear; pointer-events: none; z-index: 10; }
// @keyframes ripple { to { opacity: 0; transform: scale(2); } }