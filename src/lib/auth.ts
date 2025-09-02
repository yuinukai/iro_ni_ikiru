import bcrypt from 'bcryptjs'

// 管理者パスワード（環境変数から取得）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'paint-admin-2024'
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10)

export async function verifyPassword(password: string): Promise<boolean> {
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH)
}

export function isAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  return authHeader === `Bearer ${process.env.ADMIN_TOKEN || 'admin-token-2024'}`
}