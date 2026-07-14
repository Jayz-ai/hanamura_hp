# 花村紅 公式サイト — Codex 開発ガイド

## プロジェクト概要

花村紅（はなむら べに）のアーティスト公式サイト。
18歳の「サイバー演歌歌手」で、グラビアアイドルとしての魅力と演歌の歌唱力を併せ持つAIキャラクター。
iTunes Store「演歌トップソング」日本2位を獲得したデビュー曲「紅の恋路」を持つ。

- **本番URL**: https://jayz-ai.github.io/hanamura_hp/
- **リポジトリ**: Jayz-ai/hanamura_hp
- **デプロイ**: GitHub Pages（`master`/`main` push時に GitHub Actions で自動デプロイ）

## テクノロジースタック

| カテゴリ | 技術 |
|---|---|
| フロントエンド | 純粋 HTML5 + CSS3 + Vanilla JavaScript（フレームワークなし） |
| 管理パネル | Vue 3（CDN版, Composition API） |
| バックエンド | Node.js（標準ライブラリのみ: http, fs, path, child_process） |
| ホスティング | GitHub Pages |
| CI/CD | GitHub Actions（`.github/workflows/static.yml`） |
| フォント | Google Fonts（Noto Serif JP, Orbitron） |
| パッケージ管理 | なし（package.json 不使用、npm 依存ゼロ） |

## コーディング規約

### 言語
- **コード内コメント**: すべて**日本語**で記述すること
- **変数名**: 英語で分かりやすく命名（ローマ字禁止）
- **ドキュメント**: 日本語で記述

### CSS
- CSS カスタムプロパティ（`:root` 変数）を活用すること
- カラーパレットは `css/style.css` の `:root` に定義済み
  - `--color-botan-red: #B51322`（メインアクセント）
  - `--color-botan-pink: #E85B75`
  - `--color-gold: #c5a867`
  - `--color-silk-light: #fdfdfd` / `--color-silk-dark: #f0ecec`
- フォントファミリーは `--font-serif`（和文明朝）と `--font-cyber`（英字Orbitron）
- トランジションは `--transition-smooth` を使用
- レスポンシブ: 3段階ブレークポイント（1100px, 992px, 768px）

### JavaScript
- **フレームワーク不使用** — Vanilla JS のみ
- `DOMContentLoaded` イベント内で初期化
- パフォーマンス重視: `IntersectionObserver`、`requestIdleCallback`、lazy loading を活用

### HTML
- セマンティック HTML5 要素を使用
- 画像には `loading="lazy"` `decoding="async"` `width` `height` を必ず指定
- 新しいセクションには `reveal-on-scroll` クラスを付与（スクロールアニメーション対応）

## ディレクトリ構成

```
├── index.html              # メインページ（621行, SPA風単一ページ）
├── css/style.css            # メインスタイルシート（1192行）
├── js/script.js             # メインスクリプト（234行）
├── js/particles.js          # 花びらパーティクルアニメーション（197行）
├── admin_server.js          # Node.js NEWS管理サーバー（176行）
├── admin/                   # 管理パネル（Vue 3）
│   ├── index.html
│   ├── app.js
│   └── style.css
├── data/news.json           # ニュース記事データ
├── images/                  # 画像アセット（WebP/JPG/PNG）
│   ├── gallery/             # ギャラリー画像
│   ├── goods/               # グッズ画像（連番: goods01-05.png）
│   ├── music_thmb/          # 音源サムネイル（music_01-07.jpg）
│   ├── profile/             # プロフィール画像
│   ├── MVclip/              # ミュージックビデオクリップ（MP4）
│   └── favicon/             # ファビコン類
├── .github/workflows/static.yml  # GitHub Pages デプロイ
├── manifest.json            # PWA マニフェスト
├── sitemap.xml              # サイトマップ（ビデオ対応）
├── robots.txt               # クローラー設定
└── start_admin.bat          # 管理サーバー起動用
```

## 重要な仕組み

### NEWS 管理フロー
1. `start_admin.bat` で `admin_server.js` を起動（ポート8080）
2. ブラウザで `http://localhost:8080/` を開いて管理画面にアクセス
3. 記事の作成・編集 → 保存すると `data/news.json` と `index.html` が自動更新
4. `index.html` 内の `<!-- NEWS_START -->` ～ `<!-- NEWS_END -->` マーカー間が自動書き換え
5. 管理画面の「本番へ反映する」ボタンで `git add/commit/push` → GitHub Pages に自動デプロイ

### 画像の扱い
- レスポンシブ画像: `<picture>` + `<source>` でデスクトップ/モバイル切替
- グッズ画像: 連番 `goods01.png` ～ で、ランダム表示される
- 音源サムネイル: `music_01.jpg` ～ `music_07.jpg` で、ランダム2枚表示
- 新しい画像は WebP 形式推奨

### SEO
- Schema.org 構造化データ（JSON-LD）が `index.html` の `<head>` 内に記述済み
- OGP / Twitter Card メタタグ設定済み
- `sitemap.xml` にビデオサイトマップも含む
- Google Search Console 認証ファイル `google03dabf0fb8e7fa11.html` は削除禁止

## 注意事項

1. **package.json は存在しない** — npm install 不要。Node.js 標準ライブラリのみ使用
2. **`google03dabf0fb8e7fa11.html` を削除しないこと** — Google Search Console の認証ファイル
3. **`<!-- NEWS_START -->` / `<!-- NEWS_END -->` マーカーを変更・削除しないこと** — 管理ツールの自動書き換えに必要
4. **画像の `width`/`height` 属性を省略しないこと** — CLS（レイアウトシフト）対策
5. **`audio/` ディレクトリは将来使用予定の空ディレクトリ** — 削除しないこと
6. **デプロイはmain/masterブランチへのpushで自動実行** — 手動デプロイ不要
