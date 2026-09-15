import api from "./api";

const getError = (error, fallback) =>
  error.response?.data || { message: fallback };

export const getUsers = async () => {
  try {
    const response = await api.get("/workshop/auth/users");
    return response.data;
  } catch (error) {
    throw getError(error, "Error al obtener los usuarios");
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post("/workshop/auth/admin/create-user", userData);
    return response.data;
  } catch (error) {
    throw getError(error, "Error al crear el usuario");
  }
};

export const updateUserStatus = async (id, activo) => {
  try {
    const response = await api.patch(`/workshop/auth/users/${id}/status`, { activo });
    return response.data;
  } catch (error) {
    throw getError(error, "Error al actualizar el usuario");
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/workshop/auth/users/${id}`);
    return response.data;
  } catch (error) {
    throw getError(error, "Error al eliminar el usuario");
  }
};

export const getAuditLogs = async ({ page = 1, limit = 10, search = "" } = {}) => {
  try {
    const response = await api.get("/workshop/audit", {
      params: { page, limit, search: search || undefined },
    });
    return response.data;
  } catch (error) {
    throw getError(error, "Error al obtener la auditoría");
  }
};
