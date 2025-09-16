
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center h-full w-full animate-fade-in">
      <div className="w-full max-w-sm p-8 space-y-8 bg-black/30 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-2xl shadow-black/50">
        <div className="text-center">
          <h1 className="text-5xl font-thin tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">
            AURA
          </h1>
          <p className="mt-2 text-gray-400">Your mindful assistant awaits.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              placeholder="Username"
              defaultValue="user@aura.ai"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              placeholder="Password"
              defaultValue="password"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-gray-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Authenticating...' : 'Enter Mindful Mode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
