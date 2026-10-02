process.env.NODE_ENV ||= 'test';
process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/test';
process.env.JWT_SECRET ||= 'test-secret-with-at-least-32-characters';

const test = require('node:test');
const assert = require('node:assert/strict');

const { errorHandler, notFoundHandler } = require('../src/middlewares/errorHandler');
const AppError = require('../src/utils/AppError');

const makeRes = () => ({
  headersSent: false,
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const handle = (err) => {
  const res = makeRes();
  errorHandler(err, {}, res, () => {});
  return res;
};

test('AppError conserva statusCode y mensaje', () => {
  const res = handle(new AppError('no encontrado', 404));
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { message: 'no encontrado' });
});

test('indice duplicado 11000 -> 409 con el campo', () => {
  const res = handle(Object.assign(new Error('dup'), { code: 11000, keyValue: { dni: '1' } }));
  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /dni/);
});

test('payload demasiado grande -> 413', () => {
  const res = handle(Object.assign(new Error('big'), { type: 'entity.too.large' }));
  assert.equal(res.statusCode, 413);
});

test('ValidationError de Mongoose -> 400 con detalle', () => {
  const err = new Error('v');
  err.name = 'ValidationError';
  err.errors = { email: { path: 'email', message: 'bad' } };
  const res = handle(err);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body.errors, [{ field: 'email', message: 'bad' }]);
});

test('MulterError -> 400', () => {
  const err = Object.assign(new Error('m'), { name: 'MulterError', code: 'LIMIT_FILE_SIZE' });
  const res = handle(err);
  assert.equal(res.statusCode, 400);
});

test('error inesperado 500 oculta el mensaje fuera de desarrollo', () => {
  const res = handle(new Error('secreto interno'));
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.message, 'Error interno del servidor');
});

test('notFoundHandler delega un AppError 404', () => {
  let captured;
  notFoundHandler({ method: 'GET', originalUrl: '/x' }, makeRes(), (err) => {
    captured = err;
  });
  assert.ok(captured instanceof AppError);
  assert.equal(captured.statusCode, 404);
});
