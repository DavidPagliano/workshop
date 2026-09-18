const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const XLSX = require('xlsx');

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
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const payload = {
    id: user._id,
    username: user.username,
    role: user.role,
  };

  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '2h' });

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  };
};

exports.registerUser = async (data) => {
  const existingUser = await User.findOne({
    $or: [{ email: data.email }, { username: data.username }],
  });

  if (existingUser) {
    throw new Error('El nombre de usuario o email ya se encuentra en uso');
  }

  const newUser = new User(data);
  await newUser.save();

  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  };
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