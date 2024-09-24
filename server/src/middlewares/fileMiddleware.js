import multer from 'multer';
import path from 'path';

const allowedImageTypes = [
    'image/jpeg',    // JPEG
    'image/png',     // PNG
    'image/gif',     // GIF
    'image/webp',    // WebP
    'image/svg+xml', // SVG
    'image/bmp',     // BMP
    'image/tiff'     // TIFF
];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/img'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép tải lên hình ảnh'), false); // Từ chối file tải lên
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;
