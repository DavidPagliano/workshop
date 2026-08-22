import axios from 'axios';

// Creamos una instancia de Axios
const api = axios.create({
  // En desarrollo apunta al backend local. Luego se puede cambiar con variables de entorno.
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;