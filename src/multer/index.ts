import multer from 'multer';
import path from 'path';


const destination = path.join(__dirname, '..', 'uploads');

var storage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, destination);
     },
     filename: function (req, file, cb) {
          cb(null, file.originalname);
     }
});

export default multer({ storage });