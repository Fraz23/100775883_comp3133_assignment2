const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/comp3133_assignment2',
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret_key',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200'
};
