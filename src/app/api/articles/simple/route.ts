import { NextRequest, NextResponse } from 'next/server'

// シンプルなメモリ内データストア（Vercel対応）
let articles: Array<{
  id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  published: boolean
  featured: boolean
  category?: string
  tags: string[]
  imageUrl?: string
  author: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}> = [
  {
    id: '1',
    title: 'いろにいきる！へようこそ',
    content: `# ウェルカムメッセージ

いろにいきる！へようこそ。
塗装業界の革新的なメディアサイトです。

## 特徴
- Press Start 2P フォント
- レスポンシブデザイン
- 管理者機能

ぜひお楽しみください！`,
    excerpt: 'サイトの紹介記事です。',
    slug: 'welcome-to-iro-ni-ikiru',
    published: true,
    featured: true,
    category: 'お知らせ',
    tags: ['ウェルカム', '紹介', 'サイト'],
    imageUrl: 'https://via.placeholder.com/400x300?text=Welcome+Image',
    author: '管理者',
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date()
  }
]

// GET /api/articles/simple - 記事一覧取得
export async function GET() {
  try {
    return NextResponse.json({
      articles: articles.filter(article => article.published),
      total: articles.filter(article => article.published).length,
      page: 1,
      limit: 10
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST /api/articles/simple - 新しい記事作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, category, tags, published = false } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + Date.now()

    const newArticle = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: excerpt || content.substring(0, 100) + '...',
      slug,
      published: !!published,
      featured: false,
      category: category || '',
      tags: Array.isArray(tags) ? tags : [],
      imageUrl: 'https://via.placeholder.com/400x300?text=Article+Image',
      author: '管理者',
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: published ? new Date() : undefined
    }

    articles.push(newArticle)

    return NextResponse.json({
      ...newArticle,
      message: 'Article created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}