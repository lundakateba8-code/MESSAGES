const AudioMessage = require('../models/AudioMessage');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs').promises;

exports.uploadAudio = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('Fichier audio requis', 400));
    const audioMessage = await AudioMessage.create({
      user: req.user._id,
      title: req.body.title || 'Message vocal',
      audioFile: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/audio/messages/${req.file.filename}`
      }
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { 'profile.audioMessages': audioMessage._id }
    });
    res.status(201).json({ success: true, audio: audioMessage });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
};

exports.getMyAudioMessages = async (req, res, next) => {
  try {
    const messages = await AudioMessage.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

exports.deleteAudioMessage = async (req, res, next) => {
  try {
    const message = await AudioMessage.findById(req.params.id);
    if (!message) return next(new AppError('Message non trouvé', 404));
    if (message.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Non autorisé', 403));
    }
    await fs.unlink(message.audioFile.path).catch(() => {});
    await message.remove();
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { 'profile.audioMessages': message._id }
    });
    res.json({ success: true, message: 'Message supprimé' });
  } catch (error) {
    next(error);
  }
};

exports.streamAudio = async (req, res, next) => {
  try {
    const message = await AudioMessage.findById(req.params.id);
    if (!message) return next(new AppError('Audio non trouvé', 404));
    const audioPath = message.audioFile.path;
    const stat = await fs.stat(audioPath);
    res.writeHead(200, {
      'Content-Type': message.audioFile.mimeType,
      'Content-Length': stat.size
    });
    const readStream = require('fs').createReadStream(audioPath);
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
};