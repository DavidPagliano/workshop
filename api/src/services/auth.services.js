const User = require('../models/User');
const Counter = require('../models/Counter');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const XLSX = require('xlsx');
const AppError = require('../utils/AppError');

const VALID_ROLES = ['admin', 'director', 'staff_registracion', 'staff_bedele'];

// Normaliza los nombres de columna del Excel para mapearlos a los campos esperados
const normalizeHeader = (header) => {
  const h = String(header || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (['usuario', 'username', 'user', 'nombre de usuario', 'nombre'].includes(h)) return 'username';
  if (['email', 'correo', 'correo electronico', 'mail', 'e-mail'].includes(h)) return 'email';
  if (['contrasena', 'contrsena', 'password', 'clave', 'pass'].includes(h)) return 'password';
  if (['rol', 'role', 'perfil', 'roles'].includes(h)) return 'role';
  return null;
};

// Normaliza los roles aceptando variantes tanto técnicas como en lenguaje natural
const normalizeRole = (roleValue) => {
  const r = String(roleValue || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\-]+/g, '_');

  if (['admin', 'administrador', 'administradora'].includes(r)) return 'admin';
  if (['director', 'directora'].includes(r)) return 'director';
  if (['staff_registracion', 'staff_registro', 'registracion', 'registro'].includes(r)) return 'staff_registracion';
  if (['staff_bedele', 'staff_bedel', 'bedele', 'bedel', 'staff_bedelia', 'bedelia'].includes(r)) return 'staff_bedele';
  if (VALID_ROLES.includes(r)) return r;
  return null;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.login = async ({ username, password }) => {
  if (!config.jwtSecret) {
    const error = new Error('Falta configurar JWT_SECRET');
    error.code = 'AUTH_NOT_CONFIGURED';
    throw error;
  }

  const user = await User.findOne({ username, activo: true });
  if (!user) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const payload = {
    id: user._id,
    username: user.username,
    role: user.role,
    tokenVersion: user.tokenVersion || 0,
  };

  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '2h', algorithm: 'HS256' });

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  };
};

// Reclama de forma atómica el bootstrap del primer administrador. El marcador
// único en `Counter` garantiza que, ante registros concurrentes con la BD
// vacía, solo una petición se convierta en admin.
const claimFirstAdmin = async () => {
  if (await User.exists({})) return false;

  try {
    await Counter.create({ _id: 'admin_bootstrap' });
    return true;
  } catch (error) {
    if (error.code === 11000) return false; // otra petición ganó la carrera
    throw error;
  }
};

/**
 * Registra un usuario.
 * - El primer usuario del sistema se crea como admin activo.
 * - Un admin autenticado puede crear usuarios con rol explícito y activos.
 * - Cualquier otro caso cae en staff_registracion pendiente de aprobación.
 *
 * @param {object} data
 * @param {{ isAdmin?: boolean }} options
 */
exports.registerUser = async (data, { isAdmin = false } = {}) => {
  const isFirstUser = isAdmin ? false : await claimFirstAdmin();
  const requestedRole = isAdmin ? data.role : 'staff_registracion';

  const payload = {
    ...data,
    role: isFirstUser ? 'admin' : requestedRole,
    activo: isFirstUser || isAdmin,
  };

  const existingUser = await User.findOne({
    $or: [{ email: payload.email }, { username: payload.username }],
  });

  if (existingUser) {
    throw new AppError('El nombre de usuario o email ya se encuentra en uso', 409);
  }

  const newUser = new User(payload);
  await newUser.save();

  return {
    isFirstUser,
    isAdminCreation: isAdmin,
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  };
};

exports.listUsers = async () => {
  return await User.find({}, '-password').sort({ creado: -1 }).lean();
};

exports.updateUserStatus = async (id, activo, currentUserId) => {
  if (String(currentUserId) === String(id) && !activo) {
    throw new AppError('No puedes desactivar tu propio usuario', 400);
  }

  const target = await User.findById(id).select('role');
  if (!target) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Las cuentas de administrador están protegidas: no se pueden desactivar.
  if (target.role === 'admin') {
    throw new AppError('No se puede desactivar a un administrador', 403);
  }

  return await User.findByIdAndUpdate(
    id,
    { activo },
    { returnDocument: 'after', runValidators: true, projection: '-password' },
  ).lean();
};

exports.deleteUser = async (id, currentUserId) => {
  if (String(currentUserId) === String(id)) {
    throw new AppError('No puedes eliminar tu propio usuario', 400);
  }

  const target = await User.findById(id).select('role');
  if (!target) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Las cuentas de administrador están protegidas: no se pueden eliminar.
  if (target.role === 'admin') {
    throw new AppError('No se puede eliminar a un administrador', 403);
  }

  return await User.findByIdAndDelete(id).select('-password').lean();
};

exports.resetPassword = async (id, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new AppError('La nueva contraseña debe tener al menos 6 caracteres', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // El pre-save hook de bcrypt hashea la contraseña antes de guardar.
  user.password = newPassword;
  // Invalida cualquier JWT emitido antes del cambio de contraseña.
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();

  return user;
};

exports.importUsersFromExcel = async (fileBuffer) => {
  let workbook;
  try {
    workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  } catch (err) {
    const error = new Error('No se pudo leer el archivo Excel. Verifique que el formato sea válido.');
    error.statusCode = 400;
    throw error;
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    const error = new Error('El archivo Excel no contiene hojas');
    error.statusCode = 400;
    throw error;
  }

  const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
  if (!rawRows.length) {
    const error = new Error('La hoja no contiene datos');
    error.statusCode = 400;
    throw error;
  }

  // Mapear headers originales a campos normalizados
  const originalHeaders = Object.keys(rawRows[0]);
  const headerMap = {};
  for (const oh of originalHeaders) {
    const mapped = normalizeHeader(oh);
    if (mapped) headerMap[oh] = mapped;
  }

  const requiredFields = ['username', 'email', 'password', 'role'];
  const mappedFields = Object.values(headerMap);
  const missingFields = requiredFields.filter((f) => !mappedFields.includes(f));
  if (missingFields.length) {
    const error = new Error(
      `Faltan columnas requeridas en el archivo: ${missingFields.join(', ')}. Columnas esperadas: usuario, email, contraseña, rol`
    );
    error.statusCode = 400;
    throw error;
  }

  const results = { created: [], skipped: [], errors: [] };
  const seenUsernames = new Set();
  const seenEmails = new Set();

  for (let i = 0; i < rawRows.length; i++) {
    const raw = rawRows[i];
    const row = {};
    for (const [original, mapped] of Object.entries(headerMap)) {
      row[mapped] = String(raw[original] ?? '').trim();
    }

    const rowNum = i + 2; // +2 porque fila 1 es el encabezado

    // Validar campos obligatorios
    if (!row.username || !row.email || !row.password || !row.role) {
      results.errors.push({
        row: rowNum,
        username: row.username || '—',
        reason: 'Faltan campos obligatorios (usuario, email, contraseña o rol)',
      });
      continue;
    }

    const usernameNormalized = row.username.trim();
    const emailNormalized = row.email.toLowerCase().trim();

    if (!isValidEmail(emailNormalized)) {
      results.errors.push({
        row: rowNum,
        username: usernameNormalized,
        reason: `Email inválido: "${row.email}"`,
      });
      continue;
    }

    if (row.password.length < 6) {
      results.errors.push({
        row: rowNum,
        username: usernameNormalized,
        reason: 'La contraseña debe tener al menos 6 caracteres',
      });
      continue;
    }

    const roleFinal = normalizeRole(row.role);
    if (!roleFinal) {
      results.errors.push({
        row: rowNum,
        username: usernameNormalized,
        reason: `Rol inválido: "${row.role}". Válidos: admin, director, staff_registracion, staff_bedele`,
      });
      continue;
    }

    // Evitar duplicados dentro del mismo archivo
    const uKey = usernameNormalized.toLowerCase();
    if (seenUsernames.has(uKey) || seenEmails.has(emailNormalized)) {
      results.skipped.push({
        row: rowNum,
        username: usernameNormalized,
        reason: 'Usuario o email duplicado dentro del mismo archivo',
      });
      continue;
    }

    // Verificar existencia previa en la BD (case-insensitive para username e email)
    const escapedUsername = usernameNormalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exists = await User.findOne({
      $or: [
        { username: new RegExp(`^${escapedUsername}$`, 'i') },
        { email: emailNormalized },
      ],
    });

    if (exists) {
      results.skipped.push({
        row: rowNum,
        username: usernameNormalized,
        reason: 'Usuario o email ya registrado previamente',
      });
      continue;
    }

    try {
      const newUser = new User({
        username: usernameNormalized,
        email: emailNormalized,
        password: row.password,
        role: roleFinal,
        activo: true,
      });
      await newUser.save();
      seenUsernames.add(uKey);
      seenEmails.add(emailNormalized);
      results.created.push({
        row: rowNum,
        username: usernameNormalized,
        email: emailNormalized,
        role: roleFinal,
      });
    } catch (saveError) {
      results.errors.push({
        row: rowNum,
        username: usernameNormalized,
        reason: saveError.message,
      });
    }
  }

  return {
    message: `Importación finalizada: ${results.created.length} creados, ${results.skipped.length} omitidos, ${results.errors.length} errores`,
    results,
  };
};