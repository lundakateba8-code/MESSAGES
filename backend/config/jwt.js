module.exports = {
  secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
  expiresIn: '7d',
  issuer: 'photo-message-app',
  audience: 'photo-message-users'
};