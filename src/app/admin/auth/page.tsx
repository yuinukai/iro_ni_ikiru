'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function AdminAuthPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('パスワードを入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        // 認証成功 - セッションストレージに保存
        sessionStorage.setItem('adminAuthenticated', 'true');
        // 記事投稿画面にリダイレクト
        router.push('/admin/simple-production');
      } else {
        setError(data.error || 'パスワードが正しくありません');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('認証エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 bg-white text-black">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <motion.div
            className="bg-gray-50 p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold mb-6 press-start-2p-regular text-center">
              管理者認証
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  管理者パスワード
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="パスワードを入力"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 text-white rounded ${
                  loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
                }`}
              >
                {loading ? '認証中...' : 'ログイン'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-sm text-blue-700">
                管理者パスワードを入力して記事投稿画面にアクセスできます。
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
