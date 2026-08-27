// Notary integration test: verify human-approval flow + real SHA-256 + diff display.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const crypto = require('crypto');

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
const { window } = dom;
const d = window.document;

// jsdom には crypto.subtle が無いため、実ブラウザ同等の Web Crypto をモックする（SHA-256）
window.crypto = window.crypto || {};
window.crypto.subtle = {
  digest: async (algo, data) => {
    const nodeCrypto = require('crypto');
    const hash = nodeCrypto.createHash('sha256').update(Buffer.from(data)).digest();
    return hash.buffer.slice(hash.byteOffset, hash.byteOffset + hash.byteLength);
  }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
function assert(cond, msg) { if (!cond) throw new Error('FAIL: ' + msg); console.log('PASS: ' + msg); }

(async () => {
  // 1. Form exists (WebMCP Declarative API)
  const form = d.getElementById('notaryForm');
  assert(form !== null && form.getAttribute('toolname') === 'notary.approve', 'notary.approve form exists');

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

  // 4. Real SHA-256 hash (not Math.random)
  const approve = d.getElementById('approveBtn');
  // wait for approve to be async; click it
  window.approve();
  await sleep(1200);
  const audit = d.getElementById('audit').textContent;
  const hashMatch = audit.match(/sha256:([0-9a-f]{64})/);
  assert(hashMatch !== null, 'audit has real 64-char SHA-256 hash: ' + (hashMatch ? hashMatch[1].slice(0,12) + '...' : 'NONE'));
  assert(audit.includes('APPROVE'), 'audit records approval');
  assert(audit.includes('EXECUTE'), 'audit records execution');

  console.log('\nALL NOTARY TESTS PASSED — real SHA-256 + diff display + human approval all work.');
})().catch(e => { console.error(e.message); process.exit(1); });
