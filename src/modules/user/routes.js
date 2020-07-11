let router = require('express').Router();
let controller = require('./UserController');

// RESET PASSWORD
router.get('/password-reset/:token', controller.checkTokenReset);
router.put('/password-reset/:token', controller.resetPassword);

// VERIFY EMAIL
router.get('/verify-email/:token', controller.verifyEmail);

// UPLOAD RESI
router.post('/upload', controller.uploadResi);
router.post('/upload2', controller.uploadResi2);

module.exports = router;