import { NextRequest, NextResponse } from 'next/server'

// GET /api/articles/localStorage - ローカルストレージ対応の記事取得
export async function GET() {
  try {
    // ローカルストレージからデータを取得するようクライアント側で処理
    return NextResponse.json({
      message: 'Use client-side localStorage',
      articles: [],
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST /api/articles/localStorage - ローカルストレージ記事作成確認
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

    // 成功レスポンス（実際の保存はクライアント側）
    return NextResponse.json({
      message: 'Article data validated successfully',
      success: true
    }, { status: 201 })
  } catch (error) {
    console.error('Error validating article:', error)
    return NextResponse.json(
      { error: 'Failed to validate article' },
      { status: 500 }
    )
  }
}