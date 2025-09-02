'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, Image, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Article {
  id: string;
  title: string;
  content: string;
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

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/articles/${resolvedParams.slug}`);
        
        if (response.status === 404) {
          setError('記事が見つかりませんでした');
          return;
        }
        
        if (!response.ok) {
          throw new Error('記事の取得に失敗しました');
        }
        
        const data: Article = await response.json();
        
        if (!data.published) {
          setError('この記事は非公開です');
          return;
        }
        
        setArticle(data);
        
        // 関連記事も取得
        setLoadingRelated(true);
        try {
          const relatedResponse = await fetch(`/api/articles/${resolvedParams.slug}/related`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedArticles(relatedData.relatedArticles || []);
          }
        } catch (relatedError) {
          console.error('Failed to fetch related articles:', relatedError);
        } finally {
          setLoadingRelated(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [params]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 press-start-2p-regular">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-6 mb-3 press-start-2p-regular">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-700 leading-relaxed">
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-700 leading-relaxed list-disc">
            {line.replace('- ', '')}
          </li>
        );
      }
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {line}
        </p>
      );
    });
  };

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
            <div className="space-x-4">
              <button 
                onClick={() => router.back()}
                className="bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors press-start-2p-button text-sm"
              >
                戻る
              </button>
              <Link href="/articles">
                <button className="bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-button text-sm">
                  記事一覧へ
                </button>
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!article) return null;

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 bg-white text-black">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 戻るボタン */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/articles"
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors press-start-2p-regular text-sm"
            >
              <ArrowLeft size={16} className="mr-2" />
              記事一覧に戻る
            </Link>
          </motion.div>

          {/* 記事画像 */}
          {article.imageUrl && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          )}

          {/* 記事メタデータ */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
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

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 press-start-2p-regular leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span className="press-start-2p-regular">{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span className="press-start-2p-regular">
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
              </div>
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full press-start-2p-regular"
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* 記事本文 */}
          <motion.div
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="text-base md:text-lg leading-relaxed">
              {formatContent(article.content)}
            </div>
          </motion.div>

          {/* 関連記事セクション */}
          {relatedArticles.length > 0 && (
            <motion.div
              className="mt-16 pt-8 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center press-start-2p-regular">
                関連記事
              </h2>
              
              {loadingRelated ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/articles/${relatedArticle.slug}`}
                      className="group"
                    >
                      <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                        {relatedArticle.imageUrl && (
                          <img
                            src={relatedArticle.imageUrl}
                            alt={relatedArticle.title}
                            className="w-full h-32 object-cover rounded mb-4"
                          />
                        )}
                        
                        <div className="flex items-center gap-2 mb-2">
                          {relatedArticle.category && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded press-start-2p-regular">
                              {relatedArticle.category}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-bold mb-2 group-hover:text-gray-600 transition-colors press-start-2p-regular text-sm leading-tight">
                          {relatedArticle.title}
                        </h3>
                        
                        {relatedArticle.excerpt && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {relatedArticle.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <User size={12} className="mr-1" />
                          <span className="mr-3 press-start-2p-regular">{relatedArticle.author}</span>
                          <Calendar size={12} className="mr-1" />
                          <span className="press-start-2p-regular">
                            {formatDate(relatedArticle.publishedAt || relatedArticle.createdAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* フッター */}
          <motion.div
            className="mt-16 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="text-center">
              <Link href="/articles">
                <motion.button
                  className="bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-button text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  他の記事を読む
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </article>
      </main>
    </>
  );
}