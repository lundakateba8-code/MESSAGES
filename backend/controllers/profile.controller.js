const fs = require('fs').promises;
const path = require('path');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.message) {
      updates['profile.message.text'] = req.body.message;
      updates['profile.message.updatedAt'] = Date.now();
    }
    if (req.file) {
      if (req.user.profile.photo.url && req.user.profile.photo.url !== 'default-avatar.png') {
        const oldPath = path.join(__dirname, '../uploads/profiles', req.user.profile.photo.url);
        await fs.unlink(oldPath).catch(() => {});
      }
      updates['profile.photo.url'] = req.file.filename;
      updates['profile.photo.uploadedAt'] = Date.now();
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.status(200).json({ success: true, profile: user.profile });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
};