'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, Image, Search, Filter } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published: boolean;
  featured: boolean;
  category: string | null;
  tags: string[];
  imageUrl: string | null;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/articles?published=true&limit=10');
        if (!response.ok) {
          throw new Error('記事の取得に失敗しました');
        }
        const data: ArticlesResponse = await response.json();
        setArticles(data.articles);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  // フィルタリング機能
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // 検索テキストフィルター
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase());

      // カテゴリーフィルター
      const matchesCategory = selectedCategory === '' || article.category === selectedCategory;

      // タグフィルター
      const matchesTag = selectedTag === '' || article.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [articles, searchTerm, selectedCategory, selectedTag]);

  // 利用可能なカテゴリーとタグを取得
  const categories = useMemo(() => {
    const cats = articles.map(article => article.category).filter(Boolean);
    return [...new Set(cats)] as string[];
  }, [articles]);

  const tags = useMemo(() => {
    const allTags = articles.flatMap(article => article.tags);
    return [...new Set(allTags)];
  }, [articles]);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 pb-20 bg-white text-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg press-start-2p-regular">記事を読み込み中...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 pb-20 bg-white text-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg press-start-2p-regular text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-button text-sm"
            >
              再読み込み
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 bg-white text-black">
        {/* ヘッダーセクション */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 press-start-2p-regular"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Articles
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 press-start-2p-regular"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              塗装業界のリアルを届ける記事
            </motion.p>
          </div>
        </section>

        {/* 検索・フィルターセクション */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="container mx-auto">
            {/* 検索バー */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="記事を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors press-start-2p-regular text-sm"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors press-start-2p-button text-sm"
              >
                <Filter size={16} className="mr-2" />
                フィルター
              </button>
            </div>

            {/* フィルターパネル */}
            {showFilters && (
              <motion.div
                className="bg-white p-6 rounded-lg border border-gray-200 mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* カテゴリーフィルター */}
                  <div>
                    <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                      カテゴリー
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black press-start-2p-regular text-sm"
                    >
                      <option value="">すべてのカテゴリー</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* タグフィルター */}
                  <div>
                    <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                      タグ
                    </label>
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black press-start-2p-regular text-sm"
                    >
                      <option value="">すべてのタグ</option>
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* フィルタークリアボタン */}
                {(searchTerm || selectedCategory || selectedTag) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                        setSelectedTag('');
                      }}
                      className="text-gray-600 hover:text-black transition-colors press-start-2p-button text-sm"
                    >
                      すべてクリア
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 検索結果カウント */}
            <div className="mb-6 text-sm text-gray-600 press-start-2p-regular">
              {filteredArticles.length}件の記事が見つかりました
              {(searchTerm || selectedCategory || selectedTag) && (
                <span className="text-gray-500">
                  {searchTerm && ` (検索: "${searchTerm}")`}
                  {selectedCategory && ` (カテゴリー: ${selectedCategory})`}
                  {selectedTag && ` (タグ: ${selectedTag})`}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 記事一覧セクション */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-gray-500 press-start-2p-regular">記事がありません</p>
              </div>
            ) : (
              <div className="grid gap-8 md:gap-12">
                {filteredArticles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                  >
                    <div className="grid md:grid-cols-4 gap-6 items-start">
                      {/* 記事画像 */}
                      <div className="md:col-span-1">
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full aspect-video object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image size={32} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* 記事情報 */}
                      <div className="md:col-span-3">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          {article.category && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full press-start-2p-regular">
                              {article.category}
                            </span>
                          )}
                          {article.featured && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full press-start-2p-regular">
                              注目記事
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black press-start-2p-regular leading-tight">
                          <Link 
                            href={`/articles/${article.slug}`}
                            className="hover:text-gray-600 transition-colors"
                          >
                            {article.title}
                          </Link>
                        </h2>
                        
                        {article.excerpt && (
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {article.excerpt}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User size={16} className="mr-1" />
                            <span className="press-start-2p-regular">{article.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            <span className="press-start-2p-regular">
                              {formatDate(article.publishedAt || article.createdAt)}
                            </span>
                          </div>
                        </div>

                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full press-start-2p-regular"
                              >
                                <Tag size={12} className="mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link href={`/articles/${article.slug}`}>
                          <motion.button
                            className="bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-button text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            続きを読む
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {/* 記事投稿CTA */}
            <motion.div
              className="text-center mt-16 p-8 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-4 press-start-2p-regular">
                記事を投稿しませんか？
              </h3>
              <p className="text-gray-600 mb-6 press-start-2p-regular leading-relaxed">
                あなたの経験や知識をシェアしてください
              </p>
              <Link href="/login">
                <motion.button
                  className="bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-button text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  管理者ページへ
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}