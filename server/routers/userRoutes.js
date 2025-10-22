const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.patch('/preferences', userController.updatePreferences);

module.exports = router;