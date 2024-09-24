import express from 'express';
import { pluginsController } from "~/controllers/pluginsController.js";
import uploadPlugins from "~/middlewares/filePluginsMiddleware.js";
import uploadPluginsEV from '~/middlewares/filePluginsEVMiddleware';

const Router = express.Router();

Router.route("/")
    .get(pluginsController.all)
    .post(uploadPlugins.single('filePlugins'), pluginsController.addFilePlugins)

Router.route("/file")
    .post(uploadPluginsEV.array('fileEV', 5), pluginsController.addFileEV)

export const pluginsRouter = Router;