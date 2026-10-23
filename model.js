(function (root) {
  const statuses = ['Menunggu', 'Disetujui', 'Ditolak'];
  function validate(item) {
    for (const key of ['name', 'nip', 'type', 'start', 'end', 'reason']) {
      if (typeof item[key] !== 'string' || !item[key].trim()) throw new Error('Semua kolom wajib diisi.');
    }
    for (const key of ['start', 'end']) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item[key]) || !Number.isFinite(Date.parse(item[key])) || new Date(item[key]).toISOString().slice(0, 10) !== item[key]) throw new Error('Tanggal tidak valid.');
    }
    if (item.end < item.start) throw new Error('Tanggal selesai tidak boleh sebelum tanggal mulai.');
    if (!['Sakit', 'Keperluan keluarga', 'Dinas', 'Lainnya'].includes(item.type)) throw new Error('Jenis izin tidak valid.');
    if (!statuses.includes(item.status)) throw new Error('Status tidak valid.');
    if (item.name.length > 100 || item.nip.length > 40 || item.reason.length > 1000) throw new Error('Isian terlalu panjang.');
    return item;
  }
  function days(item) { return Math.round((Date.parse(item.end) - Date.parse(item.start)) / 86400000) + 1; }
  function csv(items) {
    const cell = value => '"' + String(value).replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"', '""') + '"';
    return '\uFEFF' + [['Nama', 'NIP', 'Jenis', 'Mulai', 'Selesai', 'Hari kalender', 'Alasan', 'Status'], ...items.map(x => [x.name, x.nip, x.type, x.start, x.end, days(x), x.reason, x.status])].map(row => row.map(cell).join(',')).join('\r\n');
  }
  const api = {validate, days, csv};
  if (typeof module !== 'undefined') module.exports = api;
  else root.PermitModel = api;
})(globalThis);
