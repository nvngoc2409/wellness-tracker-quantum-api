// routes/insightRoutes.js
const express = require('express');
const router = express.Router();
const { getInsight } = require('../controllers/insight.controller.js');
const { authMiddleware } = require('../middlewares/auth.middleware.js');

router.use(authMiddleware);

router.get('/', getInsight);

module.exports = router;