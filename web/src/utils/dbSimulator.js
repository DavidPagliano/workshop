// Mock Data simulando la colección de MongoDB con el esquema del profesor
const PARTICIPANTES_MOCK = [
  { 
    _id: "101", 
    nombre: "Esteban", 
    apellido: "Quito", 
    email: "esteban@uade.edu.ar", 
    celular: "1123456789", 
    dni: "12345678", 
    temasInteres: ["Inteligencia Artificial", "Diseño UI/UX"], 
    seRegistro: false // Booleano oficial para la asistencia
  },
  { 
    _id: "102", 
    nombre: "Ana", 
    apellido: "Conda", 
    email: "anaconda@gmail.com", 
    celular: "1166778899", 
    dni: "39445123",
    temasInteres: ["Programación Web"], 
    seRegistro: true 
  },
  { 
    _id: "103", 
    nombre: "Facundo", 
    apellido: "Cabral", 
    email: "fcabral@uade.edu.ar", 
    celular: "1154321098", 
    dni: "41029384",
    temasInteres: ["Inteligencia Artificial", "Bases de Datos"], 
    seRegistro: false 
  }
];

// Lee los datos del disco local (localStorage) o carga los de prueba si está vacío
export const obtenerParticipantesSimulados = (dniFiltro = '') => {
  const db = localStorage.getItem('multimedia_day_db');
  const datos = db ? JSON.parse(db) : PARTICIPANTES_MOCK;
  
  if (!db) {
    localStorage.setItem('multimedia_day_db', JSON.stringify(PARTICIPANTES_MOCK));
  }

  if (dniFiltro) {
    return datos.filter(p => p.dni === dniFiltro);
  }
  return datos;
};

// Guarda un nuevo participante (Simula el POST del backend)
export const guardarParticipanteSimulado = (nuevoRegistro) => {
  const db = obtenerParticipantesSimulados();
  const registroConId = { 
    ...nuevoRegistro, 
    _id: Date.now().toString(), // Genera un ID único para la simulación
    seRegistro: false 
  };
  db.push(registroConId);
  localStorage.setItem('multimedia_day_db', JSON.stringify(db));
  return registroConId;
};

// Cambia el estado de asistencia de un participante (Simula el PATCH del backend)
export const patchSeRegistroSimulado = (registrarId, seRegistroValor) => {
  const db = obtenerParticipantesSimulados();
  const dbActualizada = db.map(p => 
    p._id === registrarId ? { ...p, seRegistro: seRegistroValor } : p
  );
  localStorage.setItem('multimedia_day_db', JSON.stringify(dbActualizada));
  return dbActualizada;
};