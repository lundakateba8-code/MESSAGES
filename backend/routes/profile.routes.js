const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/profiles/' });

router.put('/', protect, upload.single('photo'), updateProfile);

module.exports = router;