'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

export default function ProductionAdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [published, setPublished] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // パスワード認証処理
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!password) {
      setAuthError('パスワードを入力してください');
      return;
    }

    setLoading(true);

    try {
      // パスワード検証のためにダミーリクエストを送信
      const response = await fetch('/api/articles/production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'auth-check',
          content: 'auth-check',
          password,
          authCheck: true
        })
      });

      const data = await response.json();

      if (response.status === 401) {
        setAuthError('パスワードが正しくありません');
        setPassword('');
      } else if (response.ok || data.authSuccess) {
        setIsAuthenticated(true);
        setAuthError('');
      }
    } catch (error) {
      setAuthError('認証エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 記事投稿処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      setMessage('タイトルと内容は必須です');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/articles/production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          published,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('記事を本番データベースに保存しました！');
        // フォームをリセット
        setTitle('');
        setContent('');
        setCategory('');
        setPublished(false);
        
        // 記事一覧ページにリダイレクト
        setTimeout(() => {
          window.location.href = '/articles/production';
        }, 2000);
      } else {
        setMessage(`エラー: ${data.error}`);
      }
    } catch (error) {
      console.error('Article creation error:', error);
      setMessage(`エラー: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  // パスワード認証画面
  if (!isAuthenticated) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 pb-20 bg-white text-black">
          <div className="container mx-auto px-4 py-8 max-w-md">
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold mb-6 press-start-2p-regular text-center">
                管理者認証
              </h1>
              
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="text-sm">
                  本番環境の記事投稿にアクセスするには管理者パスワードが必要です
                </p>
              </div>

              {authError && (
                <div className="mb-6 p-4 rounded bg-red-100 text-red-700 text-sm">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                    管理者パスワード
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-black text-lg"
                    placeholder="パスワードを入力"
                    autoFocus
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 text-white rounded transition-colors press-start-2p-button text-sm ${
                    loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
                  }`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? '認証中...' : 'ログイン'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  // 記事作成画面（認証後）
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
            記事作成（本番環境）
          </motion.h1>

          <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-sm">
              <strong>認証済み:</strong> 本番環境に記事を投稿できます
            </p>
          </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-mono"
                placeholder="マークダウン形式で記事を書けます。\n\n# 見出し1\n## 見出し2\n\n**太字** *斜体*\n\n- リスト項目1\n- リスト項目2"
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

            <div className="flex justify-center space-x-4">
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
              
              <motion.button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="px-8 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors press-start-2p-button text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ログアウト
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}