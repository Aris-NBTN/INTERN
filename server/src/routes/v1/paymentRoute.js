import express from 'express';
import { paymentController } from '~/controllers/paymentController';

const Router = express.Router();

Router.route("/momo")
    .post(paymentController.payWithMoMo)

Router.route("/zalopay")
    .post(paymentController.payWithZaloPay)

Router.route("/vnpay")
    .post(paymentController.payWithVNPay)

Router.route("/create-qr-payment")
    .post(paymentController.createQRPayment)

Router.route("/bank")
    .post(paymentController.testPayment)

Router.route("/check-bank")
    .post(paymentController.checkPayment)

export const paymentRouter = Router;