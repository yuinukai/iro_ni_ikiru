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
  featured: boolean;
  category?: string;
  tags: string[];
  imageUrl?: string;
  author: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt?: string | Date;
}

export default function SimpleArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    try {
      const savedArticles = localStorage.getItem('articles');
      if (savedArticles) {
        const parsedArticles = JSON.parse(savedArticles);
        setArticles(parsedArticles.filter((article: Article) => article.published));
        console.log('Loaded articles from localStorage:', parsedArticles.length);
      }
    } catch (error) {
      console.error('Error loading articles from localStorage:', error);
    }
  }, []);

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
              記事一覧（シンプル版）
            </h1>
            <p className="text-lg text-gray-600">
              ローカルストレージに保存された記事を表示しています
            </p>
          </motion.div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 press-start-2p-regular">
                まだ記事がありません
              </p>
              <p className="text-gray-400 mt-4">
                管理者ページで記事を作成してください
              </p>
              <motion.a
                href="/admin/simple"
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
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
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
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.author}</span>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 press-start-2p-regular">
              ローカルストレージ保存版 - ブラウザにデータが保存されています
            </p>
          </div>
        </div>
      </main>
    </>
  );
}