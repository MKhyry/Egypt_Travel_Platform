const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const placeRoutes = require('./routes/place.routes'); // 👈 add this
const authRoutes = require('./routes/auth.routes'); // 👈 add this
const tripRoutes = require('./routes/trip.routes'); // 👈 add this
const hotelRoutes = require('./routes/hotel.routes'); // 👈 add


const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running ✅' });
});
app.use('/api/auth', authRoutes);  // 👈 add this
app.use('/api/places', placeRoutes); // 👈 add this
app.use('/api/trips', tripRoutes); // 👈 add this
app.use('/api/hotels', hotelRoutes); // 👈 add


module.exports = app;