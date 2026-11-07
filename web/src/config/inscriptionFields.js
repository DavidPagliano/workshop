// Configuración del formulario de inscripción TSM 2027.
// Es la fuente única de verdad para renderizar los pasos y validarlos.
// Estructura alineada con api/src/models/Inscription.js.
//
// kind: name | text | textarea | digits | phone | email | date | select | switch
// showIf(form): si devuelve false, el campo no se muestra, no se valida y no se envía.

export const AÑOS_A_CURSAR = [
  { value: "1ro", label: "1er año" },
  { value: "2do", label: "2do año" },
  { value: "3ro", label: "3er año" },
];

export const ESTUDIOS_CURSADOS = [
  { value: "secundario completo", label: "Secundario completo" },
  { value: "terciario completo", label: "Terciario completo" },
  { value: "universidad", label: "Universidad" },
  { value: "tecnicatura", label: "Tecnicatura" },
];

export const GRUPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-", "No sabe"].map(
  (value) => ({ value, label: value }),
);

// ── PASO 2: DATOS PRINCIPALES ──
export const PERSONAL_SECTIONS = [
  {
    title: "Datos personales",
    fields: [
      { name: "nombre", label: "Nombre", kind: "name", required: true, min: 2, max: 60, half: true, placeholder: "Ej: Juan Carlos", autoComplete: "given-name" },
      { name: "apellido", label: "Apellido", kind: "name", required: true, min: 2, max: 60, half: true, placeholder: "Ej: Pérez", autoComplete: "family-name" },
      { name: "dni", label: "DNI / Documento", kind: "digits", required: true, min: 6, max: 10, half: true, placeholder: "Ej: 39123456", helper: "Entre 6 y 10 números, sin puntos." },
      { name: "fechaNacimiento", label: "Fecha de nacimiento", kind: "date", required: true, half: true },
      { name: "lugarNacimiento", label: "Lugar de nacimiento", kind: "text", required: true, min: 2, max: 120, half: true, placeholder: "Ej: Rosario, Santa Fe" },
      { name: "localidad", label: "Localidad", kind: "text", required: true, min: 2, max: 120, half: true, placeholder: "Ej: Rosario" },
      { name: "provincia", label: "Provincia", kind: "text", required: true, min: 2, max: 120, half: true, placeholder: "Ej: Santa Fe" },
    ],
  },
  {
    title: "Contacto",
    fields: [
      { name: "telefono", label: "Teléfono", kind: "phone", required: true, half: true, placeholder: "Ej: 3411234567", autoComplete: "tel" },
      { name: "telefonoAlternativo", label: "Teléfono alternativo", kind: "phone", half: true, placeholder: "Ej: 3417654321" },
      { name: "email", label: "Correo electrónico", kind: "email", required: true, max: 100, placeholder: "Ej: ejemplo@gmail.com", autoComplete: "email" },
    ],
  },
  {
    title: "Estudios y trabajo",
    fields: [
      { name: "añoACursar", label: "Año a cursar", kind: "select", required: true, options: AÑOS_A_CURSAR, half: true },
      { name: "estudiosCursados", label: "Estudios cursados", kind: "select", options: ESTUDIOS_CURSADOS, half: true, helper: "Opcional." },
      { name: "tieneTrabajo", label: "¿Tenés trabajo actualmente?", kind: "switch" },
      { name: "direccionLaboral", label: "Dirección laboral", kind: "text", required: true, max: 200, placeholder: "Ej: Av. Pellegrini 1234", showIf: (f) => f.tieneTrabajo },
    ],
  },
  {
    title: "Iglesia",
    fields: [
      { name: "concurreAlgunaIglesia", label: "¿Concurrís a alguna iglesia?", kind: "switch" },
      { name: "cualIglesia", label: "¿A cuál iglesia?", kind: "text", required: true, min: 2, max: 120, half: true, placeholder: "Ej: Iglesia Central", showIf: (f) => f.concurreAlgunaIglesia },
      { name: "nombreDelPastor", label: "Nombre del pastor", kind: "name", required: true, min: 2, max: 120, half: true, placeholder: "Ej: Roberto Martínez", showIf: (f) => f.concurreAlgunaIglesia },
    ],
  },
  {
    title: "Contacto de emergencia",
    fields: [
      { name: "emergencia.NombreYApellido", label: "Nombre y apellido", kind: "name", required: true, min: 2, max: 120, half: true },
      { name: "emergencia.Parentesco", label: "Parentesco", kind: "text", required: true, min: 2, max: 60, half: true, placeholder: "Ej: Madre" },
      { name: "emergencia.Telefono", label: "Teléfono", kind: "phone", required: true, half: true },
      { name: "emergencia.Dni", label: "DNI", kind: "digits", required: true, min: 6, max: 10, half: true },
      { name: "emergencia.Domicilio", label: "Domicilio", kind: "text", required: true, min: 2, max: 200, half: true },
      { name: "emergencia.Localidad", label: "Localidad", kind: "text", required: true, min: 2, max: 120, half: true },
    ],
  },
];

// ── PASO 3: FICHA MÉDICA ──
// nombre, apellido, dni, fecha/lugar de nacimiento y edad se copian del paso 2.
export const MEDICAL_SECTIONS = [
  {
    title: "Salud",
    fields: [
      { name: "fichaMedica.grupoSanguineo", label: "Grupo sanguíneo", kind: "select", required: true, options: GRUPOS_SANGUINEOS, half: true },
      { name: "fichaMedica.recibeAlgunTratamientoMedico", label: "¿Recibís algún tratamiento médico?", kind: "switch" },
      { name: "fichaMedica.cualTratamiento", label: "¿Cuál tratamiento?", kind: "textarea", required: true, min: 2, max: 500, showIf: (f) => f.fichaMedica.recibeAlgunTratamientoMedico },
      { name: "fichaMedica.tomasAlgunaMedicacion", label: "¿Tomás alguna medicación?", kind: "switch" },
      { name: "fichaMedica.cualMedicacion", label: "¿Cuál medicación?", kind: "textarea", required: true, min: 2, max: 500, showIf: (f) => f.fichaMedica.tomasAlgunaMedicacion },
      { name: "fichaMedica.tienesAlergias", label: "¿Tenés alergias?", kind: "switch" },
      { name: "fichaMedica.cualesAlergias", label: "¿Cuáles alergias?", kind: "textarea", required: true, min: 2, max: 500, showIf: (f) => f.fichaMedica.tienesAlergias },
      { name: "fichaMedica.padecesAlgunTrastornoCronico", label: "¿Padecés algún trastorno crónico?", kind: "switch" },
      { name: "fichaMedica.caulTrastorno", label: "¿Cuál trastorno?", kind: "textarea", required: true, min: 2, max: 500, showIf: (f) => f.fichaMedica.padecesAlgunTrastornoCronico },
      { name: "fichaMedica.otrasEnfermedades", label: "Otras enfermedades", kind: "textarea", max: 500, helper: "Opcional." },
      { name: "fichaMedica.EnCasoDeUnaDescomposicionComoActuar", label: "En caso de una descompensación, ¿cómo actuar?", kind: "textarea", required: true, min: 2, max: 1000 },
    ],
  },
  {
    title: "Obra social",
    fields: [
      { name: "fichaMedica.ObraSocial.nombre", label: "Obra social", kind: "text", required: true, min: 2, max: 120, half: true, placeholder: "Ej: OSDE" },
      { name: "fichaMedica.ObraSocial.planMedico", label: "Plan médico", kind: "text", required: true, min: 1, max: 120, half: true },
      { name: "fichaMedica.ObraSocial.NroAfiliado", label: "N° de afiliado", kind: "text", required: true, min: 1, max: 60, half: true },
      { name: "fichaMedica.ObraSocial.telefono", label: "Teléfono de la obra social", kind: "phone", required: true, half: true },
    ],
  },
  {
    title: "Servicio de emergencia médica",
    fields: [
      { name: "fichaMedica.emergenciaMedica.Nombre", label: "Servicio de emergencia", kind: "text", required: true, min: 2, max: 120, half: true, placeholder: "Ej: ECCO" },
      { name: "fichaMedica.emergenciaMedica.Telefono", label: "Teléfono", kind: "phone", required: true, half: true },
      { name: "fichaMedica.emergenciaMedica.NroAfiliadoAEmergencia", label: "N° de afiliado", kind: "text", required: true, min: 1, max: 60, half: true },
    ],
  },
  {
    title: "Familia de referencia",
    fields: [
      { name: "fichaMedica.familiaDeReferencia.nombreYApellido", label: "Nombre y apellido", kind: "name", required: true, min: 2, max: 120, half: true },
      { name: "fichaMedica.familiaDeReferencia.parentesco", label: "Parentesco", kind: "text", required: true, min: 2, max: 60, half: true },
      { name: "fichaMedica.familiaDeReferencia.domicilio", label: "Domicilio", kind: "text", required: true, min: 2, max: 200, half: true },
      { name: "fichaMedica.familiaDeReferencia.localidad", label: "Localidad", kind: "text", required: true, min: 2, max: 120, half: true },
      { name: "fichaMedica.familiaDeReferencia.provincia", label: "Provincia", kind: "text", required: true, min: 2, max: 120, half: true },
      { name: "fichaMedica.familiaDeReferencia.telefono", label: "Teléfono", kind: "phone", required: true, half: true },
      { name: "fichaMedica.familiaDeReferencia.otroTelefono", label: "Otro teléfono", kind: "phone", half: true },
    ],
  },
];

export const INSCRIPTION_STEPS = [
  { key: "foto", label: "Foto", sections: [] },
  { key: "personal", label: "Datos principales", sections: PERSONAL_SECTIONS },
  { key: "medica", label: "Ficha médica", sections: MEDICAL_SECTIONS },
];

export const ALL_FIELDS = INSCRIPTION_STEPS.flatMap((step) =>
  step.sections.flatMap((section) => section.fields),
);

export const FIELD_MAP = Object.fromEntries(ALL_FIELDS.map((field) => [field.name, field]));
