# 🔑 環境変数設定ガイド（超簡単版）

## 📍 環境変数って何？
**家の鍵みたいなもの！**
- データベースに入るための「鍵」
- 管理者だけが知っている「パスワード」

---

## 🏠 ローカル（自分のPC）での設定

### ステップ1: `.env.local`ファイルを作る

1. **メモ帳を開く**（Windowsの場合）
2. **以下をコピペ：**

```
NEXT_PUBLIC_SUPABASE_URL=ここにSupabaseのURLを入れる
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにSupabaseの鍵を入れる
ADMIN_PASSWORD=自分で決めたパスワード
```

3. **ファイル名を`.env.local`にして保存**
   - 保存場所: `iro-ni-ikiru`フォルダの中

### ステップ2: Supabaseから情報を取得

1. **Supabase**にログイン
2. **あなたのプロジェクト**をクリック
3. **左メニューの「Settings」（設定）**をクリック
4. **「API」**をクリック
5. **コピーする：**

#### 📋 コピーする場所：

```
Project URL のところ
https://xxxxxxxxxxxx.supabase.co ← これをコピー

anon public のところ  
eyJhbGciOi....長い文字列.... ← これをコピー
```

### ステップ3: `.env.local`に貼り付け

**例：**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=mysecretpassword123
```

---

## ☁️ Vercel（本番サイト）での設定

### ステップ1: Vercelにログイン

1. **https://vercel.com** を開く
2. **ログイン**
3. **「test」プロジェクト**をクリック

### ステップ2: 環境変数を追加

1. **「Settings」タブ**をクリック
2. **左メニューの「Environment Variables」**をクリック
3. **「Add New」ボタン**をクリック

### ステップ3: 1つずつ追加（3回繰り返す）

#### 1回目：
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://あなたのプロジェクト.supabase.co`
- **「Save」ボタン**

#### 2回目：
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbG...（長い文字列）`
- **「Save」ボタン**

#### 3回目：
- **Key:** `ADMIN_PASSWORD`
- **Value:** `あなたが決めたパスワード`
- **「Save」ボタン**

### ステップ4: 再デプロイ

1. **「Deployments」タブ**をクリック
2. **最新のデプロイメントの「...」メニュー**
3. **「Redeploy」**をクリック
4. **「Redeploy」ボタンで確定**

---

## ✅ チェックリスト

- [ ] Supabaseでプロジェクト作成した
- [ ] データベーステーブル作成した
- [ ] `.env.local`ファイル作成した
- [ ] SupabaseのURLをコピーした
- [ ] Supabaseの鍵をコピーした
- [ ] 管理者パスワードを決めた
- [ ] Vercelに3つの環境変数を追加した
- [ ] 再デプロイした

## 🎉 全部チェックできたら完成！

---

## ⚠️ よくある間違い

### ❌ 間違い例：
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url  ← これはダメ！
```

### ⭕ 正しい例：
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co  ← 実際のURL
```

### 🔐 パスワードの例：
```
ADMIN_PASSWORD=password  ← 簡単すぎる
ADMIN_PASSWORD=MySuper$ecret2024!  ← 良い例！
```

---

## 🆘 困ったときは

1. **スペースが入ってないか確認**
2. **コピペが正しいか確認**
3. **Vercelで再デプロイしたか確認**

それでもダメなら、最初からやり直してみよう！