const test = require('node:test');
const assert = require('node:assert/strict');

const parsePagination = require('../src/utils/pagination');

test('sin page ni limit devuelve null (sin paginacion)', () => {
  assert.equal(parsePagination({}), null);
});

test('con page y limit devuelve el rango', () => {
  assert.deepEqual(parsePagination({ page: '2', limit: '10' }), { page: 2, limit: 10 });
});

test('acota el limit a 100', () => {
  assert.deepEqual(parsePagination({ page: '1', limit: '500' }), { page: 1, limit: 100 });
});

test('valores invalidos devuelven undefined', () => {
  assert.equal(parsePagination({ page: '0', limit: '10' }), undefined);
  assert.equal(parsePagination({ page: 'abc', limit: '10' }), undefined);
  assert.equal(parsePagination({ page: '1' }), undefined);
});
