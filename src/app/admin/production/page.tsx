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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !password) {
      setMessage('タイトル、内容、パスワードは必須です');
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
        setPassword('');
        
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

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-sm">
              <strong>重要:</strong> これは本番環境です。投稿した記事はデータベースに保存されます。
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
                管理者パスワード *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="パスワードを入力"
                required
              />
            </div>

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

          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2 press-start-2p-regular text-sm">セットアップ手順</h3>
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li><a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Supabase</a>で無料アカウントを作成</li>
              <li>新しいプロジェクトを作成</li>
              <li>SQLエディタで以下のテーブルを作成：
                <pre className="bg-white p-2 mt-2 text-xs overflow-x-auto">{`CREATE TABLE articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  published BOOLEAN DEFAULT false,
  category TEXT,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);`}</pre>
              </li>
              <li>.env.localファイルを作成し、Supabaseの認証情報を設定</li>
              <li>管理者パスワードを.env.localに設定</li>
            </ol>
          </div>
        </div>
      </main>
    </>
  );
}