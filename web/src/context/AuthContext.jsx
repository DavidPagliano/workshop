import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

/**
 * Decodifica el payload de un JWT sin verificar la firma.
 * Solo se usa en el cliente para comprobar la expiración; la validación
 * real la hace el backend con jwt.verify().
 */
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

/**
 * Comprueba si el token JWT ya expiró comparando el campo `exp`
 * con la hora actual del sistema.
 */
const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  // exp está en segundos, Date.now() en milisegundos
  return decoded.exp * 1000 < Date.now();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("workshop_token");
    const savedUser = localStorage.getItem("workshop_user");

    // Validar expiración del token al cargar la app
    if (savedToken && isTokenExpired(savedToken)) {
      localStorage.removeItem("workshop_token");
      localStorage.removeItem("workshop_user");
      return null;
    }

    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("workshop_token");
    if (savedToken && isTokenExpired(savedToken)) {
      return null;
    }
    return savedToken || null;
  });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await api.post("/workshop/auth/login", {
      username,
      password,
    });
    const { token: receivedToken, user: receivedUser } = response.data;

    // Configurar Axios inmediatamente evita que la primera petición del
    // dashboard salga sin credenciales mientras React actualiza el estado.
    api.defaults.headers.common["Authorization"] = `Bearer ${receivedToken}`;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem("workshop_token", receivedToken);
    localStorage.setItem("workshop_user", JSON.stringify(receivedUser));
    return receivedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("workshop_token");
    localStorage.removeItem("workshop_user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
