'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

export default function SimpleProductionAdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !password) {
      setMessage('すべての項目を入力してください');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/articles/simple-production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('記事を投稿しました！');
        setMessageType('success');
        // フォームをリセット
        setTitle('');
        setContent('');
        setPassword('');
      } else {
        console.error('API Error:', data);
        setMessage(data.error || `エラーが発生しました (${response.status})`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('通信エラーが発生しました');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 bg-white text-black">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <motion.h1
            className="text-2xl font-bold mb-6 press-start-2p-regular text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            シンプル記事投稿
          </motion.h1>

          {message && (
            <div className={`mb-6 p-4 rounded ${
              messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                記事タイトル
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="タイトルを入力"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                記事内容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="内容を入力"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                管理者パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="パスワードを入力"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 text-white rounded ${
                loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {loading ? '投稿中...' : '記事を投稿'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">
              テスト用のシンプルな投稿フォームです。
              パスワード: paint123
            </p>
          </div>
        </div>
      </main>
    </>
  );
}