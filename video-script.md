# The Last Word デモ動画 — 撮影・TTS完全スクリプト（3分・英語）

## 動画の目的
審査基準（有用性・独創性・実行・思慮深いWebMCP活用・人間-エージェント体験）に刺さるデモを見せる。
「WebMCPで人間が制御を握る＝人間が最後の言葉を持つ」を、具体シナリオで2分半にまとめる。

## 撮影対象
**https://webmcp-notary.pages.dev**（Cloudflareにデプロイ済み・動作確認済み）

## 画面収録の手順（土曜・ボスが実施）
1. Chrome/Edgeで https://webmcp-notary.pages.dev を開く
2. 画面収録ソフト（OBS推奨・インストール済み）で録画開始
3. このスクリプトのナレーション（TTS音声）を再生しながら、画面上の操作を実行
4. 3分以内に収める

## ナレーション（英語・TTSで生成）＋ 画面操作の同期

---

### [0:00-0:15] オープニング（15秒）
**ナレーション**:
"Meet The Last Word. The trust layer for the agentic web. When AI agents act on your behalf, some actions are irreversible. The Last Word keeps a human in control."

**画面**: タイトル画面・「🗣️ The Last Word」ロゴ・見出し表示

---

### [0:15-0:45] シナリオ開始・エージェントが準備（30秒）
**ナレーション**：
"Imagine you tell your agent to pay an invoice. The agent prepares everything: it fetches the invoice, verifies the amount, and fills the payment form."

**画面**: 指示欄に「Pay invoice #2041 for $1,200 to Acme Corp」と入力 → 「▶ Run agent」をクリック → エージェントの準備ログが順に表示される（✓ Invoice found → ✓ Amount checked → ✓ Payee checked）

---

### [0:45-1:30] 承認ゲート（45秒・核心）
**ナレーション**：
"But at the irreversible step, The Last Word pauses. It shows you what you asked for, side by side with what the agent prepared. The amount matches. The payee matches. You don't have to remember anything. The agent did the work, but only you have the last word."

**画面**: ⚠️承認カードが出現 → **差分表示**（You asked / Agent prepared / ✓ match）をハイライト → **Approve & Sign**をクリック

---

### [1:30-1:55] 監査ログ（25秒）
**ナレーション**：
"Once you approve, the action is executed, and an audit log records exactly who approved what, and when — with a real SHA-256 signature hash."

**画面**: 監査ログに「HUMAN APPROVE」「AGENT EXECUTE」「sha256:...」が追記されるのを表示

---

### [1:55-2:40] 拒否シナリオ（45秒）
**ナレーション**：
"But if something looks wrong, you can reject it. The agent is blocked. Nothing happens. The agent does the work, and the human has the last word."

**画面**: 指示欄に「Delete account」→ Run agent → 承認カード → **Reject**をクリック → 監査ログに「HUMAN REJECT」→ 「✖ Cancelled. Nothing was executed.」表示

---

### [2:40-3:00] クロージング（20秒）
**ナレーション**：
"The Last Word. Because when agents act on your behalf, someone must be in control. Thank you to OpenAI, Cloudflare, Vercel, Shopify, Google Chrome, Render, and Netlify for making this challenge possible."

**画面**: エンドカード「The Last Word — Human Approval for Irreversible Actions」+ リポジトリURL表示

---

## TTS音声生成（オープンソース edge-tts）
- 英語ナレーションを edge-tts で生成（例: `en-US-AriaNeural` 女性・明瞭）
- 各パートを別ファイルで生成し、動画編集で画面操作に合わせて配置
- 音声ファイル: C:\Users\hohoh\Desktop\webmcp-notary\video\

## 注意
- 録画は 3分以内（推奨 2:30-3:00）
- 画面の操作タイミングに合わせてナレーションを配置
- YouTubeに公開（アンテプラライセンスは不要・自分の作品）
