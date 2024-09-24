import express from 'express';
import { emailController } from '~/controllers/mailController';

const Router = express.Router();

Router.route("/")
    .post(emailController.sendMail)

export const mailRouter = Router;