const mongoose = require('mongoose');

const audioMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, default: 'Message vocal' },
  audioFile: {
    filename: { type: String, required: true },
    originalName: String,
    mimeType: String,
    size: Number,
    duration: Number,
    path: String,
    url: String
  },
  settings: {
    isPublic: { type: Boolean, default: false },
    allowDownload: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AudioMessage', audioMessageSchema);