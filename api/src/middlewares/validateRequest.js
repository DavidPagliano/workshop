const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const errors = error.issues.map(err => ({
        field: err.path[0],
        message: err.message
      }));
      return res.status(400).json({ message: 'Error de validación de datos', errors });
    }
  };
};

module.exports = validateRequest;