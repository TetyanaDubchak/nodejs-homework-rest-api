const fs = require("node:fs/promises");
const path = require("node:path");
const Jimp = require("jimp");

const User = require("../models/user");

async function getAvatar(req, res, next) {
    try {
        const user = await User.findById(req.user.id).exec();

        if (user === null) {
            return res.status(401).send("Not authorized");
        }

        if (user.avatar === null) {
            return res.status(401).send("Not authorized");
        }
        res.sendFile(path.join(__dirname, "..", "public/avatars", user.avatarURL))
    } catch (error) {
        next(error);
    }
}

async function uploadAvatar(req, res, next) {
    try {
        const defaultAvatar = path.join(__dirname,"..", "public/avatars/default-avatar.png")
        if (!req.file) {
            const user = await User.findByIdAndUpdate(req.user.id, { avatarURL: defaultAvatar }, { new: true }).exec();
            return res.status(400).sendFile(path.join( user.avatarURL))
        }

        const newPath = path.join(__dirname, "..", "public/avatars", req.file.filename);
        await fs.rename(req.file.path, newPath);

        const image = await Jimp.read(newPath);
        image.resize(250, 250);
        await image.writeAsync(newPath);

        const user = await User.findByIdAndUpdate(req.user.id, { avatarURL: req.file.filename }, { new: true }).exec();
        
        if (user === null) {
            return res.status(401).send("Not authorized")
        }

        res.status(200).json(`avatarURL:${req.file.filename}`, )
    } catch (error) {
        next(error)
    }

}

module.exports = {getAvatar, uploadAvatar}