exports.validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || username.length < 3) return res.status(400).json({ message: 'Nom d\'utilisateur trop court' });
  if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) return res.status(400).json({ message: 'Email invalide' });
  if (!password || password.length < 6) return res.status(400).json({ message: 'Mot de passe trop court' });
  next();
};