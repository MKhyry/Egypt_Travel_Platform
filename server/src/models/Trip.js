const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    places: [
      {
        place: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Place',
        },
        day: {
          type: Number,
          required: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    hotels: [
      {
        hotel: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Hotel',
        },
        checkIn: {
          type: Date,
          required: true,
        },
        nights: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    status: {
      type: String,
      enum: ['planning', 'confirmed', 'completed'],
      default: 'planning',
    },
    totalDays: {
      type: Number,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Auto-calculate totalDays before saving
tripSchema.pre('save', function () {
  if (this.startDate && this.endDate) {
    const diff = this.endDate - this.startDate;
    this.totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
});

module.exports = mongoose.model('Trip', tripSchema);