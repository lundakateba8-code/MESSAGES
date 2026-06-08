const express = require('express');
const router = express.Router();

// Route temporaire
router.get('/', (req, res) => {
    res.json({ message: "Messages route working" });
});

module.exports = router;