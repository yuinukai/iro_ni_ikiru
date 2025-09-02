'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function SimpleProductionArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles/simple-production');
      const data = await response.json();
      
      if (response.ok) {
        setArticles(data.articles || []);
      } else {
        setError(data.error || '記事の取得に失敗しました');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('通信エラーが発生しました');
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
            className="text-2xl font-bold mb-6 press-start-2p-regular text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            記事一覧（シンプル版）
          </motion.h1>

          {loading && (
            <div className="text-center py-8">
              <p>読み込み中...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">まだ記事がありません</p>
            </div>
          )}

          <div className="space-y-6">
            {articles.map((article) => (
              <motion.article
                key={article.id}
                className="bg-gray-50 rounded-lg p-6 shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-bold mb-3">{article.title}</h2>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {article.content}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString('ja-JP')}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}