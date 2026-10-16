// The viewer redraws only when the row's attachments change, not on every update to the row.
// Runs index.js in a VM with a fake Grist and DOM: node attachment-viewer/tests/no-flash.test.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const src = readFileSync(fileURLToPath(new URL('../index.js', import.meta.url)), 'utf8');
let fail = 0;
const check = (name, ok) => { if (!ok) { fail++; console.log('  FAIL ' + name); } };

function load() {
  const els = {};
  const el = () => ({ hidden: false, src: '', textContent: '', disabled: false, addEventListener() {} });
  let onRecord = null;
  const fetches = [];
  const ctx = {
    console,
    document: { getElementById: (id) => (els[id] ||= el()) },
    grist: {
      ready() {},
      onRecord(fn) { onRecord = fn; },
      mapColumnNames: (r) => ({ Attachment: r.Label_Artwork_File }),
      docApi: { getAccessToken: async () => ({ token: 't', baseUrl: 'https://db.test/api/docs/d' }) },
    },
    fetch: async (url) => { fetches.push(url); return { ok: true, headers: { get: () => 'application/pdf' }, blob: async () => ({}) }; },
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
  };
  vm.runInNewContext(src, ctx);
  return { fire: (rec) => onRecord(rec), fetches, els };
}

const v = load();
await v.fire({ id: 1, Label_Artwork_File: [1], Progress: '1/9' });
await v.fire({ id: 1, Label_Artwork_File: [1], Progress: '2/9' });
await v.fire({ id: 1, Label_Artwork_File: [1], Active: 'Working...' });
check('status updates on the same row download the file once', v.fetches.length === 1);
check('the PDF stays on screen', v.els.pdfViewer.hidden === false && v.els.pdfViewer.src === 'blob:x');

await v.fire({ id: 2, Label_Artwork_File: [7] });
check('another row with another file redraws', v.fetches.length === 2);
await v.fire({ id: 1, Label_Artwork_File: [1] });
check('going back redraws', v.fetches.length === 3);

const w = load();
await w.fire({ id: 3, Label_Artwork_File: null });
await w.fire({ id: 3, Label_Artwork_File: null, Progress: '1/9' });
check('no attachment: message kept, nothing fetched', w.fetches.length === 0 && w.els.msg.textContent === 'No attachments found.');

console.log(fail ? `${fail} failed` : 'no-flash: all passed');
process.exit(fail ? 1 : 0);
