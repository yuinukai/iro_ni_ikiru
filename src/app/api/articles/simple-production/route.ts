import { NextRequest, NextResponse } from 'next/server'

// 環境変数の確認
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const adminPassword = process.env.ADMIN_PASSWORD || 'paint123' // デフォルト値

// GET: 記事一覧取得
export async function GET() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase設定が不足しています' },
        { status: 500 }
      )
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/articles?order=created_at.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'データ取得エラー' },
        { status: response.status }
      )
    }

    const articles = await response.json()
    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: '記事の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新規記事作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, password } = body
    
    console.log('Received request:', { title, content: content?.substring(0, 50), password: password ? '***' : 'empty' })
    console.log('Environment check:', { 
      supabaseUrl: supabaseUrl ? 'set' : 'missing', 
      supabaseKey: supabaseKey ? 'set' : 'missing',
      adminPassword: adminPassword ? 'set' : 'missing',
      supabaseUrlValue: supabaseUrl?.substring(0, 30) + '...' // 最初の30文字のみ表示
    })
    
    // パスワードチェック（環境変数または固定パスワード）
    if (password !== adminPassword && password !== 'paint123') {
      console.log('Password mismatch:', { received: password, expected: adminPassword })
      return NextResponse.json(
        { error: 'パスワードが正しくありません' },
        { status: 401 }
      )
    }
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      )
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase設定が不足しています' },
        { status: 500 }
      )
    }
    
    // プレースホルダー値のチェック
    if (supabaseUrl.includes('your-project') || supabaseUrl.includes('example')) {
      return NextResponse.json(
        { error: 'Supabase URLがプレースホルダー値です。正しいURLを設定してください。' },
        { status: 500 }
      )
    }
    
    // スラッグ生成
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim() + '-' + Date.now()
    
    const newArticle = {
      title,
      content,
      excerpt: content.substring(0, 150) + '...',
      slug,
      published: true,
      category: '',
      author: '管理者',
      published_at: new Date().toISOString()
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/articles`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(newArticle)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Supabase error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: `${supabaseUrl}/rest/v1/articles`,
        requestBody: newArticle
      })
      return NextResponse.json(
        { 
          error: 'データベースエラー', 
          details: errorText, 
          status: response.status,
          supabaseUrl: supabaseUrl?.substring(0, 50) + '...',
          requestData: newArticle
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      message: '記事を作成しました',
      article: data[0]
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: '記事の作成に失敗しました', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}