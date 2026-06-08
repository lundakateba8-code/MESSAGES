const express = require('express');
const router = express.Router();
const { uploadAudio, getMyAudioMessages, deleteAudioMessage, streamAudio } = require('../controllers/audio.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/audioUpload');

router.use(protect);
router.post('/upload', upload.single('audio'), uploadAudio);
router.get('/messages', getMyAudioMessages);
router.delete('/:id', deleteAudioMessage);
router.get('/stream/:id', streamAudio);

module.exports = router;