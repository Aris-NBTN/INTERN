import express from 'express';
import { authController } from '~/controllers/authController.js';
import { authValidation } from '~/validations/authValidation.js';

const Router = express.Router();

Router.route("/login").post(authValidation.login, authController.login)
Router.route("/login-google").post(authController.loginGoogle)
Router.route("/register").post(authValidation.register, authController.register)
Router.route("/reauth").post(authController.reAuth)

export const authRouter = Router;