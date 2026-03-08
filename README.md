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

## 技術スタック

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (認証・DB)
