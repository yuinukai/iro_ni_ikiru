import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteParams = {
  params: Promise<{
    slug: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    // 現在の記事を取得
    const currentArticle = await prisma.article.findUnique({
      where: { slug },
      select: {
        id: true,
        category: true,
        tags: true,
      },
    })

    if (!currentArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // 関連記事を検索（カテゴリーまたはタグが一致する記事）
    const relatedArticles = await prisma.article.findMany({
      where: {
        AND: [
          { published: true },
          { id: { not: currentArticle.id } }, // 現在の記事を除外
          {
            OR: [
              // 同じカテゴリーの記事
              currentArticle.category ? { category: currentArticle.category } : {},
              // 共通タグがある記事（タグが存在する場合）
              ...(currentArticle.tags ? 
                JSON.parse(currentArticle.tags).map((tag: string) => ({
                  tags: { contains: tag }
                })) : []
              )
            ]
          }
        ]
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        category: true,
        tags: true,
        imageUrl: true,
        author: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 4, // 最大4件の関連記事
    })

    // タグを解析
    const processedArticles = relatedArticles.map(article => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : [],
    }))

    return NextResponse.json({
      relatedArticles: processedArticles,
      count: processedArticles.length
    })
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related articles' },
      { status: 500 }
    )
  }
}