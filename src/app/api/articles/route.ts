import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/articles - 記事一覧取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')

    const take = limit ? parseInt(limit) : undefined
    const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined

    const articles = await prisma.article.findMany({
      where: {
        ...(published === 'true' ? { published: true } : {}),
        ...(category ? { category } : {}),
        ...(featured === 'true' ? { featured: true } : {}),
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        published: true,
        featured: true,
        category: true,
        tags: true,
        imageUrl: true,
        author: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take,
      skip,
    })

    const total = await prisma.article.count({
      where: {
        ...(published === 'true' ? { published: true } : {}),
        ...(category ? { category } : {}),
        ...(featured === 'true' ? { featured: true } : {}),
      },
    })

    return NextResponse.json({
      articles: articles.map(article => ({
        ...article,
        tags: article.tags ? JSON.parse(article.tags) : [],
      })),
      total,
      page: page ? parseInt(page) : 1,
      limit: take || total,
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST /api/articles - 新しい記事作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, slug, published, featured, category, tags, imageUrl, author } = body

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: 'Title, content, and slug are required' },
        { status: 400 }
      )
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        published: published || false,
        featured: featured || false,
        category,
        tags: tags ? JSON.stringify(tags) : null,
        imageUrl,
        author: author || 'Admin',
        publishedAt: published ? new Date() : null,
      },
    })

    return NextResponse.json({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : [],
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}