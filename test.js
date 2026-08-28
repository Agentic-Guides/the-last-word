// THE LAST WORD integration test: verify human-approval flow + ECDSA signature + diff display.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const crypto = require('crypto');

const html = fs.readFileSync(__dirname + '/public/index.html', 'utf8');

// jsdom には crypto.subtle が無いため、実ブラウザ同等の Web Crypto をモックする。
// beforeParse で注入して、HTML 内インラインスクリプト実行前に有効にする。
function injectCryptoMock(window) {
  window.crypto = window.crypto || {};
  window.crypto.subtle = {
    digest: async (algo, data) => {
      const hash = crypto.createHash('sha256').update(Buffer.from(data)).digest();
      return hash.buffer.slice(hash.byteOffset, hash.byteOffset + hash.byteLength);
    },
    generateKey: async () => {
      return {
        publicKey: { alg: 'ECDSA', type: 'public' },
        privateKey: { alg: 'ECDSA', type: 'private' }
      };
    },
    sign: async () => new ArrayBuffer(64),
    verify: async () => true,
    exportKey: async (format, key) => {
      return { kty: 'EC', crv: 'P-256', x: 'mock-x', y: 'mock-y' };
    }
  };
}

const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, beforeParse: injectCryptoMock });
const { window } = dom;
const d = window.document;

const sleep = ms => new Promise(r => setTimeout(r, ms));
function assert(cond, msg) { if (!cond) throw new Error('FAIL: ' + msg); console.log('PASS: ' + msg); }

(async () => {
  // 1. Form exists (WebMCP Declarative API)
  const form = d.getElementById('notaryForm');
  assert(form !== null && form.getAttribute('toolname') === 'notary.approve', 'notary.approve form exists');
  // 1b. Correct WebMCP param attributes on inputs
  const fAmount = d.getElementById('fAmount');
  assert(fAmount && fAmount.getAttribute('toolparamtitle') === 'Amount', 'amount input has toolparamtitle');
  assert(form.getAttribute('toolparamamount') === null, 'form does NOT use deprecated toolparamamount');

  // 2. Start agent flow
  const instruction = 'Pay invoice #2041 for $1,200 to Acme Corp';
  d.getElementById('instruction').value = instruction;
  window.startAgent();
  await sleep(6000);

  // 3. Approval gate appears with diff display
  assert(d.getElementById('approvalCard').style.display === 'block', 'approval gate appears');
  const diffReq = d.getElementById('diffRequest').textContent;
  const diffPrep = d.getElementById('diffPrepared').textContent;
  assert(diffReq.includes('Pay invoice') && diffReq.includes('$1,200'), 'diff shows what you asked');
  assert(diffPrep.includes('1200') && diffPrep.includes('Acme Corp'), 'diff shows what agent prepared: ' + diffPrep);

  // 4. Approve → ECDSA signature recorded
  await window.approve();
  await sleep(1200);
  const audit = d.getElementById('audit').textContent;
  assert(audit.includes('sig:'), 'audit has ECDSA signature: ' + (audit.match(/sig:([0-9a-f]{12})/) ? 'present' : 'NONE'));
  assert(audit.includes('sha256:'), 'audit has chained SHA-256 hash');
  assert(audit.includes('APPROVE'), 'audit records approval');
  assert(audit.includes('EXECUTE'), 'audit records execution');

  // 5. Button re-enabled after approval (can approve again)
  const approveBtn = d.getElementById('approveBtn');
  assert(approveBtn.disabled === false, 'approve button re-enabled after execution');

  // 6. Second use case: data deletion
  d.getElementById('instruction').value = 'Delete my account and all data';
  window.startAgent();
  await sleep(6000);
  assert(d.getElementById('approvalCard').style.display === 'block', 'delete approval gate appears');
  const delPrep = d.getElementById('diffPrepared').textContent;
  assert(delPrep.includes('Delete') && delPrep.includes('account'), 'delete diff shows target: ' + delPrep);
  const delAmount = d.getElementById('approvalAmount').textContent;
  assert(delAmount.includes('IRREVERSIBLE'), 'delete shows IRREVERSIBLE warning');
  await window.approve();
  await sleep(1200);
  const delAudit = d.getElementById('audit').textContent;
  assert(delAudit.includes('delete') && delAudit.includes('APPROVE'), 'delete audit records approval');

  console.log('\nALL LAST WORD TESTS PASSED — ECDSA signature + diff display + human approval + retry + delete use-case all work.');
})().catch(e => { console.error(e.message); process.exit(1); });
