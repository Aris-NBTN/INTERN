import multer from 'multer';
import path from 'path';

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['glb'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(extname.slice(1))) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận tệp .glb'), false); // Từ chối tệp
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/3d/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload3D = multer({
    storage: storage,
    fileFilter: fileFilter // Thêm kiểm tra loại tệp
});

export default upload3D;
