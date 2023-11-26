const path = require("node:path");
const crypto = require('node:crypto');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "tmp"));
        console.log(path.join(__dirname, "..", "tmp"));
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extname);
        const sufix = crypto.randomUUID();

        cb(null, `${baseName}-${sufix}${extname}`);
    },
});

const upload = multer({ storage });

module.exports = upload;