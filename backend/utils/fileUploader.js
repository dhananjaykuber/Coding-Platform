const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'codes'),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
