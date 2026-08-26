// Notary integration test: verify the human-approval flow works.
const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
const { window } = dom;
const d = window.document;

const sleep = ms => new Promise(r => setTimeout(r, ms));
function assert(cond, msg) { if (!cond) throw new Error('FAIL: ' + msg); console.log('PASS: ' + msg); }

(async () => {
  // 1. Page loads with the approval form (WebMCP Declarative API)
  const form = d.getElementById('notaryForm');
  assert(form !== null, 'notary.approve form exists');
  assert(form.getAttribute('toolname') === 'notary.approve', 'form has toolname=notary.approve');

  // 2. Start the agent flow
  d.getElementById('instruction').value = 'Pay invoice #2041 for $1,200 to Acme Corp';
  d.getElementById('step1status').textContent = '';
  window.startAgent();
  await sleep(6000); // wait for the 5 prep steps (600ms each) + margin

  // 3. Approval card should be visible
  const approvalCard = d.getElementById('approvalCard');
  assert(approvalCard.style.display === 'block', 'approval gate appears after agent prepares');
  assert(d.getElementById('approvalAmount').textContent.includes('1,200'), 'approval shows amount');

  // 4. Human approves
  window.approve();
  await sleep(1000);
  const audit = d.getElementById('audit').textContent;
  assert(audit.includes('APPROVE'), 'audit log records human approval');
  assert(audit.includes('EXECUTE'), 'audit log records agent execution');
  assert(audit.includes('hash:'), 'audit log records approval hash');

  // 5. Reject path
  d.getElementById('instruction').value = 'Delete account';
  window.startAgent();
  await sleep(6000);
  window.reject();
  await sleep(200);
  const audit2 = d.getElementById('audit').textContent;
  assert(audit2.includes('REJECT'), 'audit log records human rejection');

  console.log('\nALL NOTARY TESTS PASSED — human approval gate works.');
})().catch(e => { console.error(e.message); process.exit(1); });
