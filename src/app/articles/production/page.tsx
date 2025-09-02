'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published: boolean;
  category?: string;
  author: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export default function ProductionArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles/production?published=true');
      const data = await response.json();
      
      if (response.ok) {
        setArticles(data.articles || []);
      } else {
        setError(data.error || '記事の取得に失敗しました');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('記事の取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 bg-white text-black">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-4 press-start-2p-regular">
              記事一覧（本番環境）
            </h1>
            <p className="text-lg text-gray-600">
              データベースから記事を取得しています
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 press-start-2p-regular">
                読み込み中...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-xl text-red-500 press-start-2p-regular">
                エラー: {error}
              </p>
              <div className="mt-8 p-4 bg-yellow-100 rounded max-w-2xl mx-auto">
                <p className="text-sm text-gray-700">
                  データベースが設定されていない可能性があります。
                  <br />
                  <a href="/admin/production" className="text-blue-600 underline">管理画面</a>でセットアップ手順を確認してください。
                </p>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 press-start-2p-regular">
                まだ記事がありません
              </p>
              <p className="text-gray-400 mt-4">
                管理者ページで記事を作成してください
              </p>
              <motion.a
                href="/admin/production"
                className="inline-block mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-button text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                記事を作成
              </motion.a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-6">
                    {article.category && (
                      <div className="text-sm text-gray-500 mb-2 press-start-2p-regular">
                        {article.category}
                      </div>
                    )}
                    <h2 className="text-xl font-bold mb-3 press-start-2p-regular line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt || article.content.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.author}</span>
                      <span>
                        {new Date(article.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 press-start-2p-regular">
              本番環境 - Supabaseデータベース使用
            </p>
          </div>
        </div>
      </main>
    </>
  );
}