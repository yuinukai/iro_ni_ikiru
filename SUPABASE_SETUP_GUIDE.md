# 🎨 Supabaseデータベース設定ガイド（超わかりやすい版）

## 📍 ステップ1: Supabaseプロジェクトページへ

1. **Supabaseにログイン後、左側のメニューを見てください**
   - 「SQL Editor」というアイコンを探す（四角いアイコン）
   - クリック！

## 📍 ステップ2: 新しいクエリを作る

1. **「New query」ボタンをクリック**（緑色のボタン）
2. **空白のエディタが開きます**

## 📍 ステップ3: 以下のコードをコピー＆ペースト

```sql
CREATE TABLE articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  published BOOLEAN DEFAULT false,
  category TEXT,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);
```

### 🤔 **これは何？**
記事を保存する「箱」を作っています：
- **id** = 記事の番号（自動で作られる）
- **title** = 記事のタイトル
- **content** = 記事の本文
- **excerpt** = 記事の要約
- **slug** = URLに使う名前
- **published** = 公開するかどうか
- **category** = カテゴリー（塗装技術など）
- **author** = 書いた人
- **created_at** = 作った日時
- **updated_at** = 更新した日時
- **published_at** = 公開した日時

## 📍 ステップ4: 実行する

1. **「Run」ボタンをクリック**（右下の緑のボタン）
2. **「Success」と表示されたら成功！**

## 📍 ステップ5: 確認する

1. **左メニューの「Table Editor」をクリック**
2. **「articles」というテーブルが表示されていればOK！**

## 🎉 完成！

これで記事を保存する場所ができました！

---

## ⚠️ もしエラーが出たら？

### エラー: "table already exists"
→ すでにテーブルがあります。OKです！

### エラー: "permission denied"
→ プロジェクトの設定を確認してください

### その他のエラー
→ コピー＆ペーストが正しくできているか確認

---

## 🔑 次のステップ：環境変数の設定

1. **Supabaseのプロジェクトページで「Settings」をクリック**
2. **「API」をクリック**
3. **以下をコピー：**
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Vercelの設定ページに貼り付け**

完了！🎊