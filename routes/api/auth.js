const express = require('express');
const router = express.Router();
const jsonParser = express.json();

const AuthController = require('../../controllers/auth');
const authMiddleware = require('../../middleware/auth');

router.post('/register',jsonParser, AuthController.register);
router.post('/login', jsonParser, AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/current', authMiddleware, AuthController.current);


module.exports = router