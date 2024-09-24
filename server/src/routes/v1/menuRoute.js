import express from 'express';
import { menuController } from '~/controllers/menuController.js';

const Router = express.Router();

Router.route("/")
    .get(menuController.allMenu)
    .put(menuController.updateMenu)

export const menuRouter = Router;