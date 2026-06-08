const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('../../config/database');
const routes = require('../../routes');
const errorHandler = require('../../middleware/errorHandler');

dotenv.config({ path: './.env' });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', routes);

app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.use(errorHandler);

module.exports = app;