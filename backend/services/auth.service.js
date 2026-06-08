const User = require('../models/user');
const { generateToken } = require('../config/jwt');
const { AppError } = require('../utils/errors');

exports.register = async (userData) => {
  const { name, email, password } = userData;
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email déjà utilisé', 400);
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id, user.role);
  return { user: { id: user._id, name, email, role: user.role, avatar: user.avatar }, token };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Identifiants invalides', 401);
  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new AppError('Identifiants invalides', 401);
  const token = generateToken(user._id, user.role);
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, token };
};