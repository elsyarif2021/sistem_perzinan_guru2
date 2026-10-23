const {test} = require('node:test');
const assert = require('node:assert/strict');
const {validate, days, csv} = require('./model');
const item = {name: 'Guru A', nip: '001', type: 'Sakit', start: '2026-10-23', end: '2026-10-25', reason: 'Istirahat', status: 'Menunggu'};
test('validates permit and counts inclusive calendar days', () => { assert.equal(validate(item), item); assert.equal(days(item), 3); });
test('rejects reversed dates and nonexistent dates', () => { assert.throws(() => validate({...item, end: '2026-10-22'})); assert.throws(() => validate({...item, start: '2026-02-30'})); });
test('rejects empty input and invalid status', () => { assert.throws(() => validate({...item, name: ' '})); assert.throws(() => validate({...item, status: 'Unknown'})); });
test('CSV preserves quoted text and neutralizes spreadsheet formula', () => { const result = csv([{...item, name: '=1+1', reason: 'Alasan "khusus"'}]); assert.ok(result.includes('"\'=1+1"')); assert.ok(result.includes('"Alasan ""khusus"""')); });
