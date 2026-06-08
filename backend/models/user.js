const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Nom d\'utilisateur requis'],
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
    minlength: 6,
    select: false
  },
  profile: {
    photo: {
      url: { type: String, default: 'default-avatar.png' },
      uploadedAt: { type: Date, default: Date.now }
    },
    message: {
      text: { type: String, default: 'Bienvenue sur mon profil ! 👋', maxlength: 500 },
      updatedAt: { type: Date, default: Date.now }
    },
    welcomeAudio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AudioMessage'
    },
    audioMessages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AudioMessage'
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);