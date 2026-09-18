const express = require('express');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { loginSchema, registerUserSchema, publicRegisterSchema } = require('../schemas/auth.schema');

// Multer en memoria para recibir archivos Excel (.xls, .xlsx)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (_req, file, cb) => {
    const isExcelExt = /\.(xlsx|xls)$/i.test(file.originalname || '');
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/msexcel',
      'application/x-msexcel',
      'application/x-ms-excel',
      'application/x-excel',
      'application/excel',
      'application/octet-stream',
    ];
    if (isExcelExt || allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xls, .xlsx)'));
    }
  },
});

const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'El archivo excede el tamaño máximo permitido de 5MB' });
      }
      return res.status(400).json({ message: `Error al subir el archivo: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

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

router.post(
  '/admin/import-users',
  authenticateToken,
  authorizeRoles('admin'),
  handleUpload,
  authController.importUsers
);

module.exports = router;