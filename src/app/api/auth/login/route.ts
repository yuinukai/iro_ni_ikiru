import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'パスワードが必要です' },
        { status: 400 }
      )
    }

    const isValid = await verifyPassword(password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'パスワードが間違っています' },
        { status: 401 }
      )
    }

    // 認証トークンを生成
    const token = process.env.ADMIN_TOKEN || 'admin-token-2024'

    return NextResponse.json({
      success: true,
      token,
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