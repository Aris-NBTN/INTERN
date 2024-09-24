import express from 'express';
import { uploadController } from '~/controllers/fileController.js';
import upload from '~/middlewares/fileMiddleware.js';
import upload3D from '~/middlewares/file3dMiddleware';
import uploadVideo from '~/middlewares/fileVideoMiddleware';
const Router = express.Router();

Router.route("/")
    .post(upload.single('file'), uploadController.file)

Router.route("/multi")
    .post(upload.array('files'), uploadController.files)

Router.route("/3d")
    .post(upload3D.single('file3d'), uploadController.file3d)

Router.route("/video")
    .post(uploadVideo.single('fileVideo'), uploadController.fileVideo)

Router.route("/base64")
    .post(uploadController.fileBase64)

Router.route("/compress")
    .post(uploadController.fileCompressFolder)

export const fileRouter = Router;