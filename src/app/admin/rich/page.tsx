'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with markdown editor
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
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export default function RichAdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(`# 記事タイトル

## 概要
ここに記事の概要を書いてください。

## 詳細内容

### 画像の追加方法
\`![画像説明](画像URL)\`

### 動画の埋め込み方法
YouTubeの場合：
\`<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>\`

### リスト
- 項目1
- 項目2
- 項目3

### コードブロック
\`\`\`javascript
console.log('Hello, World!');
\`\`\`

**太字** と *斜体* も使えます。
`);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageBase64 = e.target?.result as string;
        setImageUrl(imageBase64);
        // マークダウンエディタに画像を挿入
        const imageMarkdown = `\n![${file.name}](${imageBase64})\n`;
        setContent(prev => prev + imageMarkdown);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertYouTubeVideo = () => {
    const videoUrl = prompt('YouTubeのURLを入力してください:');
    if (videoUrl) {
      let videoId = '';
      const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (match) {
        videoId = match[1];
        const iframe = `\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>\n`;
        setContent(prev => prev + iframe);
      } else {
        alert('有効なYouTubeのURLを入力してください。');
      }
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

      // プレーンテキストの抜粋を作成（マークダウンタグを除去）
      const excerpt = content
        .replace(/[#*`]/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '[画像]')
        .replace(/<[^>]+>/g, '[動画]')
        .substring(0, 150) + '...';

      const newArticle: Article = {
        id: Date.now().toString(),
        title,
        content,
        excerpt,
        slug,
        published: !!published,
        featured: !!featured,
        category: category || '',
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=Article+Image',
        author: '管理者',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: published ? new Date() : undefined
      };

      saveArticleToLocalStorage(newArticle);
      
      setMessage('リッチエディタで記事を作成しました！記事一覧ページで確認してください。');
      
      // フォームをリセット
      setTitle('');
      setContent(`# 新しい記事タイトル

記事の内容をここに書いてください...`);
      setCategory('');
      setTags('');
      setPublished(false);
      setFeatured(false);
      setImageUrl('');
      
      // 記事一覧ページにリダイレクト
      setTimeout(() => {
        window.location.href = '/articles/rich';
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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.h1
            className="text-3xl font-bold mb-8 press-start-2p-regular text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            高機能エディタで記事作成
          </motion.h1>

          {message && (
            <div className={`mb-6 p-4 rounded ${message.includes('エラー') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} press-start-2p-regular text-sm`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 press-start-2p-regular">
                タグ（カンマ区切り）
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="例: 塗装, 技術, DIY"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-4 press-start-2p-regular">
                記事内容 * （マークダウン対応）
              </label>
              
              {/* メディア挿入ツールバー */}
              <div className="flex gap-4 mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer press-start-2p-button text-xs"
                >
                  📷 画像追加
                </label>
                <button
                  type="button"
                  onClick={insertYouTubeVideo}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 press-start-2p-button text-xs"
                >
                  🎬 YouTube埋め込み
                </button>
              </div>

              <div data-color-mode="light" className="border rounded">
                <MDEditor
                  value={content}
                  onChange={(value) => setContent(value || '')}
                  height={400}
                  preview="edit"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm press-start-2p-regular">
                  おすすめ記事にする
                </label>
              </div>
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
                {loading ? '作成中...' : '🚀 記事を作成'}
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}