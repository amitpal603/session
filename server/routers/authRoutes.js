const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', authController.getCurrentUser);
router.patch('/preferences', requireAuth, authController.updateSessionPreferences);

module.exports = router;