const multer = require('multer')
const path = require('path')
require('dotenv').config()
const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, cb) =>{
        if (file.mimetype.includes('image')) {
            // To reject this file pass `false`, like so:
            cb(null, false)
        }
        // To accept the file pass `true`, like so:
        cb(null, true)
    },
})

//const upload = multer({ dest: 'uploads/' })
module.exports=upload