import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

// Image
import sharp from 'sharp';

// 3d
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { resample, prune, dedup, draco, textureCompress, center } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';

// Video
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

const uploadDir = path.join(__dirname, '../public/uploads/image');
const uploadDirOut = path.join(__dirname, '../public/uploads/test');
const uploadDir3d = path.join(__dirname, '../public/uploads/3d');
const uploadVideo = path.join(__dirname, '../public/uploads/video');

// const file = async (req, res, next) => {
//     try {
//         const { folder } = req.body;
//         console.log(folder);

//         const file = req.file.path;
//         const fileName = req.file.filename
//         const fileNameOutput = `compress-${fileName}`;

//         if (!file) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Không có File được tải lên' });
//         const outputPath = path.join(uploadDir, fileNameOutput);

//         const fileSize = req.file.size;
//         if (fileSize > 4 * 1024 * 1024) {
//             await sharp(fs.readFileSync(file))
//                 .toFormat('jpeg')
//                 .jpeg({ quality: 100 })
//                 .toFile(outputPath);
//             await fs.promises.unlink(file);
//             res.status(StatusCodes.OK).json(fileNameOutput);
//         } else {
//             res.status(StatusCodes.OK).json(fileName);
//         }

//         // const metadata = await sharp(file).metadata();
//         // console.log(metadata);

//         // await sharp(fs.readFileSync(file))
//         //     .toFormat('jpeg')
//         //     .jpeg({ quality: 100 })
//         //     .toFile(outputPath);
//         // await fs.promises.unlink(file);
//         // res.status(StatusCodes.OK).json(fileNameOutput);

//         // if (metadata.width > 1300) {
//         //     await sharp(fs.readFileSync(file))
//         //         .resize({ width: 1200 })
//         //         .toFormat('jpeg')
//         //         .jpeg({ quality: 100 })
//         //         .toFile(outputPath);
//         //     await fs.promises.unlink(file);
//         //     res.status(StatusCodes.OK).json(fileNameOutput);
//         // } else {
//         //     res.status(StatusCodes.OK).json(fileName);
//         // }
//     } catch (error) {
//         next(error);
//     }
// }

const file = async (req, res, next) => {
    try {
        const { folder } = req.body;
        if (!folder) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Folder name is required' });
        }

        const file = req.file.path;
        const fileName = req.file.filename;
        const fileNameOutput = `compress-${fileName}`;

        if (!file) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Không có File được tải lên' });

        const folderPath = path.join(uploadDir, folder);
        if (!fs.existsSync(folderPath)) {
            await fs.promises.mkdir(folderPath, { recursive: true });
        }

        const outputPath = path.join(folderPath, fileNameOutput);
        const fileSize = req.file.size;
        if (fileSize > 1 * 1024 * 1024) {
            await sharp(fs.readFileSync(file))
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(outputPath);
            await fs.promises.unlink(file);
            res.status(StatusCodes.OK).json(`image/${folder}/${fileNameOutput}`);
        } else {
            const newFilePath = path.join(folderPath, fileName);
            await fs.promises.rename(file, newFilePath);
            res.status(StatusCodes.OK).json(`image/${folder}/${fileName}`);
        }
    } catch (error) {
        next(error);
    }
};

const files = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('Không có file nào được tải lên');
        }
        const fileLinks = req.files.map(file => file.filename);
        res.status(StatusCodes.OK).json(fileLinks);
    } catch (error) {
        next(error);
    }
}

const file3d = async (req, res, next) => {
    try {
        const file = req.file.path;
        if (!file) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'File not found' });

        const io = new NodeIO()
            .registerExtensions(ALL_EXTENSIONS)
            .registerDependencies({
                'draco3d.decoder': await draco3d.createDecoderModule(),
                'draco3d.encoder': await draco3d.createEncoderModule(),
            });

        const document = await io.read(file);

        const backfaceCulling = (options) => (document) => {
            document.getRoot().listMaterials().forEach(material => {
                material.setDoubleSided(!options.cull);
            });
        };

        await document.transform(
            dedup(),
            resample(),
            prune(),
            draco(),
            textureCompress({ encoder: sharp, targetFormat: 'webp' }),
            center({ pivot: 'below' }),
            backfaceCulling({ cull: false })
        );

        const outputFilePath = path.join(uploadDir3d, path.basename(file));
        await io.write(outputFilePath, document);
        res.status(StatusCodes.OK).json({ message: 'Đã tối ưu file glb', file: path.basename(file) });
    } catch (error) {
        next(error);
    }
}

const fileVideo = async (req, res, next) => {
    try {
        const file = req.file.path;
        const fileName = req.file.filename;
        const { folder } = req.body;

        if (!file) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'File not found' });
        if (!folder) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Chưa có folder' });

        const subdirectoryPath = path.join(uploadVideo, folder);
        if (!fs.existsSync(subdirectoryPath)) {
            fs.mkdirSync(subdirectoryPath, { recursive: true });
        }

        const newFilePath = path.join(subdirectoryPath, path.basename(file));
        fs.renameSync(file, newFilePath);
        res.status(StatusCodes.OK).json(`/video/${folder}/${fileName}`);
    } catch (error) {
        next(error);
    }
};

// const fileVideo = async (req, res, next) => {
//     try {
//         const file = req.file.path;
//         if (!file) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'File not found' });
//         res.status(StatusCodes.OK).json({ file });

//         // if (!file) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Không có File được tải lên' });
//         // const outputPath = path.join(path.dirname(file), 'optimized-' + path.basename(file));
//         // ffmpeg(file)
//         //     .videoCodec('libx264')
//         //     .outputOptions([
//         //         '-crf 23', // Constant Rate Factor (CRF) từ 0 (chất lượng cao nhất) đến 51 (chất lượng thấp nhất)
//         //         '-preset faster', // Preset encoding (slower cho chất lượng tốt hơn nhưng thời gian xử lý lâu hơn)
//         //         '-profile:v high', // Profile video (high cho chất lượng cao)
//         //         '-level 4.0',
//         //         '-movflags +faststart', // Cho phép phát video nhanh hơn trên web
//         //         '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2' // Đảm bảo kích thước chẵn (yêu cầu của một số codec)
//         //     ])
//         //     .audioCodec('aac')
//         //     .audioBitrate('128k')
//         //     .on('end', () => {
//         //         fs.unlinkSync(file);
//         //         res.status(StatusCodes.OK).json({ file: outputPath });
//         //     })
//         //     .on('error', (err) => {
//         //         next(err);
//         //     })
//         //     .save(outputPath);
//     } catch (error) {
//         next(error);
//     }
// };

// const fileBase64 = async (req, res, next) => {
//     try {
//         const { base64, folder } = req.body;
//         console.log(folder);

//         if (!base64) {
//             return res.status(StatusCodes.BAD_REQUEST).send('Base64 data is required');
//         }

//         const mimeTypeMatch = base64.match(/^data:(.+);base64,/);
//         if (!mimeTypeMatch) {
//             return res.status(StatusCodes.BAD_REQUEST).send('Invalid base64 data');
//         }

//         const mimeType = mimeTypeMatch[1];
//         const extension = mime.extension(mimeType);

//         if (!extension) {
//             return res.status(StatusCodes.BAD_REQUEST).send('Unsupported file type');
//         }

//         const filename = `${new Date().toISOString().replace(/[:.]/g, '-')}.${extension}`;
//         const filePath = path.join(uploadDir, filename);
//         const fileData = Buffer.from(base64.replace(/^data:.+;base64,/, ''), 'base64');

//         await sharp(fileData)
//             .toFormat('jpeg')
//             .jpeg({ quality: 80 })
//             .toFile(filePath);

//         res.status(StatusCodes.OK).json({
//             message: 'Lưu file thành công',
//             file: `${filename}`
//         });
//     } catch (error) {
//         next(error);
//     }
// };

const fileBase64 = async (req, res, next) => {
    try {
        const { base64, folder } = req.body;

        if (!base64) {
            return res.status(StatusCodes.BAD_REQUEST).send('Base64 data is required');
        }

        const mimeTypeMatch = base64.match(/^data:(.+);base64,/);
        if (!mimeTypeMatch) {
            return res.status(StatusCodes.BAD_REQUEST).send('Invalid base64 data');
        }

        const mimeType = mimeTypeMatch[1];
        const extension = mime.extension(mimeType);

        if (!extension) {
            return res.status(StatusCodes.BAD_REQUEST).send('Unsupported file type');
        }

        const filename = `${new Date().toISOString().replace(/[:.]/g, '-')}.${extension}`;
        const folderPath = path.join(uploadDir, folder);
        const base64FolderPath = path.join(folderPath, 'base64');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        if (!fs.existsSync(base64FolderPath)) {
            fs.mkdirSync(base64FolderPath, { recursive: true });
        }

        // Đường dẫn cuối cùng để lưu file
        const filePath = path.join(base64FolderPath, filename);
        const fileData = Buffer.from(base64.replace(/^data:.+;base64,/, ''), 'base64');

        // Lưu ảnh
        await sharp(fileData)
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toFile(filePath);

        res.status(StatusCodes.OK).json({
            message: 'Lưu file thành công',
            file: `image/${folder}/base64/${filename}`
        });
    } catch (error) {
        next(error);
    }
};

const fileCompressFolder = async (req, res, next) => {
    try {
        const files = fs.readdirSync(uploadDir);

        await Promise.all(files.map(async (file) => {
            const filePath = path.join(uploadDir, file);

            const stats = fs.statSync(filePath);
            const fileSizeInBytes = stats.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

            if (fileSizeInMB > 4) {
                const tempOutputPath = path.join(uploadDirOut, `${file}`);
                await sharp(filePath)
                    .toFormat('jpeg')
                    .jpeg({ quality: 100 })
                    .toFile(tempOutputPath);
                fs.renameSync(tempOutputPath, filePath);
            }
        }));

        res.status(StatusCodes.OK).json({ message: 'Tất cả ảnh đã được xử lý thành công' });
    } catch (error) {
        next(error);
    }
};

export const uploadController = {
    file,
    files,
    file3d,
    fileVideo,
    fileBase64,
    fileCompressFolder
}
