'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import RichTextEditor from '@/components/RichTextEditor';

export default function SimpleProductionAdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('管理者');
  const [publishedAt, setPublishedAt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [charCount, setCharCount] = useState(0);

  // 文字数カウンター（HTMLタグを除いたテキスト）
  useEffect(() => {
    const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    setCharCount(textContent.length);
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      setMessage('タイトルと内容を入力してください');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/articles/simple-production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          thumbnail,
          category,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          author,
          publishedAt: publishedAt || new Date().toISOString(),
          status
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('記事を投稿しました！');
        setMessageType('success');
        // フォームをリセット
        setTitle('');
        setContent('');
        setThumbnail('');
        setCategory('');
        setTags('');
        setAuthor('管理者');
        setPublishedAt('');
        setStatus('draft');
      } else {
        console.error('API Error:', data);
        setMessage(data.error || `エラーが発生しました (${response.status})`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('通信エラーが発生しました');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setStatus('draft');
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/articles/simple-production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || '下書き',
          content: content || '下書き内容',
          thumbnail,
          category,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          author,
          publishedAt: publishedAt || new Date().toISOString(),
          status: 'draft'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('下書きを保存しました！');
        setMessageType('success');
      } else {
        setMessage(data.error || '下書きの保存に失敗しました');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('下書きの保存に失敗しました');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.h1
            className="text-3xl font-bold mb-8 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            記事投稿
          </motion.h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* メインコンテンツエリア */}
            <div className="lg:col-span-2">

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  messageType === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                  {message}
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* タイトル */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      タイトル
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="記事のタイトルを入力してください"
                    />
                  </div>

                  {/* 内容 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      内容 <span className="text-gray-500">({charCount}文字)</span>
                    </label>
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="記事の内容を入力してください（リッチテキストエディタ）"
                    />
                  </div>

                  {/* サムネイル画像 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      サムネイル画像URL
                    </label>
                    <input
                      type="url"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* ボタン群 */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-3 rounded-lg font-semibold ${
                        loading ? 'bg-gray-400 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {loading ? '投稿中...' : '公開'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={loading}
                      className={`px-6 py-3 rounded-lg font-semibold border ${
                        loading ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                      }`}
                    >
                      下書き保存
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
              {/* 公開設定 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">公開設定</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ステータス
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">下書き</option>
                      <option value="published">公開</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      公開日時
                    </label>
                    <input
                      type="datetime-local"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* カテゴリー・タグ */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">分類</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      カテゴリー
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="カテゴリーを入力"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      タグ
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="タグをカンマ区切りで入力"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      著者
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="著者名"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}