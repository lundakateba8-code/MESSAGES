const User = require('../models/user');
const cloudinary = require('../config/cloudinary');
const { AppError } = require('../utils/errors');

exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new AppError('Utilisateur non trouvé', 404);
  return user;
};

exports.updateProfile = async (userId, updates) => {
  const allowed = ['name', 'email', 'bio'];
  const filtered = {};
  for (let key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }
  const user = await User.findByIdAndUpdate(userId, filtered, { new: true, runValidators: true }).select('-password');
  return user;
};

exports.updateAvatar = async (userId, file) => {
  if (!file) throw new AppError('Aucune image', 400);
  const user = await User.findById(userId);
  if (user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId);
  }
  user.avatar = file.path;
  user.avatarPublicId = file.filename;
  await user.save();
  return user.avatar;
};