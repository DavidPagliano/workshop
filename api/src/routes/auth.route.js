const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { loginSchema, registerUserSchema, publicRegisterSchema } = require('../schemas/auth.schema');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de inicio de sesión' }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 5,                  // 5 registros por hora por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de registro. Intente nuevamente más tarde.' }
});

router.post('/login', loginLimiter, validateRequest(loginSchema), authController.login);

router.post('/register', registerLimiter, validateRequest(publicRegisterSchema), authController.register);

router.post(
  '/admin/create-user',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest(registerUserSchema),
  authController.register
);

router.get('/users', authenticateToken, authorizeRoles('admin'), authController.listUsers);
router.patch('/users/:id/status', authenticateToken, authorizeRoles('admin'), authController.updateUserStatus);
router.patch('/users/:id/reset-password', authenticateToken, authorizeRoles('admin'), authController.resetPassword);
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), authController.deleteUser);

module.exports = router;