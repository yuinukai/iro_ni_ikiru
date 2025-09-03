import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'パスワードが必要です' },
        { status: 400 }
      )
    }

    // シンプルなパスワード認証
    const adminPassword = process.env.ADMIN_PASSWORD || 'paint123'
    
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'パスワードが間違っています' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'ログインしました'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'ログインに失敗しました' },
      { status: 500 }
    )
  }
}