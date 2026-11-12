const { z } = require('zod');

const emergenciaSchema = z.object({
  NombreYApellido: z.string().trim().min(2).max(120),
  Telefono: z.string().trim().min(8).max(25),
  Parentesco: z.string().trim().min(2).max(60),
  Dni: z.string().trim().min(6).max(30),
  Domicilio: z.string().trim().min(2).max(200),
  Localidad: z.string().trim().min(2).max(120),
}).strict();

const obraSocialSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  telefono: z.string().trim().min(8).max(25),
  planMedico: z.string().trim().min(1).max(120),
  NroAfiliado: z.string().trim().min(1).max(60),
}).strict();

const emergenciaMedicaSchema = z.object({
  Nombre: z.string().trim().min(2).max(120),
  Telefono: z.string().trim().min(8).max(25),
  NroAfiliadoAEmergencia: z.string().trim().min(1).max(60),
}).strict();

const familiaDeReferenciaSchema = z.object({
  nombreYApellido: z.string().trim().min(2).max(120),
  domicilio: z.string().trim().min(2).max(200),
  localidad: z.string().trim().min(2).max(120),
  provincia: z.string().trim().min(2).max(120),
  telefono: z.string().trim().min(8).max(25),
  otroTelefono: z.string().trim().min(8).max(25).optional(),
  parentesco: z.string().trim().min(2).max(60),
}).strict();

const fichaMedicaSchema = z.object({
  apellido: z.string().trim().min(2).max(60),
  nombre: z.string().trim().min(2).max(60),
  dni: z.string().trim().min(6).max(30),
  edad: z.number().int().min(1).max(120),
  fechaNacimiento: z.coerce.date(),
  lugarNacimiento: z.string().trim().min(2).max(120),
  grupoSanguineo: z.string().trim().min(1).max(20),
  recibeAlgunTratamientoMedico: z.boolean(),
  cualTratamiento: z.string().trim().max(500).optional(),
  tomasAlgunaMedicacion: z.boolean(),
  cualMedicacion: z.string().trim().max(500).optional(),
  tienesAlergias: z.boolean(),
  cualesAlergias: z.string().trim().max(500).optional(),
  padecesAlgunTrastornoCronico: z.boolean(),
  caulTrastorno: z.string().trim().max(500).optional(),
  otrasEnfermedades: z.string().trim().max(500).optional(),
  EnCasoDeUnaDescomposicionComoActuar: z.string().trim().min(2).max(1000),
  ObraSocial: obraSocialSchema,
  emergenciaMedica: emergenciaMedicaSchema,
  familiaDeReferencia: familiaDeReferenciaSchema,
}).strict();

// El inscriptionId lo genera el servidor (ins-001, ins-002, ...), no se acepta en el body.
const inscriptionSchema = z.object({
  apellido: z.string().trim().min(2).max(60),
  nombre: z.string().trim().min(2).max(60),
  dni: z.string().trim().min(6).max(30),
  fechaNacimiento: z.coerce.date(),
  lugarNacimiento: z.string().trim().min(2).max(120),
  localidad: z.string().trim().min(2).max(120),
  provincia: z.string().trim().min(2).max(120),
  telefono: z.string().trim().min(8).max(25),
  telefonoAlternativo: z.string().trim().min(8).max(25).optional(),
  email: z.string().trim().email('Debe ser un correo válido').max(254),
  añoACursar: z.enum(['1ro', '2do', '3ro']),
  estudiosCursados: z.enum(['secundario completo', 'terciario completo', 'universidad', 'tecnicatura']).optional(),
  tieneTrabajo: z.boolean(),
  direccionLaboral: z.string().trim().max(200).optional(),
  concurreAlgunaIglesia: z.boolean(),
  cualIglesia: z.string().trim().max(120).optional(),
  nombreDelPastor: z.string().trim().max(120).optional(),
  foto: z.string().min(1, 'La foto es obligatoria').max(10000000),
  dniFrente: z.string().min(1, 'La foto de frente del DNI es obligatoria').max(10000000),
  dniDorso: z.string().min(1, 'La foto de dorso del DNI es obligatoria').max(10000000),
  comprobantePago: z.string().min(1, 'El comprobante de pago es obligatorio').max(15000000),
  emergencia: emergenciaSchema,
  fichaMedica: fichaMedicaSchema,
}).strict();

const inscriptionUpdateSchema = inscriptionSchema.partial();

// Formulario público: el candidato completa todo el formulario (incluida la foto)
const inscriptionPublicSchema = inscriptionSchema;

module.exports = {
  inscriptionPublicSchema,
  inscriptionSchema,
  inscriptionUpdateSchema,
  emergenciaSchema,
  obraSocialSchema,
  emergenciaMedicaSchema,
  familiaDeReferenciaSchema,
  fichaMedicaSchema,
};
