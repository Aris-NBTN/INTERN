import express from 'express';
import { infoController } from '~/controllers/infoController';

const Router = express.Router();

Router.route("/")
    .get(infoController.allInfo)
    .post(infoController.updateInfo);

export const infoRouter = Router;