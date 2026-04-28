const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const placeRoutes = require('./routes/place.routes');
const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const hotelRoutes = require('./routes/hotel.routes');
const packageRoutes = require('./routes/package.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running ✅' });
});
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/packages', packageRoutes);

module.exports = app;
