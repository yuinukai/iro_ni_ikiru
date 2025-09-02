import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// データベースを初期化するAPI（本番環境での初回実行用）
export async function POST() {
  try {
    // テーブルが存在するかチェック
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "articles" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "excerpt" TEXT,
      "slug" TEXT NOT NULL UNIQUE,
      "published" BOOLEAN NOT NULL DEFAULT false,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "category" TEXT,
      "tags" TEXT,
      "imageUrl" TEXT,
      "author" TEXT NOT NULL DEFAULT 'Admin',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "publishedAt" DATETIME
    );`

    // サンプル記事を作成
    const existingArticle = await prisma.article.findFirst()
    
    if (!existingArticle) {
      await prisma.article.create({
        data: {
          title: 'ウェルカム記事',
          content: 'いろにいきる！へようこそ。塗装業界の革新的なメディアサイトです。',
          excerpt: 'サイトの紹介記事です。',
          slug: 'welcome-article',
          published: true,
          category: 'お知らせ',
          tags: JSON.stringify(['ウェルカム', '紹介']),
          author: '管理者'
        }
      })
    }

    return NextResponse.json({ 
      message: 'Database initialized successfully',
      status: 'ok'
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}