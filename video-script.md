# The Last Word デモ動画 — 撮影・TTS完全スクリプト（3分・英語）

## 動画の目的
審査基準（有用性・独創性・実行・思慮深いWebMCP活用・人間-エージェント体験）に刺さるデモを見せる。
「WebMCPで人間が制御を握る＝人間が最後の言葉を持つ」を、具体シナリオで2分半にまとめる。
**核心**: 人間の承認が「ECDSA署名＋改ざん検知ハッシュチェーン台帳」で暗号的に証明される。

## 撮影対象
**https://the-last-word.pages.dev**（Cloudflareにデプロイ済み・動作確認済み）
※ 旧URL webmcp-notary.pages.dev は削除済み。必ず新URLを使うこと。

## 画面収録の手順（土曜・ボスが実施）
1. Chrome/Edgeで https://the-last-word.pages.dev を開く
2. 画面収録ソフト（OBS推奨・インストール済み）で録画開始
3. このスクリプトのナレーション（TTS音声）を再生しながら、画面上の操作を実行
4. 3分以内に収める

## ナレーション（英語・TTSで生成）＋ 画面操作の同期

---

### [0:00-0:12] オープニング（12秒）
**ナレーション**:
"Meet The Last Word. The trust layer for the agentic web. When AI agents act on your behalf, some actions are irreversible. The Last Word keeps a human in control."

**画面**: タイトル画面・「L」ロゴ・見出し「Someone has to be in control.」表示

---

### [0:12-0:40] ユースケース① payment（28秒）
**ナレーション**:
"Imagine you tell your agent to pay an invoice. The agent prepares everything: it fetches the invoice, verifies the amount, and fills the payment form."

**画面**: 指示欄に「Pay invoice #2041 for $1,200 to Acme Corp」と入力 → 「Run agent」をクリック → エージェントの準備ログが順に表示（✓ Invoice found → ✓ Amount checked → ✓ Payee checked）

---

### [0:40-1:00] 承認ゲート（20秒・核心）
**ナレーション**:
"But at the irreversible step, The Last Word pauses. It shows you what you asked for, side by side with what the agent prepared. The amount matches. The payee matches. The agent did the work, but only you have the last word."

**画面**: ⚠️承認カードが出現 → 差分表示（You asked / Agent prepared / ✓ match）をハイライト → **Approve & Sign**をクリック

---

### [1:00-1:30] 監査台帳＋改ざん検知（30秒・★見せ場）
**ナレーション**:
"Once you approve, the action is sealed into a tamper-evident hash chain. Each entry is chained to the one before it, and signed with an ECDSA key. The ledger lives in your browser, so it survives a reload. Now watch this — click Verify integrity, and the app recomputes the entire chain. If anyone — or any agent — tampered with a single record, the chain breaks and it's flagged immediately. That's continuous monitoring, built in."

**画面**: 監査台帳に「AGENT request_approval」「HUMAN APPROVE」「AGENT EXECUTE」が追記される（sha256: + sig: 表示）→ **Verify integrity**をクリック → 「✓ Chain intact — N entries, all signatures valid」が緑で表示

※ 改ざん検出の実演（任意・時間があれば）: DevToolsでIndexedDBの台帳を1エントリ書き換え → Verify integrity → 「✗ TAMPERED」赤字表示。撮影前にリハーサル必須。

---

### [1:30-2:10] ユースケース② delete・拒否（40秒）
**ナレーション**:
"Now imagine a different irreversible action — deleting data. The agent prepares the deletion, but at the gate, The Last Word shows you the target and warns it's permanent. If something looks wrong, you can reject it. The agent is blocked. Nothing happens. The agent does the work, and the human has the last word."

**画面**: 指示欄に「Delete my account and all data」→ Run agent → 承認カード（⚠️ IRREVERSIBLE・Target・Permanent・Recovery: None）→ **Reject**をクリック → 監査台帳に「HUMAN REJECT」→ 「✖ Cancelled. Nothing was executed.」表示

---

### [2:10-2:30] クロージング（20秒）
**ナレーション**:
"The Last Word. Because when agents act on your behalf, someone must be in control. This is a demonstration app — it does not move real money or data. Thank you to OpenAI, Cloudflare, Vercel, Shopify, Google Chrome, Render, and Netlify for making this challenge possible."

**画面**: エンドカード「The Last Word — Human Approval for Irreversible Actions」+ リポジトリURL表示 + 免責・利用規約・privacy表示

---

## TTS音声生成（オープンソース edge-tts）
- 英語ナレーションを edge-tts で生成（例: `en-US-AriaNeural` 女性・明瞭）
- 各パートを別ファイルで生成し、動画編集で画面操作に合わせて配置
- 音声ファイル: C:\Users\hohoh\Desktop\webmcp-notary\video\
- **更新ポイント**: ①URL ②SHA-256→ECDSA+hash-chain ③監査台帳表示 ④2ユースケース ⑤ロゴ ⑥免責

## 注意
- 録画は 3分以内（推奨 2:30-3:00）
- 画面の操作タイミングに合わせてナレーションを配置
- **Verify integrityの改ざん実演は撮影前に必ずリハーサル**（失敗すると台無し）
- YouTubeに公開（アンテプラライセンスは不要・自分の作品）
