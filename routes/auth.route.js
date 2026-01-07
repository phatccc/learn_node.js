const express = require('express');
const router = express.Router();
const authController  = require('../controllers/auth.controller');
const middleware = require('../middlewares/auth.middleware');


router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile' , middleware ,authController.profile)
router.post('/refresh' ,authController.refresh)

module.exports = router;