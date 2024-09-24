import express from 'express';
import { layoutController } from '~/controllers/layoutController.js';
const Router = express.Router();

Router.route("/")
    .get(layoutController.getLayout)
    .post(layoutController.addLayout)

Router.route("/:id")
    .put(layoutController.updateLayout)

Router.route("/edit")
    .get(layoutController.getEdit)


export const layoutRouter = Router;