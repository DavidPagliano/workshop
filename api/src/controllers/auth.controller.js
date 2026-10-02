const authService = require('../services/auth.services');
const asyncHandler = require('../utils/asyncHandler');
const { logAction } = require('../services/audit.services');

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  await logAction(req, 'LOGIN', `Inicio de sesión exitoso: ${result.user.username}`);
  res.status(200).json(result);
});

exports.register = asyncHandler(async (req, res) => {
  const { user, isFirstUser, isAdminCreation } = await authService.registerUser(req.body, {
    isAdmin: req.user?.role === 'admin',
  });

  res.status(201).json({
    message: isFirstUser
      ? 'Primer administrador creado y activado exitosamente.'
      : isAdminCreation
        ? 'Usuario creado y activado exitosamente.'
        : 'Registro solicitado correctamente. Pendiente de aprobación por un administrador.',
    user,
  });
});

exports.listUsers = asyncHandler(async (req, res) => {
  const users = await authService.listUsers();
  res.status(200).json(users);
});

exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { activo } = req.body;
  const user = await authService.updateUserStatus(req.params.id, activo, req.user.id);

  await logAction(
    req,
    activo ? 'ACTIVACION_USUARIO' : 'DESACTIVACION_USUARIO',
    `Usuario actualizado: ${user.username}`,
  );

  res.status(200).json(user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await authService.deleteUser(req.params.id, req.user.id);

  await logAction(req, 'ELIMINACION_USUARIO', `Usuario eliminado: ${user.username}`);

  res.status(200).json({ message: 'Usuario eliminado correctamente' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const user = await authService.resetPassword(req.params.id, req.body.newPassword);

  await logAction(req, 'RESET_PASSWORD', `Contraseña reseteada para: ${user.username}`);

  res.status(200).json({ message: 'Contraseña actualizada correctamente' });
});

exports.importUsers = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'No se recibió ningún archivo Excel' });
  }

  const { message, results } = await authService.importUsersFromExcel(req.file.buffer);

  await logAction(
    req,
    'IMPORT_USERS',
    `Importación Excel: ${results.created.length} creados, ${results.skipped.length} omitidos, ${results.errors.length} errores`,
  );

  res.status(200).json({ message, results });
});
