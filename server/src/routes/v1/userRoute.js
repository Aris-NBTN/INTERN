import express from 'express';
import { userController } from '../../controllers/userController.js';

const Router = express.Router();

Router.route("/")
    .get(userController.allUser)

Router.route("/:id")
    .get(userController.singleUser)
    .delete(userController.deleteUser)
    .put(userController.updateUser)

Router.route("/course/:id")
    .put(userController.updateCourse)

export const userRouter = Router;
