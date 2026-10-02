const test = require('node:test');
const assert = require('node:assert/strict');

const asyncHandler = require('../src/utils/asyncHandler');

test('deriva el error de una promesa rechazada a next', async () => {
  const boom = new Error('boom');
  const handler = asyncHandler(async () => {
    throw boom;
  });

  await new Promise((resolve) => {
    handler({}, {}, (err) => {
      assert.equal(err, boom);
      resolve();
    });
  });
});

test('ejecuta el handler resuelto sin llamar a next', async () => {
  let called = false;
  let nextCalled = false;
  const handler = asyncHandler(async () => {
    called = true;
  });

  handler({}, {}, () => {
    nextCalled = true;
  });
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(called, true);
  assert.equal(nextCalled, false);
});
