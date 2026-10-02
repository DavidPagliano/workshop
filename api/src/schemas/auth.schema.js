const { z } = require('zod');

const loginSchema = z.object({
  username: z.string().trim().min(3, 'El usuario debe tener al menos 3 caracteres').max(20),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(128),
});

const registerUserSchema = z.object({
  username: z.string().trim().min(3, 'El usuario debe tener al menos 3 caracteres').max(20),
  email: z.string().trim().email('Debe ser un correo válido').max(254),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(128),
  role: z.enum(['admin', 'staff_registracion', 'staff_bedele', 'director']).default('staff_registracion'),
});

// Schema público: descarta campos no permitidos (como role) para evitar privilege escalation
const publicRegisterSchema = z.object({
  username: z.string().trim().min(3, 'El usuario debe tener al menos 3 caracteres').max(20),
  email: z.string().trim().email('Debe ser un correo válido').max(254),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(128),
});

const updateUserStatusSchema = z.object({
  activo: z.boolean(),
}).strict();

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres').max(128),
}).strict();

module.exports = {
  loginSchema,
  registerUserSchema,
  publicRegisterSchema,
  updateUserStatusSchema,
  resetPasswordSchema,
};