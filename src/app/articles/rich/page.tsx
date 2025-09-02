'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

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

export default function RichArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    try {
      const savedArticles = localStorage.getItem('articles');
      if (savedArticles) {
        const parsedArticles = JSON.parse(savedArticles);
        const publishedArticles = parsedArticles.filter((article: Article) => article.published);
        setArticles(publishedArticles);
        console.log('Loaded articles from localStorage:', parsedArticles.length);
      }
    } catch (error) {
      console.error('Error loading articles from localStorage:', error);
    }
  }, []);

  const ArticleCard = ({ article, index }: { article: Article; index: number }) => (
    <motion.article
      key={article.id}
      className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedArticle(article)}
    >
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {article.category && (
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded press-start-2p-regular">
              {article.category}
            </span>
          )}
          {article.featured && (
            <span className="text-sm text-gold bg-yellow-100 px-2 py-1 rounded press-start-2p-regular">
              ⭐ おすすめ
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-bold mb-3 press-start-2p-regular line-clamp-2">
          {article.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="text-xs bg-gray-200 px-2 py-1 rounded press-start-2p-regular"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{article.author}</span>
          <span>
            {new Date(article.createdAt).toLocaleDateString('ja-JP')}
          </span>
        </div>
      </div>
    </motion.article>
  );

  const ArticleModal = ({ article }: { article: Article }) => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => setSelectedArticle(null)}
    >
      <motion.div
        className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 press-start-2p-regular">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{article.author}</span>
                <span>{new Date(article.createdAt).toLocaleDateString('ja-JP')}</span>
                {article.category && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded press-start-2p-regular">
                    {article.category}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm bg-gray-200 px-3 py-1 rounded press-start-2p-regular"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose max-w-none">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
              style={{ 
                backgroundColor: 'white',
                color: 'black'
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );

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
              記事一覧（リッチエディタ版）
            </h1>
            <p className="text-lg text-gray-600">
              画像・動画対応の高機能エディタで作成された記事
            </p>
          </motion.div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 press-start-2p-regular">
                まだリッチエディタで作成された記事がありません
              </p>
              <p className="text-gray-400 mt-4">
                高機能エディタで記事を作成してください
              </p>
              <motion.a
                href="/admin/rich"
                className="inline-block mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-button text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 リッチエディタで記事を作成
              </motion.a>
            </div>
          ) : (
            <>
              {/* おすすめ記事 */}
              {articles.some(article => article.featured) && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 press-start-2p-regular">
                    ⭐ おすすめ記事
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles
                      .filter(article => article.featured)
                      .map((article, index) => (
                        <ArticleCard key={article.id} article={article} index={index} />
                      ))}
                  </div>
                </div>
              )}

              {/* 全記事 */}
              <div>
                <h2 className="text-2xl font-bold mb-6 press-start-2p-regular">
                  すべての記事
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article, index) => (
                    <ArticleCard key={article.id} article={article} index={index} />
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 press-start-2p-regular">
              リッチエディタ版 - 画像・動画・マークダウン対応
            </p>
          </div>
        </div>
      </main>

      {/* 記事詳細モーダル */}
      {selectedArticle && <ArticleModal article={selectedArticle} />}
    </>
  );
}