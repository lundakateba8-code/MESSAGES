const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});