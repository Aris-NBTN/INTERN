import express from 'express';
import { courserController, searchCourserController } from '~/controllers/courseController';
import upload from '~/middlewares/fileMiddleware.js';

const Router = express.Router();

Router.route("/")
    .get(courserController.allCourser)

Router.route("/outstand")
    .get(courserController.outstandCourse)

Router.route("/cart/")
    .post(courserController.allCourserCart)

Router.route("/search").get(searchCourserController.searchCourses);

Router.route("/slug/:slug")
    .get(courserController.sigCourser)
    .put(courserController.updateCourseModule)

Router.route("/courser-admin/")
    .get(courserController.allCourserAdmin)
    .post(courserController.addCourser)

Router.route("/:id")
    .get(courserController.sigCourser)
    .delete(courserController.delCourser)
    .put(courserController.putCourser)

Router.route("/image")
    .post(upload.single('file'), courserController.addImageCourses)

export const courserRouter = Router;