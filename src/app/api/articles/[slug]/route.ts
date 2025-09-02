import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteParams = {
  params: Promise<{
    slug: string
  }>
}

// GET /api/articles/[slug] - 特定の記事取得
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    const article = await prisma.article.findUnique({
      where: { slug },
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : [],
    })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

// PUT /api/articles/[slug] - 記事更新
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { title, content, excerpt, published, featured, category, tags, imageUrl, author } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const article = await prisma.article.update({
      where: { slug },
      data: {
        title,
        content,
        excerpt,
        published: published ?? existingArticle.published,
        featured: featured ?? existingArticle.featured,
        category,
        tags: tags ? JSON.stringify(tags) : null,
        imageUrl,
        author,
        publishedAt: published && !existingArticle.published ? new Date() : existingArticle.publishedAt,
      },
    })

    return NextResponse.json({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : [],
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE /api/articles/[slug] - 記事削除
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    await prisma.article.delete({
      where: { slug },
    })

    return NextResponse.json(
      { message: 'Article deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}