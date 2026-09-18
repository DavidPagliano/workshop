const {z} = require('zod');

// Esquema para el evento general
const eventSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(60, 'El nombre debe tener como máximo 60 caracteres'),
  apellido: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres').max(60, 'El apellido debe tener como máximo 60 caracteres'),
  email: z.string().trim().email('Debe ser un correo válido').max(254),
  dni: z.string().trim().min(6, 'DNI/Pasaporte inválido').max(30),
  telefono: z.string().trim().min(8, 'Número de teléfono inválido').max(25),
  temas: z.enum([
    'Fotografía',
    'Marketing Digital',
    'Diseño',
    'Conexión satelital',
    'Iluminación',
    'Diseño web',
    'Animación con IA',
    'Otros',
    'sin temas',
    'AI',
    'Audio',
    'video',
  ]),
}).strict();

// Esquema para el Pre-Ciclo 2027
const preCycleSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(60),
  apellido: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres').max(60),
  edad: z.number().int().min(1).max(120),
  fechaNacimiento: z.coerce.date(),
  dni: z.string().trim().min(6, 'DNI/Pasaporte inválido').max(30),
  email: z.string().trim().email('Debe ser un correo válido').max(254),
  telefono: z.string().trim().min(8, 'Número de teléfono inválido').max(25),
  foto: z.string().max(200000, 'La foto no puede superar los 200 KB').optional(),
  tituloSecundario: z.enum(['si', 'no', 'incompleto']),
  concurreAlgunaIglesias: z.boolean(),
  cual: z.string().trim().max(120).optional(),
  nombrePastor: z.string().trim().max(120).optional()
}).strict();

// Schemas parciales para PUT (todos los campos opcionales)
const eventUpdateSchema = eventSchema.partial();
const preCycleUpdateSchema = preCycleSchema.partial();

module.exports = {
  eventSchema,
  eventUpdateSchema,
  preCycleSchema,
  preCycleUpdateSchema
};