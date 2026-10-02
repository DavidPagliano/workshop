const test = require('node:test');
const assert = require('node:assert/strict');

const {
  eventSchema,
  preCyclePublicSchema,
} = require('../src/schemas/registration.schema');
const {
  loginSchema,
  publicRegisterSchema,
  updateUserStatusSchema,
} = require('../src/schemas/auth.schema');

const validEvent = {
  nombre: 'Ana',
  apellido: 'Perez',
  email: 'ana@example.com',
  dni: '12345678',
  telefono: '123456789',
  temas: 'Fotografía',
};

test('eventSchema acepta un registro valido', () => {
  assert.equal(eventSchema.safeParse(validEvent).success, true);
});

test('eventSchema rechaza campos desconocidos (.strict)', () => {
  const result = eventSchema.safeParse({ ...validEvent, seRegistro: true });
  assert.equal(result.success, false);
});

test('preCyclePublicSchema no permite enviar foto', () => {
  const base = {
    nombre: 'Ana',
    apellido: 'Perez',
    edad: 20,
    fechaNacimiento: '2005-01-01',
    dni: '12345678',
    email: 'ana@example.com',
    telefono: '123456789',
    tituloSecundario: 'si',
    concurreAlgunaIglesias: false,
  };
  assert.equal(preCyclePublicSchema.safeParse(base).success, true);
  assert.equal(preCyclePublicSchema.safeParse({ ...base, foto: 'x' }).success, false);
});

test('loginSchema acota la longitud de la contrasena', () => {
  assert.equal(loginSchema.safeParse({ username: 'admin', password: 'x'.repeat(129) }).success, false);
  assert.equal(loginSchema.safeParse({ username: 'admin', password: 'secreto123' }).success, true);
});

test('publicRegisterSchema descarta el campo role', () => {
  const parsed = publicRegisterSchema.parse({
    username: 'nuevo',
    email: 'n@example.com',
    password: '123456',
    role: 'admin',
  });
  assert.equal(parsed.role, undefined);
});

test('updateUserStatusSchema exige un booleano', () => {
  assert.equal(updateUserStatusSchema.safeParse({ activo: true }).success, true);
  assert.equal(updateUserStatusSchema.safeParse({ activo: 'si' }).success, false);
});
