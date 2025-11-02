'use client';

import { useState, useEffect } from 'react';
import { hasAdminCredentials, setAdminCredentials, clearAdminCredentials } from '@/lib/hooks/useAdminApi';

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [adminUser, setAdminUser] = useState('admin');
  const [error, setError] = useState('');
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    setIsAuthenticated(hasAdminCredentials());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    try {
      setAdminCredentials(apiKey, adminUser);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Failed to save credentials');
    }
  };

  const handleLogout = () => {
    clearAdminCredentials();
    setIsAuthenticated(false);
    setApiKey('');
    setAdminUser('admin');
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0F1E] via-[#1a1f3a] to-[#0A0F1E] flex items-center justify-center p-4">
        <div className="bg-[#1a1f3a] border border-gray-700 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400 mb-6">Enter your admin API key to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                placeholder="Enter admin API key"
                required
              />
            </div>

            <div>
              <label htmlFor="adminUser" className="block text-sm font-medium text-gray-300 mb-2">
                Admin User
              </label>
              <input
                type="text"
                id="adminUser"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                placeholder="admin"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-[#00d9ff] text-[#0A0F1E] font-medium rounded-lg hover:bg-[#00b8db] transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-sm text-blue-300 mb-2">
              <strong>Setup Instructions:</strong>
            </p>
            <ol className="text-xs text-blue-400 space-y-1 list-decimal list-inside">
              <li>Set ADMIN_API_KEY in your .env.local file</li>
              <li>Enter that same key above to authenticate</li>
              <li>In production, use Neon Auth or OAuth instead</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleLogout}
        onMouseEnter={() => setShowLogout(true)}
        onMouseLeave={() => setShowLogout(false)}
        className="fixed top-6 right-6 z-50 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg"
        title="Logout"
      >
        {showLogout ? 'Logout' : '🚪'}
      </button>
      {children}
    </>
  );
}
