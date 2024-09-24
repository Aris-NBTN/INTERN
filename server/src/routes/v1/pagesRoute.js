import express from 'express';
import { pagesController } from '~/controllers/pagesController.js';

const Router = express.Router();

Router.route("/")
    .get(pagesController.allPage)
    .post(pagesController.addPage)

Router.route("/slug/:slug")
    .get(pagesController.sigPage)


Router.route("/change-text")
    .post(pagesController.changeText)

Router.route("/:id")
    .post(pagesController.copyPage)
    .put(pagesController.putPage)
    .delete(pagesController.delPage)

Router.route("/:page-edit/:slug")
    .get(pagesController.sigPageEdit)

export const pagesRouter = Router;
