import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    // Vercelでは一時的にファイルアップロードを無効化
    // 後でCloudinary等の外部サービスに対応予定
    return NextResponse.json({
      url: 'https://via.placeholder.com/400x300?text=Sample+Image',
      fileName: 'placeholder.jpg',
      size: 12345,
      type: 'image/jpeg',
      message: 'プレースホルダー画像を使用（本番では外部サービス連携予定）'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    )
  }
}