require('dotenv').config();
const connectDB = require('../src/config/db');
const app = require('../src/app');

// Cache DB connection to avoid reconnecting on every request
let dbConnectPromise;

const getApp = async () => {
  if (!dbConnectPromise) {
    dbConnectPromise = connectDB();
  }
  await dbConnectPromise;
  return app;
};

// Vercel serverless function handler
module.exports = async (req, res) => {
  const appInstance = await getApp();
  appInstance(req, res);
};
