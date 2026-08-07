const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "public/uploads/profiles");

    },

    filename: (req, file, cb) => {

        const ext = path.extname(file.originalname);

        cb(null, Date.now() + ext);

    }

});

const upload = multer({

    storage,

    fileFilter: (req, file, cb) => {

        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowed.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(new Error("Only JPG, PNG and WEBP images are allowed."));

        }

    }

});

module.exports = upload;