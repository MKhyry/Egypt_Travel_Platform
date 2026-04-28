const mongoose = require('mongoose');

const itineraryStepSchema = new mongoose.Schema(
  {
    dayLabel: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    meals: { type: String },
    stay: { type: String },
    accentIcon: { type: String },
    accentLabel: { type: String },
  },
  { _id: false }
);

const hotelPreviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String },
    description: { type: String },
    image: { type: String },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    duration: { type: String, required: true },
    days: { type: Number, required: true },
    cities: { type: String, required: true },
    price: { type: Number, required: true },
    tier: {
      type: String,
      enum: ['Luxury', 'Boutique', 'Essential'],
      required: true,
    },
    description: { type: String, required: true },
    heroDescription: { type: String },
    image: { type: String },
    routeMapImage: { type: String },
    regions: [{ type: String }],
    route: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    includes: [{ type: String }],
    icons: [{ type: String }],
    itinerary: [itineraryStepSchema],
    hotels: [hotelPreviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
