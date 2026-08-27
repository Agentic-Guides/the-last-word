# THE LAST WORD 修正説明書（deepseek-v4-flash 用）

**目的**: WebMCP Challenge 応募用デモアプリ THE LAST WORD の残りのバグ・弱点を修正する。
**対象者**: deepseek-v4-flash:0731（このファイルだけで完結）
**締切**: 9/4 05:00 JST

---

## 前提

- 作業ディレクトリ: `C:\Users\hohoh\Desktop\webmcp-notary\`
- 最終デプロイ対象: `public/` フォルダ（Cloudflare Pages で `the-last-word.pages.dev` に公開）
- GitHub: `https://github.com/Agentic-Guides/the-last-word`（master ブランチ）
- 既に修正済みのもの:
  - ✅ Try-it 入力欄を textarea に変更（複数行・リサイズ可能）
  - ✅ MIT ライセンス表記をフッターから削除
  - ✅ 免責・利用規約・プライバシーをフッターに追加
  - ✅ ECDSA 署名を実装（`crypto.subtle.sign` / P-256）
  - ✅ approve ボタンの二度押しバグ修正（disabled を再有効化）
  - ✅ XSS 脆弱性修正（`escapeHtml()` 追加・audit ログに user input を入れる前にエスケープ）
  - ✅ WebMCP 記法修正（`toolparamamount`/`toolparampayee` → `toolparamtitle`/`toolparamdescription`）
  - ✅ 旧 URL（webmcp-notary.pages.dev）を新 URL（the-last-word.pages.dev）に全置換
  - ✅ llms.txt / robots.txt / sitemap.xml / 404.html / about/contact/privacy / og.png / .well-known/mcp.json 作成済み

---

## 未解決の問題（これから直すべきもの）

以下は 3人寄れば（multi-agent consensus）で発見された、まだ直してない問題です。

### A-1. ECDSA 署名がエフェメラル（監査証跡として機能しない）

**現状の問題**:
- `initSigningKey()` はページロードごとに新しい ECDSA 鍵ペアを生成する。
- リロードすると公開鍵が変わる → 「誰が承認したか」を後から検証できない。監査ログが「監査証跡」にならない。

**修正方針**: セッションエフェメラルであることを明示するか、永続的な鍵を使う（localStorage / IndexedDB）。ただし demo なので、永続鍵は複雑になりすぎる。**現実的な修正は「UI に「この署名はセッション限定である」と明記すること」**。

**修正場所**: `public/index.html` の該当箇所。

**修正内容**:
- 現在: `// Real ECDSA digital signature via Web Crypto API (P-256)` のコメントと、監査ログの説明文（「Every irreversible action is recorded with a real ECDSA digital signature (P-256) — who approved what, when, and with a verifiable signature.」）。
- 修正後: 「ECD SA signature is **session-scoped** (ephemeral, browser-session only) and for demonstration only. Not a persistent certificate.」と明記。

**完了条件**: 該当箇所を修正し、ブラウザで index.html を開いて approve ボタンを押したときに、監査ログに「session-scoped」の文言が出れば OK。

---

### A-2. 「anyone can verify」は虚偽（公開鍵の export が標準でない）

**現状の問題**:
- `exportPublicKey()` が `jwk.x + jwk.y` を文字列連結して返している（行284）。これは標準的な JWK JSON ではない。
- 監査ログに「pubkey: ...」を表示しているが、外部の誰かがこの文字列から ECDSA 署名を検証することは実質不可能。
- `ecdsaVerify()` 関数は存在するが、一度も呼ばれていない（dead code）。

**修正方針**: (a) 公開鍵を標準の JWK JSON 形式で export するか、(b) 「anyone can verify」という表現を削除して「session-scoped demo signature」と明記する。

**現実的な修正**: (b) を採用（demo なので標準 export は過剰）。

**修正場所**: `public/index.html`

**修正内容**:
1. `exportPublicKey()` 関数を削除するか、あるいは「表示用途のみ・検証用途ではない」ことが分かるようにする。
2. 監査ログの表示から `pubkey:` の行を削除するか、「session pubkey (display only)」と明記する。
3. コメント `// the public key is shown in the audit log so anyone can verify` を削除・修正する。

**完了条件**: 「anyone can verify」に相当する表現がすべて消え、代わりに「session-scoped demo signature」であることが明記される。

---

### A-3. `ecdsaVerify()` が dead code（呼ばれてない）

**現状の問題**: `ecdsaVerify()` 関数は存在するが、どこからも呼ばれていない。審査員が「検証機能がない」と指摘する可能性。

**修正方針**: (a) 実際に検証を行う UI を追加する（複雑）、あるいは (b) `ecdsaVerify()` を削除してコードをシンプルにする。

**現実的な修正**: (b) を採用（demo なので検証 UI は不要。ただし「署名生成」は残す）。

**修正場所**: `public/index.html`

**修正内容**: `ecdsaVerify()` 関数を削除する。

**完了条件**: `ecdsaVerify` がコードベースから消える。

---

### A-4. test.js が root の index.html をテストしている（本番コードをテストしていない）

**現状の問題**:
- `test.js` の行6: `fs.readFileSync(__dirname + '/index.html', 'utf8')` は **root の index.html** を読んでいる。
- しかし本番のコードは `public/index.html` である。
- つまり、テストは**古い SHA-256 版のコードを見ていて、本番の ECDSA 版をテストしていない**。

**修正方針**: `test.js` のパスを `public/index.html` に修正する。さらに test.js のモックを ECDSA に対応させる。

**修正場所**: `test.js`

**修正内容**:
1. 行6の `'/index.html'` → `'/public/index.html'` に変更。
2. jsdom の crypto モック: 現状は `digest`（SHA-256）のみモック。ECDSA の `generateKey` / `sign` / `verify` もモックに追加する必要がある。あるいはテスト方針を変えて「ECDSA 関数が存在するか」を確認するだけにする。

**具体的な修正例**（test.js）:
```js
const html = fs.readFileSync(__dirname + '/public/index.html', 'utf8');
```
そして crypto モックを拡張:
```js
window.crypto.subtle = {
  digest: async (algo, data) => { /* existing SHA-256 mock */ },
  generateKey: async () => ({ /* mock key pair */ }),
  sign: async () => new ArrayBuffer(64), // 64バイトのダミー署名
  verify: async () => true,
};
```

**完了条件**: `node test.js` を実行して ALL TESTS PASSED と出る。

---

### A-5. README.md の不整合（SHA-256 と ECDSA が混在）

**現状の問題**:
- README.md は「real SHA-256 hash」という表現を使っている（行11, 17, 24, 40）。
- しかし実装は ECDSA（P-256）。
- また、機能一覧に「`toolautosubmit`」「`respondWith`」と書いてあるが、これらは実装に存在しない。

**修正方針**: README.md を実装に合わせる。

**修正場所**: `README.md`

**修正内容**:
1. 「real SHA-256 hash」→「session-scoped ECDSA digital signature (P-256)」に置換。
2. 「WebMCP Declarative API (`toolname`, `toolautosubmit`, `respondWith`)」の行を修正: 実際に実装されているのは `toolname` / `tooldescription` / `toolparamtitle` / `toolparamdescription` のみ。`toolautosubmit` と `respondWith` は削除するか「未使用」と明記。
3. YouTube ID のプレースホルダー: `<YOUR_VIDEO_ID>` のまま残す（demo video はまだ撮ってないので、提出前に差し替える旨を明記する）。

**完了条件**: README.md を修正し、実装と一致している。

---

### A-6. WebMCP Declarative API の完全実装（`agentInvoked` / `respondWith`）

**現状の問題**:
- WebMCP の Declarative API を「半分」しか使っていない。`toolname` は実装済みだが、`agentInvoked` チェックや `respondWith` による構造化応答は未実装。
- これにより、審査員（特に Chrome の技術者）が「WebMCP を正しく使っていない」と減点する可能性。

**修正方針**: WebMCP 公式 spec に従い、`agentInvoked` と `respondWith` を追加する。

**注意**: これは中〜大規模な修正。仕様書を参照する必要がある。

**参照 URL**:
- WebMCP GitHub: https://github.com/webmachinelearning/webmcp
- WebMCP Challenge showcase: https://developers.openai.com/showcase?view=webmcp-apps

**修正場所**: `public/index.html` の form 周辺、および submit ハンドラ。

**修正内容**（概要）:
1. `form` タグまたは `input` に適切な属性を追加する（spec を確認）。
2. submit ハンドラで `event.agentInvoked` をチェックし、agent からの呼び出しの場合は `event.respondWith(...)` で構造化レスポンスを返す。

**完了条件**: WebMCP enabled Chrome で agent がこの form を正しく認識し、respondWith 経由で結果を受け取れることを確認する。

---

## 優先順位と推奨順序

1. **必須（提出に必要）**:
   - A-4: test.js のパス修正（5分）
   - A-5: README.md の不整合修正（10分）
   - A-1, A-2: セキュリティ主張の修正（UI に session-scoped 明記）（15分）

2. **推奨（受賞のため）**:
   - A-3: ecdsaVerify() 削除（5分）
   - A-6: WebMCP `agentInvoked` / `respondWith` 実装（応用）

3. **提出直前に必須**:
   - README.md の YouTube ID を実 ID に差し替える（demo video 撮影後）

---

## 検証方法

各修正後に以下を実行して確認：

```bash
# 1. テスト実行
cd C:\Users\hohoh\Desktop\webmcp-notary
node test.js   # ALL TESTS PASSED が出ること

# 2. デプロイ（本番）
cd public
npx wrangler pages deploy . --project-name the-last-word --branch main

# 3. 本番 URL で動作確認
# ブラウザで https://the-last-word.pages.dev を開き、Try it → approve → audit log を確認
```

---

## ファイル一覧（変更対象）

- `public/index.html` — セキュリティ主張の修正、dead code 削除、WebMCP 完全実装
- `test.js` — パス修正、crypto モックの ECDSA 対応
- `README.md` — 表現の修正、YouTube ID プレースホルダーの明記

---

## 参照

- WebMCP spec: https://github.com/webmachinelearning/webmcp
- WebMCP Challenge: https://openai.com/webmcp-challenge/
- OpenAI showcase: https://developers.openai.com/showcase?view=webmcp-apps
- 既存デモ例（showcase）: 3D Modeling / Collaborative Writing / Crossword / Wandernote / Data Exploration
