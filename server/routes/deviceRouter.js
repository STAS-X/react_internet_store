const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');
const checkRole = require('../middleware/checkRoleMiddleWare');
const checkToken = require('../middleware/authMiddleWare');

router.post('/', checkRole('ADMIN'), deviceController.create);
router.put('/:id', checkRole('ADMIN'), deviceController.update);
router.get('/', checkToken, deviceController.getAll);
router.get('/:id', checkToken, deviceController.getById);

module.exports = router;
