const path = require('path');
const multer = require('multer');

var strage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    }, filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
    }
});

var upload = multer({
    storage: strage,
    fileFilter: function (req, file, callback) {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg"
        ) {
            callback(null, true);
        } else {
            console.log('Only image jpg or png file support');
            callback(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
});

module.exports = upload