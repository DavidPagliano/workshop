process.env.NODE_ENV ||= 'test';
process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/test';
process.env.JWT_SECRET ||= 'test-secret-with-at-least-32-characters';

const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const authenticateToken = require('../src/middlewares/authMiddleware');
const config = require('../src/config/config');

const runAuth = (authorization) =>
  new Promise((resolve) => {
    authenticateToken({ headers: { authorization } }, {}, (err) => resolve(err));
  });

test('sin token lanza 401', async () => {
  const err = await runAuth(undefined);
  assert.equal(err.statusCode, 401);
});

test('token con firma invalida lanza 401', async () => {
  const token = jwt.sign({ id: '123456789012' }, 'otro-secreto-que-no-coincide-1234567890');
  const err = await runAuth(`Bearer ${token}`);
  assert.equal(err.statusCode, 401);
});

test('token con id invalido lanza 401 sin tocar la BD', async () => {
  const token = jwt.sign({ id: 'no-es-objectid' }, config.jwtSecret, { algorithm: 'HS256' });
  const err = await runAuth(`Bearer ${token}`);
  assert.equal(err.statusCode, 401);
});
