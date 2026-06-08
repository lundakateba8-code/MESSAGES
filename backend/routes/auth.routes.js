// backend/controllers/auth.controller.js

// Exemple de fonction register
exports.register = (req, res) => {
  res.status(200).json({ message: "Inscription OK" });
};

// Exemple de fonction login
exports.login = (req, res) => {
  res.status(200).json({ message: "Connexion OK" });
};

// Exemple de fonction logout
exports.logout = (req, res) => {
  res.status(200).json({ message: "Déconnexion OK" });
};