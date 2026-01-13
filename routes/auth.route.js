const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

const auth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/requireRole');

// Auth
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refresh)
router.get('/profile', auth, requireRole('user'), authController.profile);

// User
router.get('/users', auth, requireRole('user'), userController.getAllUsers);
router.get('/users/:id', auth, requireRole('user'), userController.getUserById);
router.delete('/users/:id', auth, requireRole('user'), userController.deleteUser);
router.put('/users/:id', auth, requireRole('user'), userController.updateUser);

module.exports = router;