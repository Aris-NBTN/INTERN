import express from 'express';
import { groupPageController } from '~/controllers/groupPageController.js';

const Router = express.Router();

Router.route("/")
    .get(groupPageController.allGroup)
    .post(groupPageController.addGroup);

Router.route("/:id")
    .delete(groupPageController.delGroup)
    .put(groupPageController.putGroup);

export const groupPageRouter = Router;