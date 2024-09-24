import express from 'express';
import { fileManagerController, folderManagerController } from '~/controllers/fileManagerControllder';

const Router = express.Router();

Router.route("/")
    .get(fileManagerController.allFile)

Router.route("/folder")
    .post(folderManagerController.addFolder)
    .put(folderManagerController.renameFolder)
    .delete(folderManagerController.deleteFolder);

Router.route("/filter")
    .post(fileManagerController.filterFileType);

Router.route("/files-in-folder")
    .post(fileManagerController.filesInFolder);

Router.route("/images")
    .get(fileManagerController.getAllImages);

export const fileManagerRouter = Router;