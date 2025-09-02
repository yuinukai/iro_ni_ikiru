'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // トークンをローカルストレージに保存
        localStorage.setItem('adminToken', data.token);
        router.push('/admin');
      } else {
        setError(data.error || 'ログインに失敗しました');
      }
    } catch (error) {
      setError('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 bg-white text-black flex items-center justify-center">
        <motion.div
          className="w-full max-w-md p-8 bg-gray-50 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Lock size={24} />
            </motion.div>
            <h1 className="text-2xl font-bold press-start-2p-regular mb-2">
              管理者ログイン
            </h1>
            <p className="text-gray-600 press-start-2p-regular text-sm">
              パスワードを入力してください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-bold mb-2 press-start-2p-regular"
              >
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                placeholder="パスワードを入力"
                required
              />
            </div>

            {error && (
              <motion.div
                className="text-red-500 text-sm press-start-2p-regular text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg hover:bg-gray-800 transition-colors press-start-2p-button text-sm disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 press-start-2p-regular">
              管理者のみアクセス可能です
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
}