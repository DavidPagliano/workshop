const authService = require('../services/auth.services');
const User = require('../models/User');
const { logAction } = require('../utils/auditLogger');

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    await logAction(req, 'LOGIN', `Inicio de sesión exitoso: ${result.user.username}`);
    res.status(200).json(result);
  } catch (error) {
    if (error.code === 'AUTH_NOT_CONFIGURED') {
      return res.status(503).json({ message: 'Autenticación no configurada' });
    }
    res.status(401).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Si no hay usuarios en la BD, el primero se crea como admin activo automáticamente
    const isFirstUser = totalUsers === 0;
    const isAdminCreation = req.user?.role === 'admin';
    const requestedRole = isAdminCreation ? req.body.role : 'staff_registracion';

    const payload = {
      ...req.body,
      role: isFirstUser ? 'admin' : requestedRole,
      activo: isFirstUser || isAdminCreation,
    };

    const result = await authService.registerUser(payload);
    res.status(201).json({
      message: isFirstUser
        ? 'Primer administrador creado y activado exitosamente.' 
        : isAdminCreation
          ? 'Usuario creado y activado exitosamente.'
        : 'Registro solicitado correctamente. Pendiente de aprobación por un administrador.',
      user: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ creado: -1 }).lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { activo } = req.body;
    if (typeof activo !== 'boolean') {
      return res.status(400).json({ message: 'El campo activo debe ser booleano' });
    }

    if (String(req.user.id) === req.params.id && !activo) {
      return res.status(400).json({ message: 'No puedes desactivar tu propio usuario' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { activo },
      { returnDocument: 'after', runValidators: true, projection: '-password' },
    ).lean();

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await logAction(req, activo ? 'ACTIVACION_USUARIO' : 'DESACTIVACION_USUARIO', `Usuario actualizado: ${user.username}`);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el estado del usuario' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (String(req.user.id) === req.params.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });
    }

    const user = await User.findByIdAndDelete(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await logAction(req, 'ELIMINACION_USUARIO', `Usuario eliminado: ${user.username}`);
    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.password = newPassword; // El pre-save hook de bcrypt lo hashea automáticamente
    await user.save();

    await logAction(req, 'RESET_PASSWORD', `Contraseña reseteada para: ${user.username}`);
    return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al resetear la contraseña' });
  }
};

exports.importUsers = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No se recibió ningún archivo Excel' });
    }

    const { message, results } = await authService.importUsersFromExcel(req.file.buffer);

    await logAction(
      req,
      'IMPORT_USERS',
      `Importación Excel: ${results.created.length} creados, ${results.skipped.length} omitidos, ${results.errors.length} errores`
    );

    return res.status(200).json({
      message,
      results,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Error al procesar el archivo Excel' });
  }
};