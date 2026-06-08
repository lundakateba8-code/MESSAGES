const express = require('express');
const router = express.Router();

// Test : on commente tout pour voir si le serveur démarre
// const authRoutes = require('./auth.routes');
// const messageRoutes = require('./message.routes');

// router.use('/auth', authRoutes);
// router.use('/messages', messageRoutes);

router.get('/', (req, res) => {
    res.json({ message: "API root" });
});

module.exports = router;