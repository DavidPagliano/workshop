const {z} = require('zod');

// Esquema para el evento general
const eventSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(15, 'El nombre debe tener como máximo 15 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(25, 'El apellido debe tener como máximo 25 caracteres'),
  email: z.string().email('Debe ser un correo válido'),
  dni: z.string().min(6, 'DNI/Pasaporte inválido'),
  telefono: z.string().min(8, 'Número de teléfono inválido').max(15, 'Número de teléfono inválido'),
  temas: z.string().min(3, 'Los temas son requeridos'),
});

// Esquema para el Pre-Ciclo 2027
const preCycleSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  edad: z.number(),
  fechaNacimiento: z.date(),
  dni: z.string().min(6, 'DNI/Pasaporte inválido'),
  email: z.string().email('Debe ser un correo válido'),
  telefono: z.string().min(8, 'Número de teléfono inválido'),
  tituloSecundario: z.string().min(3, 'El título secundario es requerido'),
  concurreAlgunaIglesias: z.boolean(),
  cual: z.string().min(3, 'La institución de origen es requerida')
});

module.exports = {
  eventSchema,
  preCycleSchema
};