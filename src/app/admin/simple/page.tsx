'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useRouter } from 'next/navigation';

export default function SimpleAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      setMessage('タイトルと内容は必須です');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/articles/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          published
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('記事を作成しました！');
        // フォームをリセット
        setTitle('');
        setContent('');
        setCategory('');
        setPublished(false);
      } else {
        setMessage(`エラー: ${data.error}`);
      }
    } catch (error) {
      setMessage(`エラー: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 pb-20 bg-white text-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg press-start-2p-regular">認証確認中...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 bg-white text-black">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.h1
            className="text-3xl font-bold mb-8 press-start-2p-regular text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            記事作成（シンプル版）
          </motion.h1>

          {message && (
            <div className={`mb-6 p-4 rounded ${message.includes('エラー') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} press-start-2p-regular text-sm`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                記事タイトル *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                記事内容 *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                カテゴリー
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="例: 塗装技術"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm press-start-2p-regular">
                すぐに公開する
              </label>
            </div>

            <div className="flex justify-center">
              <motion.button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 text-white rounded transition-colors press-start-2p-button text-sm ${
                  loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
                }`}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? '作成中...' : '記事を作成'}
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}