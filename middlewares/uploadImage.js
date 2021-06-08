const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ''))
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      req.fileValidationError = {
        message: "Only jpg/png image files are allowed!",
      }
      return cb(new Error("Only jpg/png image files are allowed!"), false);
    }
    cb(null, true)
  }
})

const uploadImage = multer({ storage }).fields([
  { name: 'avatar', maxCount: 1},
  { name: 'thumbnail', maxCount: 1 },
  { name: 'transferProof', maxCount: 1 }
])

module.exports = uploadImage
