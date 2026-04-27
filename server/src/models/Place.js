const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ['historical', 'nature', 'beach', 'adventure', 'cultural'],
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
    visitDuration: {
      type: Number,  // in hours
      default: 2,
    },
    tips: [String],
  },
  { timestamps: true }  // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model('Place', placeSchema);