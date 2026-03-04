# roadmap.md - 実装ロードマップ（2週間スプリント）

## 概要

| Sprint | 期間 | テーマ | ゴール |
|--------|------|--------|--------|
| Sprint 1 | Week 1-2 | SaaS基盤 | Auth + DB + 履歴 + Dashboard + 前回比較 |
| Sprint 2 | Week 3-4 | 拡張機能 | PDF + テンプレートライブラリ + 課金導線UI |

---

## Sprint 1：SaaS基盤（Week 1-2）

### Day 1-2：認証基盤

| # | タスク | 担当ファイル | Done条件 |
|---|-------|------------|---------|
| 1-1 | NextAuth.js (Auth.js v5) の導入 | `auth.ts`, `middleware.ts` | - |
| 1-2 | メール+パスワード認証（CredentialsProvider） | `app/api/auth/[...nextauth]/route.ts` | D-10 |
| 1-3 | Google OAuth認証 | 同上 | D-11 |
| 1-4 | マジックリンク認証（EmailProvider） | 同上 + Resend連携 | D-13 |
| 1-5 | ログイン画面 (S-10) | `app/login/page.tsx` | T-110〜T-116 |
| 1-6 | 新規登録画面 (S-11) | `app/register/page.tsx` | T-100〜T-107 |
| 1-7 | マジックリンク送信完了画面 (S-12) | `app/login/check-email/page.tsx` | T-120〜T-125 |
| 1-8 | 認証ミドルウェア（保護ルート） | `middleware.ts` | T-600〜T-605 |
| 1-9 | グローバルヘッダー (S-00) | `components/Header.tsx` | T-606, T-607 |

**Day 2 終了時のチェックポイント:**
- [x] ログイン/登録/ログアウトが動作する
- [x] 保護ルート（/dashboard, /settings）で未ログイン時リダイレクト
- [x] ヘッダーがログイン状態に応じて切り替わる

### Day 3-4：DB・履歴基盤

| # | タスク | 担当ファイル | Done条件 |
|---|-------|------------|---------|
| 2-1 | Supabase プロジェクト作成 + 接続設定 | `.env.local`, `lib/supabase.ts` | - |
| 2-2 | Prisma スキーマ定義（users, diagnoses, diagnosis_results） | `prisma/schema.prisma` | - |
| 2-3 | マイグレーション実行 | - | - |
| 2-4 | 診断API改修：ログイン時にDB保存 | `app/api/diagnose/route.ts` | D-20 |
| 2-5 | 履歴一覧API | `app/api/history/route.ts` | D-21 |
| 2-6 | 履歴詳細API | `app/api/history/[id]/route.ts` | D-22 |
| 2-7 | 履歴削除API | 同上 (DELETE) | D-23 |
| 2-8 | 未ログイン診断の維持（保存しない） | `app/api/diagnose/route.ts` | D-26 |
| 2-9 | プラン別の履歴件数制限（Free: 3件） | 同上 | D-25, T-209 |

**Day 4 終了時のチェックポイント:**
- [x] ログイン状態で診断→DBに保存される
- [x] 未ログインで診断→保存されない
- [x] 履歴一覧/詳細/削除のAPIが動作する

### Day 5-6：履歴UI + 前回比較

| # | タスク | 担当ファイル | Done条件 |
|---|-------|------------|---------|
| 3-1 | 履歴一覧ページ (S-21) | `app/dashboard/history/page.tsx` | T-202, T-203 |
| 3-2 | 履歴詳細ページ (S-22) | `app/dashboard/history/[id]/page.tsx` | T-203〜T-205 |
| 3-3 | 履歴削除UI（確認ダイアログ） | 同上 | T-206, T-207 |
| 3-4 | 前回比較ロジック（同部署の直前診断を特定） | `lib/comparison.ts` | T-250, T-260, T-261 |
| 3-5 | 改善率スコア算出ロジック | `lib/comparison.ts` | T-252〜T-255 |
| 3-6 | 前回比較セクション（結果画面に追加） | `components/ComparisonSection.tsx` | T-250〜T-258 |
| 3-7 | 比較ページ (S-23) | `app/dashboard/compare/[id]/page.tsx` | T-257, T-258 |
| 3-8 | Free制限：前回比較をPro以上に制限 | `components/ComparisonSection.tsx` | T-259 |
| 3-9 | 診断結果ページの改修（v2拡張反映） | `components/ResultPage.tsx` | D-24 |

**Day 6 終了時のチェックポイント:**
- [x] 履歴一覧→詳細→削除が動作
- [x] 2回目以降の診断で前回比較が表示される
- [x] 改善率スコアが正しく算出される

### Day 7-8：ダッシュボード + 利用制限

| # | タスク | 担当ファイル | Done条件 |
|---|-------|------------|---------|
| 4-1 | ダッシュボードAPI（統計集計） | `app/api/dashboard/route.ts` | - |
| 4-2 | ダッシュボードページ (S-20) | `app/dashboard/page.tsx` | D-25a, T-220〜T-228 |
| 4-3 | 改善スコア推移グラフ（折れ線） | `components/ImprovementChart.tsx` | T-227, T-228 |
| 4-4 | 統計サマリーカード | `components/StatsCards.tsx` | T-222 |
| 4-5 | 空状態UI（診断0件） | `components/EmptyState.tsx` | T-225 |
| 4-6 | 利用制限チェックAPI | `lib/plan-limits.ts` | D-25 |
| 4-7 | 診断ボタンの制限表示 | `components/InputForm.tsx` | T-230〜T-234 |
| 4-8 | 月次カウントリセット処理 | `lib/plan-limits.ts` | T-235 |
| 4-9 | アップグレード導線コンポーネント | `components/UpgradePrompt.tsx` | D-51, T-236 |

**Day 8 終了時のチェックポイント:**
- [x] ダッシュボードに統計・グラフ・最近の診断が表示
- [x] Freeプランの回数/件数制限が正しく動作
- [x] 制限到達時にアップグレード導線が表示

### Day 9-10：アカウント設定 + エラー画面 + 統合テスト

| # | タスク | 担当ファイル | Done条件 |
|---|-------|------------|---------|
| 5-1 | アカウント設定ページ (S-41) | `app/settings/page.tsx` | T-503 |
| 5-2 | アカウント削除機能 | `app/api/account/route.ts` | D-14, T-130〜T-135 |
| 5-3 | エラーページ (S-99) | `app/error/page.tsx` | T-510〜T-515 |
| 5-4 | 404ページ | `app/not-found.tsx` | T-513, T-514 |
| 5-5 | セキュリティ対策（CSRF, 認可チェック） | middleware + API | T-700〜T-705 |
| 5-6 | レスポンシブ調整（全画面） | 各コンポーネント | T-800〜T-806 |
| 5-7 | Sprint 1 の統合テスト | - | 全Sprint1 Done条件 |

**Sprint 1 完了チェックポイント:**
- [x] D-10〜D-26, D-25a が全て満たされている
- [x] T-100〜T-261, T-510〜T-515, T-600〜T-607, T-700〜T-705, T-800〜T-806 が全てパス
- [x] UX-20〜UX-34, UX-43〜UX-46 をチェック

---

## Sprint 2：拡張機能（Week 3-4）

### Day 1-2：PDFレポート

| # | タスク | 担当ファイル | Done条件 |
|---|-------|------------|---------|
| 6-1 | @react-pdf/renderer の導入 | `package.json` | - |
| 6-2 | PDF表紙コンポーネント | `components/pdf/CoverPage.tsx` | D-31 |
| 6-3 | PDFサマリーページ | `components/pdf/SummaryPage.tsx` | T-303 |
| 6-4 | PDF結果テーブルページ | `components/pdf/ResultsPage.tsx` | T-304, T-305 |
| 6-5 | PDF前回比較ページ | `components/pdf/ComparisonPage.tsx` | T-309, T-310 |
| 6-6 | PDF生成API | `app/api/report/[id]/route.ts` | D-30, T-300, T-301 |
| 6-7 | PDFプレビュー画面 (S-35) | `app/report/[id]/page.tsx` | T-302, T-307 |
| 6-8 | Free制限：PDF出力ブロック | `components/ResultPage.tsx` | T-306 |
| 6-9 | 履歴詳細からPDF出力 | `app/dashboard/history/[id]/page.tsx` | T-308 |

**Day 2 終了時のチェックポイント:**
- [x] Proプランで診断結果のPDFがダウンロードできる
- [x] PDFに表紙・サマリー・テーブル・前回比較が含まれる
- [x] Freeプランではブロックされる

### Day 3-5：テンプレートライブラリ

| # | タスク | 担当ファイル | Done条件 |
|---|-------|------------|---------|
| 7-1 | テンプレートデータのシード投入 | `prisma/seed.ts` | - |
| 7-2 | 業種別診断テンプレート一覧 (S-30) | `app/templates/page.tsx` | D-40, T-400 |
| 7-3 | テンプレート適用ロジック（診断ページ連携） | `app/page.tsx` (クエリパラム) | D-41, D-42, T-401〜T-405 |
| 7-4 | 改善テンプレートライブラリ (S-31) | `app/templates/improvement/page.tsx` | D-43, T-410, T-411 |
| 7-5 | 改善テンプレート詳細 (S-32) | `app/templates/improvement/[id]/page.tsx` | D-44, T-412〜T-416 |
| 7-6 | 診断結果→改善テンプレリンク | `components/ResultPage.tsx` | D-45, T-417〜T-419 |
| 7-7 | Free制限（閲覧3種まで） | 各テンプレートページ | T-416 |
| 7-8 | テンプレートのレスポンシブ対応 | 各コンポーネント | T-406, T-420 |

**Day 5 終了時のチェックポイント:**
- [x] 業種別テンプレートから診断ページに業務が反映される
- [x] 改善テンプレートの詳細にツール推薦・手順が表示される
- [x] 診断結果から改善テンプレへのリンクが機能する

### Day 6-7：課金導線UI

| # | タスク | 担当ファイル | Done条件 |
|---|-------|------------|---------|
| 8-1 | 料金プランページ (S-40) | `app/pricing/page.tsx` | D-50, T-500〜T-504 |
| 8-2 | FAQ アコーディオン | `components/FAQ.tsx` | T-504 |
| 8-3 | アップグレード導線の全箇所統合 | 各コンポーネント | D-51 |
| 8-4 | 「14日間無料体験」ボタン（モック） | `app/pricing/page.tsx` | T-502 |
| 8-5 | 設定ページにプラン情報表示 | `app/settings/page.tsx` | T-503 |

> Stripe Checkout 連携（F-52）はこのスプリントでは見送り。
> ボタンUI + モック遷移のみ実装し、Sprint 3 以降で統合する。

**Day 7 終了時のチェックポイント:**
- [x] 料金プランページが3プラン比較で表示される
- [x] 各制限ポイントでアップグレード導線が正しく表示される
- [x] FAQが開閉する

### Day 8-10：統合テスト + UXレビュー + リリース準備

| # | タスク | 担当ファイル | Done条件 |
|---|-------|------------|---------|
| 9-1 | Sprint 2 の全テスト実行 | - | T-300〜T-310, T-400〜T-420, T-500〜T-515 |
| 9-2 | 全画面のレスポンシブ最終確認 | - | D-60, T-800〜T-806 |
| 9-3 | UXチェックリスト全項目確認 | - | UX-20〜UX-72 |
| 9-4 | パフォーマンスチェック | - | D-61, D-62 |
| 9-5 | セキュリティ最終チェック | - | D-64〜D-66 |
| 9-6 | 環境変数の本番設定 | `.env.production` | - |
| 9-7 | Vercelデプロイ + 動作確認 | - | - |
| 9-8 | done_v2.md の判定欄を更新 | `done_v2.md` | 全項目チェック完了 |

**Sprint 2 完了チェックポイント:**
- [x] D-30〜D-51 が全て満たされている
- [x] done_v2.md の全テスト項目がパス
- [x] UXチェックリスト全項目がチェック済み
- [x] 本番環境にデプロイ済み

---

## Sprint 3 以降（バックログ）

| 優先度 | タスク | 想定Sprint |
|--------|-------|-----------|
| 高 | Stripe Checkout 統合（実課金） | Sprint 3 |
| 高 | 年額プラン + トライアル期間管理 | Sprint 3 |
| 中 | Consultantプラン専用機能（部門横断・ホワイトラベル） | Sprint 4 |
| 中 | カスタムテンプレート登録 (Consultant) | Sprint 4 |
| 中 | チームメンバー管理 | Sprint 4 |
| 低 | API提供 (Consultant) | Sprint 5 |
| 低 | メール通知（トライアル終了前等） | Sprint 5 |
| 低 | SEO最適化 + ランディングページ | Sprint 5 |

---

## リスクと対策

| リスク | 影響 | 対策 |
|--------|------|------|
| OpenAI API のレート制限 | 大量診断時にエラー | リトライ + キュー処理 + gpt-4o-mini で軽量化 |
| Supabase 無料枠超過 | DB接続上限 | Pro plan ($25/月) への移行を見越す |
| PDF生成の重さ | 50件で遅い | サーバーサイドで非同期生成 + プログレス表示 |
| 認証の複雑さ | 実装遅延 | マジックリンクを優先、パスワード認証は後回しも可 |
| テンプレートデータの品質 | ユーザー満足度 | 初期は5業種分を手動で高品質作成 |
