import express from 'express';
import { categoryCourserController } from '~/controllers/categoryCourseController';

const Router = express.Router();

Router.route("/")
    .get(categoryCourserController.allCategory)
    .post(categoryCourserController.addCategory)

Router.route("/:id")
    .delete(categoryCourserController.delCategory)
    .put(categoryCourserController.putCategory)

export const categoryCourserRouter = Router;