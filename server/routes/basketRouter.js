const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const checkToken = require('../middleware/authMiddleWare');

router.post('/',checkToken, basketController.addTo);
router.put('/', checkToken,basketController.updateDevice);
router.delete('/', checkToken,basketController.deleteFrom);
router.delete('/:id', checkToken,basketController.clearBasket);
router.get('/', basketController.getAll);

module.exports = router;

