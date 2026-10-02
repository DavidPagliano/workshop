process.env.NODE_ENV ||= 'test';
process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/test';
process.env.JWT_SECRET ||= 'test-secret-with-at-least-32-characters';

const test = require('node:test');
const assert = require('node:assert/strict');

const validateObjectId = require('../src/middlewares/validateObjectId');
const AppError = require('../src/utils/AppError');

test('acepta un ObjectId valido', () => {
  let error;
  validateObjectId('id')({ params: { id: '507f1f77bcf86cd799439011' } }, {}, (err) => {
    error = err;
  });
  assert.equal(error, undefined);
});

test('rechaza un ObjectId invalido con 400', () => {
  let error;
  validateObjectId('id')({ params: { id: 'no-valido' } }, {}, (err) => {
    error = err;
  });
  assert.ok(error instanceof AppError);
  assert.equal(error.statusCode, 400);
});
