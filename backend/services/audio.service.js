const AudioMessage = require('../models/AudioMessage');
const cloudinary = require('../config/cloudinary');
const { AppError } = require('../utils/errors');

exports.uploadAudio = async (userId, file) => {
  if (!file) throw new AppError('Aucun fichier audio', 400);
  const audio = await AudioMessage.create({
    user: userId,
    url: file.path,
    publicId: file.filename,
    size: file.size,
    format: file.mimetype.split('/')[1],
  });
  return audio;
};

exports.getUserAudios = async (userId) => {
  return await AudioMessage.find({ user: userId }).sort({ createdAt: -1 });
};

exports.deleteAudio = async (userId, publicId) => {
  const audio = await AudioMessage.findOne({ user: userId, publicId });
  if (!audio) throw new AppError('Audio non trouvé', 404);
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
  await audio.deleteOne();
};