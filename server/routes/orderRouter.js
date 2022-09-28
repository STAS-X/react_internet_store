const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const checkToken = require('../middleware/authMiddleWare');

router.post('/', checkToken, orderController.create);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);

module.exports = router;
