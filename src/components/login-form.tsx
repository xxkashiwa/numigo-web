import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login({ username, password });
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold">用户登录</h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="username" className="mb-1 block text-sm font-medium">
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            密码
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}
