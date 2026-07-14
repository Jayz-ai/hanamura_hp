# 花村紅 公式サイト — 詳細技術ドキュメント

このドキュメントは Codex への開発引き継ぎ用の詳細技術リファレンスです。
`AGENTS.md` に記載の概要を補完する、より詳細な技術情報を提供します。

---

## 1. アーキテクチャ概要

```
┌──────────────────────────────────────────────────────────┐
│                    GitHub Pages (本番)                     │
│   https://jayz-ai.github.io/hanamura_hp/                  │
│   静的HTML/CSS/JS/画像をそのまま配信                        │
└────────────────────────────┬─────────────────────────────┘
                             │ git push → GitHub Actions
                             │ (.github/workflows/static.yml)
┌────────────────────────────┴─────────────────────────────┐
│                    ローカル開発環境                         │
│                                                           │
│  ┌─────────────┐    ┌──────────────────────────────────┐ │
│  │ admin_server │    │        静的ファイル群               │ │
│  │  (Node.js)  │    │  index.html / css/ / js/ / images/ │ │
│  │  Port: 8080 │───▶│  data/news.json                    │ │
│  └─────────────┘    └──────────────────────────────────┘ │
│        │                                                   │
│  ┌─────┴───────┐                                          │
│  │ admin/ (Vue3)│  管理パネル                               │
│  └─────────────┘                                          │
└──────────────────────────────────────────────────────────┘
```

### 設計思想
- **ゼロ依存**: npm/package.json を使わず、Node.js 標準ライブラリのみでサーバー構築
- **SSG風ワークフロー**: 管理ツールが `index.html` を直接書き換え → git push → GitHub Pages が自動デプロイ
- **デュアルモード**: ローカルでは管理サーバーが管理画面+プレビュー+API提供、本番は静的配信

---

## 2. ファイル詳細リファレンス

### 2.1 index.html（メインページ — 621行）

単一ページ構成（SPA風）。以下のセクションで構成:

| セクション | HTML ID | 主な内容 |
|---|---|---|
| Hero | `#hero` | パララックス風KV画像 + iTunes 2位バッジ + スクロールインジケーター |
| News | `#news` | 最新ニュース3件。`<!-- NEWS_START -->` 〜 `<!-- NEWS_END -->` マーカー内 |
| Profile | `#profile` | プロフィール画像＋テキスト＋公式リンク集 |
| Video | `#video` | 「紅の恋路」MV（ローカルmp4 + YouTubeリンク） |
| Works | `#works` | 楽曲カード3枚（紅の恋路, 恋☆紅葉, ライジング☆サン！） |
| Music | `#music` | Bandcamp/LinkCoreへのリンク（ランダムサムネイル表示） |
| Goods | `#goods` | SUZURI物販リンク（ランダムグッズ画像表示） |
| Gallery | `#gallery` | 6枚のギャラリー画像グリッド |
| Footer | — | ロゴ, X/YouTube SNSリンク, コピーライト |
| News Modal | `#news-modal` | ニュースクリック時のモーダルオーバーレイ |

#### SEO 実装一覧
- `<head>` 内に Schema.org JSON-LD 構造化データ（MusicGroup, MusicRecording ×3, VideoObject ×3, WebSite, WebPage）
- OGP メタタグ（og:type, og:url, og:title, og:description, og:image）
- Twitter Card メタタグ（summary_large_image）
- `<link rel="canonical">` 設定済み
- `<h1>` は `.visually-hidden` で非表示配置（SEO用）
- 全画像に `width` `height` `loading="lazy"` `decoding="async"` 指定

#### 公式リンク一覧（コード内ハードコード）
| サービス | URL |
|---|---|
| YouTube | https://www.youtube.com/@BeniHanamura.official |
| X (Twitter) | https://x.com/BeniHanaCyber |
| LinkCore | https://linkco.re/AvRQasue |
| note | https://note.com/shay_prinix/n/n3f71d41431b6 |
| Bandcamp | https://jayz-blutaz.bandcamp.com/ |
| SUZURI | https://suzuri.jp/HanamuraBeni |

---

### 2.2 css/style.css（1192行）

**デザインテーマ**: 「着物の白いシルク生地と牡丹柄」

#### CSS カスタムプロパティ（`:root`）
```css
--color-silk-light: #fdfdfd;     /* 背景（明） */
--color-silk-dark: #f0ecec;      /* 背景（暗） */
--color-botan-red: #B51322;      /* 深紅 — メインアクセント */
--color-botan-pink: #E85B75;     /* ピンク — サブアクセント */
--color-gold: #c5a867;           /* 箔押し風アクセント */
--color-text-main: #221f1f;      /* 本文テキスト */
--color-text-sub: #555151;       /* サブテキスト */
--font-serif: 'Noto Serif JP', serif;   /* 和文明朝体 */
--font-cyber: 'Orbitron', sans-serif;   /* 英字サイバー風 */
--transition-smooth: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
```

#### CSSアニメーション
| 名前 | 対象 | 効果 |
|---|---|---|
| `silkFlow` | `.silk-background` | グラデーション背景のゆらぎ |
| `floating` | `.badge-container` | iTunes 2位バッジの上下揺れ |
| `scrollLine` | `.scroll-line::before` | スクロールインジケーターのライン流れ |
| `reveal-on-scroll` → `is-visible` | 各セクション | フェードイン + 上方向スライド |

#### レスポンシブブレークポイント
| 幅 | 主な変更 |
|---|---|
| ≤ 1100px | ナビのフォント縮小、gap縮小 |
| ≤ 992px | Profile 1カラム化、Gallery 2カラム、Works 1カラム |
| ≤ 768px | ナビ非表示、Gallery 1カラム、モバイルKV画像に切替、`100svh` 使用 |

#### 重要な CSS クラス
| クラス | 用途 |
|---|---|
| `.image-frame` | 和風画像フレーム（金縁ボーダー + ボックスシャドウ） |
| `.reveal-on-scroll` | スクロールリビールアニメーション対象 |
| `.visually-hidden` | SEO用非表示テキスト |
| `.section` | 各セクション共通のパディング・レイアウト |
| `.container` | 最大幅1200pxの中央寄せコンテナ |

---

### 2.3 js/script.js（234行）

`DOMContentLoaded` 内で以下を初期化:

1. **ヘッダースクロール** — `window.scrollY > 50` で `.scrolled` クラス付与
2. **スクロールリビール** — `.reveal-on-scroll` 要素の出現判定（scrollイベント監視）
3. **スムーススクロール** — ナビのアンカーリンク対応
4. **音源サムネイルランダム** — `#random-music-img-1`, `#random-music-img-2` に7枚から2枚選択
5. **グッズ画像ランダム** — `#random-goods-img` に連番画像から1枚選択（存在チェック付き）
6. **NEWSモーダル** — `.news-item` クリック → `.news-detail-content` をモーダル表示

#### ユーティリティ関数
- `runWhenNearViewport(element, callback)` — IntersectionObserver で要素が近くに来たら処理実行（rootMargin: 600px）

---

### 2.4 js/particles.js（197行）

花びらパーティクルアニメーション（Canvas 2D）:

- **`Petal` クラス**: ベジェ曲線で花びら形状を描画、z値で奥行き感（サイズ/速度/ぼかし制御）
- **色バリエーション**: 5色（深紅 → ピンク系）
- **数**: PC 40個 / モバイル 18個
- **パフォーマンス最適化**:
  - `prefers-reduced-motion` 対応（無効化）
  - 初期描画を12秒遅延（`PARTICLE_START_DELAY_MS`）
  - ユーザー操作（scroll/pointerdown/touchstart/keydown）で即時開始
  - `requestIdleCallback` 使用
  - `visibilitychange` でタブ非表示時に停止
  - リサイズ時にパーティクル数再計算

---

### 2.5 管理パネル（admin/）

#### admin_server.js（176行）— バックエンドサーバー

| エンドポイント | メソッド | 処理 |
|---|---|---|
| `/api/news` | GET | `data/news.json` を読み込んで返却 |
| `/api/news` | POST | `data/news.json` へ保存 + `index.html` の NEWS マーカー間を自動書き換え |
| `/api/deploy` | POST | `git add . && git commit -m "Update NEWS via Admin Tool" && git push` 実行 |
| `/` | GET | `admin/index.html` を配信 |
| `/preview` | GET | `index.html`（メインページ）を配信 |

**特殊処理:**
- `[IMAGE: xxx.jpg]` → `<img src="images/xxx.jpg">` 自動変換
- テキストの改行 → `<br>` 変換
- HTMLエスケープ関数（`escapeHtml`）
- 日本語ファイル名対応（`decodeURIComponent`）

#### admin/index.html + app.js（Vue 3 Composition API）

**状態変数:**
- `newsList` — 全記事リスト
- `currentTab` — `'public'` or `'archive'`
- `editingItem` / `editingForm` — 編集中の記事
- `isDeploying` — デプロイ中フラグ

**記事ステータス:**
| ステータス | 表示 | 意味 |
|---|---|---|
| `public` | 公開中 | index.html に反映される（最大3件） |
| `hidden` | 非公開 | 管理画面でのみ表示 |
| `archive` | アーカイブ | アーカイブタブに移動 |

---

### 2.6 data/news.json

記事データの JSON 配列。各オブジェクトの構造:

```json
{
  "id": "news-3",
  "date": "2026.03.22",
  "title": "公式サイトオープンのお知らせ",
  "content": "記事本文。[IMAGE: ファイル名] で画像挿入。\\n で改行。",
  "status": "public"
}
```

現在の記事一覧:
| ID | 日付 | タイトル | ステータス |
|---|---|---|---|
| news-1 | 2026.04.15 | 花村紅 1st VRライブ『紅の宴』開催決定！ | archive |
| news-3 | 2026.03.22 | 公式サイトオープンのお知らせ | public |
| news-4 | 2025.10.24 | 『紅の恋路』MV制作ノートを公開しました | public |
| news-2 | 2025.10.17 | デビュー曲『紅の恋路』が各種ストリーミング配信開始 | public |

---

## 3. Git / デプロイ情報

- **リモート**: `origin` → `https://github.com/Jayz-ai/hanamura_hp.git`
- **メインブランチ**: `main`（`master` も存在、`HEAD` は `master`）
- **デプロイトリガー**: `main` or `master` へのpush → GitHub Actions → GitHub Pages

### 最近のコミット履歴
```
3f8a50c Optimize mobile images and defer particles
1fee8f6 Add works index and video sitemap
8db3416 Improve homepage SEO links and assets
7b0bbeb Optimize mobile homepage assets
b043279 Add canonical and structured data
8317baf Update official site music links and chart copy
73df489 Update NEWS via Admin Tool
e588fca YouTubeイメージムービーのURLを更新
5550077 Update Music section title to 音源試聴
2f7c4ef Update NEWS via Admin Tool
```

---

## 4. 画像アセット

| ディレクトリ | ファイル数 | 形式 | 用途 |
|---|---|---|---|
| `images/` (root) | 14 | webp, jpg, png | KV画像, フッター画像, OGP画像, ポスター |
| `images/favicon/` | 6 | png, ico | ファビコン |
| `images/gallery/` | 13 | webp, png | ギャラリー（現在6枚表示） |
| `images/goods/` | 5 | png | グッズ画像（goods01-05.png, 連番式） |
| `images/music_thmb/` | 7 | jpg | 音源サムネイル（music_01-07.jpg） |
| `images/MVclip/` | 1 | mp4 | MV短縮クリップ |
| `images/profile/` | 2 | webp | プロフィール画像（通常版 + 960px版） |
| `images/icon/` | 1 | png | アイコン素材 |
| `lovart_output/` | 4 | png | AI生成画像（未使用素材） |
| `audio/` | 0 | — | 将来使用予定の空ディレクトリ |

### 画像追加ルール
- **グッズ画像**: `images/goods/goods{NN}.png` の連番で追加（自動検出される）
- **音源サムネイル**: `images/music_thmb/music_{NN}.jpg` — 追加時は `js/script.js` の配列も更新が必要
- **ギャラリー画像**: `images/gallery/` に配置し、`index.html` のギャラリーセクションに `<div class="gallery-item image-frame">` を追加
- **推奨形式**: WebP（レスポンシブの場合は `<picture>` で切替）

---

## 5. 外部サービス連携

| サービス | 用途 | 備考 |
|---|---|---|
| GitHub Pages | ホスティング | 自動デプロイ |
| Google Search Console | SEO | `google03dabf0fb8e7fa11.html` で認証 |
| Google Fonts | フォント配信 | Noto Serif JP + Orbitron |
| YouTube | MV配信 | 埋め込みリンク |
| LinkCore | 配信リンク集約 | https://linkco.re/AvRQasue |
| Bandcamp | 音源販売 | https://jayz-blutaz.bandcamp.com/ |
| SUZURI | グッズ販売 | https://suzuri.jp/HanamuraBeni |
| X (Twitter) | SNS | @BeniHanaCyber |

---

## 6. よくある開発タスクの手順

### 新しいニュース記事を追加する
1. `data/news.json` に記事オブジェクトを追加
2. ステータスを `"public"` にする（最大3件が表示される）
3. `admin_server.js` を起動して POST `/api/news` で保存するか、直接 `index.html` の `<!-- NEWS_START -->` 〜 `<!-- NEWS_END -->` 間のHTMLを更新

### 新しいギャラリー画像を追加する
1. 画像を `images/gallery/` に配置（WebP推奨）
2. `index.html` の `gallery-grid` 内に以下を追加:
```html
<div class="gallery-item image-frame">
    <img src="images/gallery/新ファイル名.webp" alt="花村紅 ギャラリー X" loading="lazy" decoding="async" width="800" height="1000">
</div>
```

### 新しい楽曲を Works に追加する
1. `index.html` の `works-grid` 内に `work-card` を追加
2. `<head>` 内の JSON-LD 構造化データに `MusicRecording` を追加
3. `sitemap.xml` にビデオ情報を追加（YouTubeがある場合）

### CSSスタイルの変更
- `css/style.css` のみ。外部CSSフレームワークは使用しない
- 新しいCSSプロパティは `:root` に定義してから使用する
- モバイル対応は `@media screen and (max-width: 768px)` 内に記述

---

## 7. 絶対に変更・削除してはいけないもの

| 対象 | 理由 |
|---|---|
| `google03dabf0fb8e7fa11.html` | Google Search Console の所有権認証ファイル |
| `<!-- NEWS_START -->` / `<!-- NEWS_END -->` マーカー | 管理ツールの自動書き換えに必要 |
| `.github/workflows/static.yml` | GitHub Pages 自動デプロイ設定 |
| `manifest.json` のアイコンパス | PWA対応に必要 |
| `<head>` 内の OGP / Twitter Card メタタグ | SNS共有時の表示に影響 |
| `images/favicon/` 配下の全ファイル | ブラウザ/PWA のアイコン表示に必要 |
