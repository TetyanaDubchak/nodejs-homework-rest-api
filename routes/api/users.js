const express = require('express');

const UserController = require('../../controllers/user.js');

const upload = require("../../middleware/upload.js");

const router = express.Router();

router.get('/avatars', UserController.getAvatar)
router.patch('/avatars', upload.single('avatar'), UserController.uploadAvatar);

module.exports = router;