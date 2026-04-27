const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [String],
    location: {
      lat: Number,
      lng: Number,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: [String],
    stars: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    nearbyPlaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);