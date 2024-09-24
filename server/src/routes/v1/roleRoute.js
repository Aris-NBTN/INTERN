import express from 'express';
import { roleController } from '~/controllers/roleController.js';

const Router = express.Router();

Router.route("/")
    .get(roleController.allRole)
    .post(roleController.addRole)

Router.route("/:id")
    .delete(roleController.delRole)
    .put(roleController.putRole)

export const roleRouter = Router;