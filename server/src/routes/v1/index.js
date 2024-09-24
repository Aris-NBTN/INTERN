import express from 'express';

import { authRouter } from './authRoute.js';
import { pagesRouter } from './pagesRoute.js';
import { menuRouter } from './menuRoute.js';
import { fileRouter } from './fileRoute.js';
import { infoRouter } from './infoRoute.js';
import { groupPageRouter } from './groupPageRoute.js';
import { customPageRouter } from './customPageRoute.js';
import { mailRouter } from './mailRoute.js';
import { userRouter } from './userRoute.js';
import { layoutRouter } from './layoutRoute.js';
import { fileManagerRouter } from './fileManagerRoute.js';
import { categoryCourserRouter } from './categoryCourserRoute.js';
import { courserRouter } from './courseRoute.js'
import { paymentRouter } from './paymentRoute.js'
import { roleRouter } from './roleRoute.js'
import { pluginsScriptRouter } from './pluginsScriptRoute.js'
import { orderRouter } from './orderRoute.js'
import { pluginsRouter } from './pluginsRoute.js'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/pages', pagesRouter);
router.use('/menu', menuRouter);
router.use('/file', fileRouter);
router.use('/info', infoRouter);
router.use('/group-page', groupPageRouter);
router.use('/custom-page', customPageRouter);
router.use('/mail', mailRouter);
router.use('/user', userRouter);
router.use('/layout', layoutRouter);
router.use('/file-manager', fileManagerRouter);
router.use('/order', orderRouter);

router.use('/category-courser', categoryCourserRouter);
router.use('/courser', courserRouter);

router.use('/payment', paymentRouter);
router.use('/role', roleRouter);
router.use('/plugins-script', pluginsScriptRouter);
router.use('/plugins', pluginsRouter);


export default router