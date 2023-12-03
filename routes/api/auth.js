const express = require('express');
const router = express.Router();
const jsonParser = express.json();

const AuthController = require('../../controllers/auth');
const UserController = require('../../controllers/user.js');
const authMiddleware = require('../../middleware/auth');
const upload = require("../../middleware/upload.js");

router.post('/register',jsonParser, AuthController.register);
router.post('/login', jsonParser, AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/current', authMiddleware, AuthController.current);
router.get('/verify/:verificationToken', AuthController.verify);
router.post('/verify', AuthController.notVerify);
router.get('/avatars', authMiddleware, UserController.getAvatar)
router.patch('/avatars', authMiddleware, upload.single('avatar'), UserController.uploadAvatar);


module.exports = router