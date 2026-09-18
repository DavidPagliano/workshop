const { z } = require('zod');

const loginSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const registerUserSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres').max(20),
  email: z.string().email('Debe ser un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['admin', 'staff_registracion', 'staff_bedele', 'director']).default('staff_registracion'),
});

// Schema público: descarta campos no permitidos (como role) para evitar privilege escalation
const publicRegisterSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres').max(20),
  email: z.string().email('Debe ser un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

module.exports = {
  loginSchema,
  registerUserSchema,
  publicRegisterSchema,
};