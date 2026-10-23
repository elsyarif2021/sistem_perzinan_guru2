const key = 'ruang-izin:v1';
const $ = selector => document.querySelector(selector);
let items = [];
let usable = true;
function notify(message) { $('#message').textContent = message; }
try {
  const stored = JSON.parse(localStorage.getItem(key) || '[]');
  if (!Array.isArray(stored)) throw new Error();
  const ids = new Set();
  stored.forEach(item => { PermitModel.validate(item); if (typeof item.id !== 'string' || ids.has(item.id)) throw new Error(); ids.add(item.id); });
  items = stored;
} catch { usable = false; notify('Data lokal tidak dapat dibaca. Data lama tetap dipertahankan; periksa pengaturan penyimpanan browser.'); }
function save(next) {
  if (!usable) { notify('Penyimpanan tidak tersedia. Perubahan belum disimpan.'); return false; }
  try { localStorage.setItem(key, JSON.stringify(next)); items = next; render(); return true; }
  catch { notify('Gagal menyimpan. Periksa ruang penyimpanan dan izin browser.'); return false; }
}
function visible() { const search = $('#search').value.toLocaleLowerCase('id'); return items.filter(x => (!$('#status').value || x.status === $('#status').value) && (x.name + ' ' + x.nip).toLocaleLowerCase('id').includes(search)); }
function node(tag, text, className) { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; }
function render() {
  $('#total').textContent = items.length;
  for (const [id, status] of [['waiting', 'Menunggu'], ['approved', 'Disetujui'], ['rejected', 'Ditolak']]) $('#' + id).textContent = items.filter(x => x.status === status).length;
  const filtered = visible(); $('#rows').replaceChildren();
  filtered.forEach(item => {
    const row = document.createElement('tr');
    const person = node('td', ''); person.append(node('b', item.name), node('small', item.nip)); row.append(person);
    const type = node('td', item.type); type.append(node('small', item.reason)); row.append(type);
    const dates = node('td', item.start + ' → ' + item.end); dates.append(node('small', PermitModel.days(item) + ' hari kalender')); row.append(dates);
    const status = node('td', ''); status.append(node('span', item.status, 'pill ' + ({Menunggu: 'pending', Disetujui: 'approved', Ditolak: 'rejected'}[item.status]))); row.append(status);
    const actions = node('td', '');
    if (item.status === 'Menunggu') for (const [label, value] of [['Setujui', 'Disetujui'], ['Tolak', 'Ditolak']]) {
      const button = node('button', label, 'small-button'); button.onclick = () => { if (confirm(label + ' pengajuan ' + item.name + '?') && save(items.map(x => x.id === item.id ? {...x, status: value} : x))) notify('Status pengajuan diperbarui.'); }; actions.append(button);
    }
    const remove = node('button', 'Hapus', 'small-button danger'); remove.onclick = () => { if (confirm('Hapus permanen pengajuan ' + item.name + '?') && save(items.filter(x => x.id !== item.id))) notify('Pengajuan dihapus.'); }; actions.append(remove); row.append(actions); $('#rows').append(row);
  });
  $('#empty').hidden = filtered.length > 0;
  $('#empty').textContent = items.length ? 'Tidak ada pengajuan yang sesuai pencarian.' : 'Belum ada pengajuan. Mulai dengan mengisi formulir di bawah.';
  $('#count').textContent = 'Menampilkan ' + filtered.length + ' dari ' + items.length + ' pengajuan';
}
$('#form').addEventListener('submit', event => {
  event.preventDefault();
  const item = Object.fromEntries([...new FormData(event.target)].map(([k, v]) => [k, v.trim()]));
  Object.assign(item, {id: crypto.randomUUID(), status: 'Menunggu'});
  try { PermitModel.validate(item); } catch (error) { notify(error.message); return; }
  if (save([item, ...items])) { event.target.reset(); notify('Pengajuan berhasil disimpan.'); }
});
$('#search').addEventListener('input', render); $('#status').addEventListener('change', render);
$('#export').onclick = () => {
  const url = URL.createObjectURL(new Blob([PermitModel.csv(visible())], {type: 'text/csv;charset=utf-8;'}));
  const link = document.createElement('a'); link.href = url; link.download = 'rekap-izin-guru.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};
window.addEventListener('storage', event => { if (event.key === key) location.reload(); });
render();
