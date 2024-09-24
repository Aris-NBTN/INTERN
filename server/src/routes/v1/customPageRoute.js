import express from 'express';
import { maronryController } from '~/controllers/customPageController';

const Router = express.Router();

Router.route("/masonry")
    .post(maronryController.addMasonry)

Router.route("/masonry/:slug")
    .get(maronryController.sigMasonry)
    .put(maronryController.putMasonry)
    .delete(maronryController.delMasonry);

export const customPageRouter = Router;