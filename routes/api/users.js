const express = require('express');

const UserController = require('../../controllers/user.js')

const router = express.Router();

router.patch('/avatars', UserController.uploadAvatar);

module.exports = router;