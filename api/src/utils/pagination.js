/**
 * Lee `page` y `limit` de la query string. Devuelve null cuando no se pide
 * paginación (así las respuestas siguen siendo arrays por compatibilidad) y
 * un objeto acotado cuando sí se especifica.
 */
const parsePagination = (query = {}) => {
  const hasPage = query.page !== undefined;
  const hasLimit = query.limit !== undefined;

  if (!hasPage && !hasLimit) return null;

  const page = Number.parseInt(query.page, 10);
  const limit = Number.parseInt(query.limit, 10);

  if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
    return undefined; // valores inválidos -> el controlador responde 400
  }

  return { page, limit: Math.min(limit, 100) };
};

module.exports = parsePagination;
