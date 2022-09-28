const Router = require('express');
const router = new Router();

const orderRouter = require('./orderRouter');
const basketRouter = require('./basketRouter');
const deviceRouter = require('./deviceRouter');
const userRouter = require('./userRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');


router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/order', orderRouter);

module.exports = router;