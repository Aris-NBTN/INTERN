import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/plugins/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = function (req, file, cb) {
    const allowedExtensions = ['.js'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép upload file JS'), false);
    }
};

const uploadPlugins = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default uploadPlugins;