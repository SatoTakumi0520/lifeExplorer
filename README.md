# Life Explorer

他者のルーティンを「借りて」自分の理想の一日を探すライフスタイルアプリ。

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.example` をコピーするだけで **デモモード**（ログイン不要・モックデータ）で動作します。

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いてください。

---

## 動作モード

### デモモード（推奨・ローカル開発用）
`.env.local` に以下を設定：
```
NEXT_PUBLIC_DEMO_MODE=true
```
- Supabaseへの接続をスキップ
- モックデータでアプリ全体を確認可能
- ログイン不要

### 通常モード（Supabase連携）
`NEXT_PUBLIC_DEMO_MODE` を削除または `false` に設定することで、Supabase認証・DBと連携します。

---

---

## Vercel へのデプロイ手順

### 1. Supabase のマイグレーションを適用

Supabase Dashboard → SQL Editor で以下を順番に実行してください：

```
supabase/migrations/001_ai_foundation.sql
supabase/migrations/002_onboarding.sql
supabase/migrations/003_prefecture_and_social_base.sql
supabase/migrations/004_activity_logs.sql
```

### 2. Supabase Auth の設定

Supabase Dashboard → Authentication → URL Configuration：

- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**: `https://your-domain.vercel.app/**`

### 3. Vercel の環境変数を設定

Vercel Dashboard → プロジェクト → Settings → Environment Variables に以下を追加：

| 変数名 | 値 | 備考 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Settings → API |
| `NEXT_PUBLIC_DEMO_MODE` | `false` | 本番では必ず false |

### 4. デプロイ

```bash
# GitHub に push するだけで Vercel が自動デプロイします
git push origin main
```

---

## 技術スタック

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (認証・DB)

---

## リリースロードマップ

| フェーズ | 内容 | 状態 |
|---|---|---|
| **Option A** | Web本番リリース（Supabase連携・Vercelデプロイ） | 🔄 進行中 |
| **Option B** | ソーシャル機能（公開ルーティン・フォロー・いいね） | ⬜ 未着手 |
| **Option C** | モバイルアプリ（Capacitor・App Store申請） | ⬜ 未着手 |
