class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  
  if (err.name === 'CastError') {
    error = new AppError('Ressource non trouvée', 404);
  }
  if (err.code === 11000) {
    error = new AppError('Donnée déjà existante', 400);
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur serveur'
  });
};

module.exports = { AppError, errorHandler };