import express from 'express';
import { orderController } from '~/controllers/orderController';

const Router = express.Router();

Router.route("/")
    .get(orderController.allOrder)
    .post(orderController.addOrder)

Router.route("/:id")
    .get(orderController.sigOrder)
    .delete(orderController.delOrder)
    .put(orderController.putOrder)

Router.route("/revenue")
    .get(orderController.revenue)

export const orderRouter = Router;