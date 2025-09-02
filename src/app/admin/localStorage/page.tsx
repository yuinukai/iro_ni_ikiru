'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published: boolean;
  featured: boolean;
  category?: string;
  tags: string[];
  imageUrl?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export default function LocalStorageAdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const saveArticleToLocalStorage = (article: Article) => {
    try {
      const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      existingArticles.push(article);
      localStorage.setItem('articles', JSON.stringify(existingArticles));
      console.log('Article saved to localStorage:', article.title);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      setMessage('タイトルと内容は必須です');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + '-' + Date.now();

      const newArticle: Article = {
        id: Date.now().toString(),
        title,
        content,
        excerpt: content.substring(0, 100) + '...',
        slug,
        published: !!published,
        featured: false,
        category: category || '',
        tags: [],
        imageUrl: 'https://via.placeholder.com/400x300?text=Article+Image',
        author: '管理者',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: published ? new Date() : undefined
      };

      // ローカルストレージに保存
      saveArticleToLocalStorage(newArticle);
      
      setMessage('記事をローカルに保存しました！記事一覧ページで確認してください。');
      
      // フォームをリセット
      setTitle('');
      setContent('');
      setCategory('');
      setPublished(false);
      
      // 記事一覧ページにリダイレクト
      setTimeout(() => {
        window.location.href = '/articles/localStorage';
      }, 2000);

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
            記事作成（ローカル保存版）
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