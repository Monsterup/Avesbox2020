let router = require('express').Router();
let controller = require('./AuthController')

router.route('/login').post(controller.postLogin);
router.route('/')
router.route('/verifyToken').get(controller.verifyToken);
router.route('/province').get(controller.province);
module.exports = router;