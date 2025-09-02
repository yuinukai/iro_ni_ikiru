'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ImageUpload from '@/components/ImageUpload';

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published: boolean;
  featured: boolean;
  category: string | null;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticleForm {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  featured: boolean;
  category: string;
  tags: string[];
  imageUrl: string;
  author: string;
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [formData, setFormData] = useState<ArticleForm>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    published: false,
    featured: false,
    category: '',
    tags: [],
    imageUrl: '',
    author: 'Admin'
  });

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchArticles();
    }
  }, [authenticated]);

  // 自動保存機能
  useEffect(() => {
    if (!showForm || (!formData.title && !formData.content)) return;

    const saveTimer = setTimeout(() => {
      saveDraft();
    }, 30000); // 30秒後に自動保存

    return () => clearTimeout(saveTimer);
  }, [formData, showForm]);

  // ページロード時に下書きを復元
  useEffect(() => {
    if (showForm && !editingArticle) {
      loadDraft();
    }
  }, [showForm]);

  const checkAuthentication = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthenticated(true);
    }
    setCheckingAuth(false);
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('記事の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingArticle ? `/api/articles/${editingArticle}` : '/api/articles';
      const method = editingArticle ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.length > 0 ? formData.tags : []
        }),
      });

      if (response.ok) {
        await fetchArticles();
        clearDraft();
        resetForm();
        alert(editingArticle ? '記事を更新しました' : '記事を作成しました');
      } else {
        const errorData = await response.json();
        alert(`エラー: ${errorData.error}`);
      }
    } catch (error) {
      console.error('記事の保存に失敗しました:', error);
      alert('記事の保存に失敗しました');
    }
  };

  const handleEdit = async (slug: string) => {
    try {
      const response = await fetch(`/api/articles/${slug}`);
      if (response.ok) {
        const article = await response.json();
        setFormData({
          title: article.title,
          content: article.content,
          excerpt: article.excerpt || '',
          slug: article.slug,
          published: article.published,
          featured: article.featured,
          category: article.category || '',
          tags: article.tags,
          imageUrl: article.imageUrl || '',
          author: article.author
        });
        setEditingArticle(slug);
        setShowForm(true);
      }
    } catch (error) {
      console.error('記事の取得に失敗しました:', error);
      alert('記事の取得に失敗しました');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('本当に削除しますか？')) return;
    
    try {
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchArticles();
        alert('記事を削除しました');
      } else {
        alert('記事の削除に失敗しました');
      }
    } catch (error) {
      console.error('記事の削除に失敗しました:', error);
      alert('記事の削除に失敗しました');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      slug: '',
      published: false,
      featured: false,
      category: '',
      tags: [],
      imageUrl: '',
      author: 'Admin'
    });
    setEditingArticle(null);
    setShowForm(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const saveDraft = async () => {
    if (!formData.title && !formData.content) return;

    setAutoSaving(true);
    try {
      localStorage.setItem('articleDraft', JSON.stringify({
        ...formData,
        savedAt: new Date().toISOString()
      }));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem('articleDraft');
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        if (draft.title || draft.content) {
          const confirmed = confirm('保存された下書きがあります。復元しますか？');
          if (confirmed) {
            setFormData({
              ...formData,
              title: draft.title || '',
              content: draft.content || '',
              excerpt: draft.excerpt || '',
              category: draft.category || '',
              tags: draft.tags || [],
              imageUrl: draft.imageUrl || '',
              author: draft.author || 'Admin'
            });
            setLastSaved(new Date(draft.savedAt));
          }
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('articleDraft');
    setLastSaved(null);
  };

  if (checkingAuth) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 pb-20 bg-white text-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg press-start-2p-regular">認証確認中...</p>
          </div>
        </main>
      </>
    );
  }

  if (!authenticated) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 pb-20 bg-white text-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg press-start-2p-regular mb-4">管理者認証が必要です</p>
            <a 
              href="/login"
              className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-regular"
            >
              ログインページへ
            </a>
          </div>
        </main>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 pb-20 bg-white text-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg press-start-2p-regular">読み込み中...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 bg-white text-black">
        <div className="container mx-auto px-4 py-8">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              className="text-3xl md:text-4xl font-bold press-start-2p-regular"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              記事管理
            </motion.h1>
            
            <motion.button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-regular text-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Plus size={16} className="mr-2" />
              {showForm ? 'キャンセル' : '新規作成'}
            </motion.button>
          </div>

          {/* 記事作成・編集フォーム */}
          {showForm && (
            <motion.div
              className="mb-8 p-6 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold press-start-2p-regular">
                  {editingArticle ? '記事編集' : '新規記事作成'}
                </h2>
                
                {/* 自動保存ステータス */}
                <div className="text-sm text-gray-500">
                  {autoSaving ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                      保存中...
                    </span>
                  ) : lastSaved ? (
                    <span>
                      最終保存: {lastSaved.toLocaleTimeString('ja-JP')}
                    </span>
                  ) : null}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                      タイトル *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                      スラッグ *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                    概要
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                    本文 *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                      カテゴリー
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                      タグ (カンマ区切り)
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      placeholder="タグ1, タグ2, タグ3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                      著者
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <ImageUpload
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                  currentImage={formData.imageUrl}
                  onImageRemoved={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                />

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="press-start-2p-regular text-sm">公開</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="press-start-2p-regular text-sm">注目記事</span>
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors press-start-2p-regular"
                  >
                    {editingArticle ? '更新' : '作成'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors press-start-2p-regular"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* 記事一覧 */}
          <div className="space-y-4">
            {articles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-gray-500 press-start-2p-regular">記事がありません</p>
              </div>
            ) : (
              articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold press-start-2p-regular">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {article.published ? (
                            <Eye size={16} className="text-green-500" />
                          ) : (
                            <EyeOff size={16} className="text-gray-400" />
                          )}
                          {article.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full press-start-2p-regular">
                              注目
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {article.excerpt && (
                        <p className="text-gray-600 mb-2">{article.excerpt}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>作者: {article.author}</span>
                        <span>作成: {new Date(article.createdAt).toLocaleDateString('ja-JP')}</span>
                        {article.category && <span>カテゴリー: {article.category}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(article.slug)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="編集"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(article.slug)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}