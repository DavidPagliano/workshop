const test = require('node:test');
const assert = require('node:assert/strict');
const { z } = require('zod');

const validateRequest = require('../src/middlewares/validateRequest');

const schema = z.object({ nombre: z.string().min(2) }).strict();

test('reemplaza req.body por datos validos', () => {
  const req = { body: { nombre: 'Ana' } };
  let nextCalled = false;
  validateRequest(schema)(req, {}, () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);
  assert.deepEqual(req.body, { nombre: 'Ana' });
});

test('responde 400 con errores ante datos invalidos', () => {
  const req = { body: { nombre: 'A' } };
  let status;
  let body;
  const res = {
    status(code) {
      status = code;
      return this;
    },
    json(payload) {
      body = payload;
      return this;
    },
  };

  validateRequest(schema)(req, res, () => {});

  assert.equal(status, 400);
  assert.equal(body.message, 'Error de validación de datos');
  assert.equal(body.errors[0].field, 'nombre');
});
