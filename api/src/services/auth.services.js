const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

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