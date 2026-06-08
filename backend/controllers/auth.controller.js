const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');
const { AppError } = require('../middleware/errorHandler');

const signToken = (user) => {
  return jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile
    }
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new AppError('Utilisateur déjà existant', 400));
    }
    const user = await User.create({ username, email, password });
    createSendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Email et mot de passe requis', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Email ou mot de passe incorrect', 401));
    }
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};