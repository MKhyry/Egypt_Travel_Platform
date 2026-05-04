const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const placeRoutes = require('./routes/place.routes');
const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const hotelRoutes = require('./routes/hotel.routes');
const packageRoutes = require('./routes/package.routes');
const bookingRoutes = require('./routes/booking.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();

app.use(helmet());
// CORS config: use CLIENT_URL env var (comma-separated for multiple URLs) or default to localhost
const corsOptions = {
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
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
app.use('/api/bookings', bookingRoutes);
app.use('/api/search', searchRoutes);

// Error handling middleware (must be last)
const { handleError } = require('./middleware/error.middleware');
app.use(handleError);

module.exports = app;
