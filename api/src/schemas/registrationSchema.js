const {z} = require('zod');

// Esquema para el evento general
const eventSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(15, 'El nombre debe tener como máximo 15 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(25, 'El apellido debe tener como máximo 25 caracteres'),
  email: z.string().email('Debe ser un correo válido'),
  dni: z.string().min(6, 'DNI/Pasaporte inválido'),
  telefono: z.string().min(8, 'Número de teléfono inválido').max(15, 'Número de teléfono inválido'),
  registrarId: z.string().min(1, 'El registrarId es requerido'),
  temas: z.enum(['AI', 'Audio', 'video', 'sin temas']),
});

// Esquema para el Pre-Ciclo 2027
const preCycleSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  edad: z.number(),
  fechaNacimiento: z.coerce.date(),
  dni: z.string().min(6, 'DNI/Pasaporte inválido'),
  email: z.string().email('Debe ser un correo válido'),
  telefono: z.string().min(8, 'Número de teléfono inválido'),
  registrarId: z.string().min(1, 'El registrarId es requerido'),
  tituloSecundario: z.enum(['si', 'no', 'incompleto']),
  concurreAlgunaIglesias: z.boolean(),
  cual: z.string().optional()
});

module.exports = {
  eventSchema,
  preCycleSchema
};