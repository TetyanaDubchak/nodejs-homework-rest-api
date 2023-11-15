const express = require('express');
const router = express.Router();
const jsonParser = express.json();

const AuthController = require('../../controllers/auth');

router.post('/register',jsonParser, AuthController.register);
router.post('/login', jsonParser, AuthController.login)

module.exports = router