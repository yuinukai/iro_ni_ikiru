import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// データベースを初期化するAPI（本番環境での初回実行用）
export async function GET() {
  return initializeDatabase();
}

export async function POST() {
  return initializeDatabase();
}

async function initializeDatabase() {
  try {
    // 接続テスト
    await prisma.$connect()
    console.log('Database connected successfully')

    // 既存記事をチェック（テーブルが存在するかも同時に確認）
    let existingArticle
    try {
      existingArticle = await prisma.article.findFirst()
      console.log('Articles table exists, found:', existingArticle ? 'articles' : 'no articles')
    } catch (tableError) {
      console.log('Articles table may not exist:', tableError)
      existingArticle = null
    }

    // サンプル記事を作成（テーブルがない場合は自動作成される）
    if (!existingArticle) {
      const newArticle = await prisma.article.create({
        data: {
          title: 'いろにいきる！へようこそ',
          content: `# ウェルカムメッセージ

いろにいきる！へようこそ。
塗装業界の革新的なメディアサイトです。

## 特徴
- Press Start 2P フォント
- レスポンシブデザイン  
- 管理者機能完備

ぜひお楽しみください！`,
          excerpt: 'サイトの紹介記事です。',
          slug: 'welcome-to-iro-ni-ikiru',
          published: true,
          category: 'お知らせ',
          tags: JSON.stringify(['ウェルカム', '紹介', 'サイト']),
          author: '管理者',
          publishedAt: new Date()
        }
      })
      console.log('Sample article created:', newArticle.title)
    }

    await prisma.$disconnect()

    return NextResponse.json({ 
      message: 'Database initialized successfully',
      status: 'ok',
      hasExistingData: !!existingArticle
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    
    // より詳細なエラー情報
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }
    
    return NextResponse.json({ 
      error: 'Failed to initialize database',
      details: errorDetails,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 })
  }
}