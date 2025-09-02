import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: 記事一覧取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    
    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (published === 'true') {
      query = query.eq('published', true)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'データベースエラー', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ articles: data || [] })
  } catch (error) {
    console.error('Error fetching articles:', error)
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
    const { title, content, category, published, password } = body
    
    // 簡易的な認証チェック
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: '認証エラー: パスワードが正しくありません' },
        { status: 401 }
      )
    }
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      )
    }
    
    // スラッグ生成
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now()
    
    // 抜粋作成
    const excerpt = content
      .replace(/[#*`]/g, '')
      .substring(0, 150) + '...'
    
    const newArticle = {
      title,
      content,
      excerpt,
      slug,
      published: !!published,
      category: category || '',
      author: '管理者',
      published_at: published ? new Date().toISOString() : null
    }
    
    const { data, error } = await supabase
      .from('articles')
      .insert([newArticle])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'データベースエラー', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: '記事を作成しました',
      article: data
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: '記事の作成に失敗しました' },
      { status: 500 }
    )
  }
}