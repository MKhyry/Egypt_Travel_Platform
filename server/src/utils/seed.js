const mongoose = require('mongoose');
const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
require('dotenv').config();

const places = [
  {
    name: 'The Great Pyramid of Giza',
    city: 'Giza',
    category: 'historical',
    description: 'One of the Seven Wonders of the Ancient World.',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/600px-Kheops-Pyramid.jpg'],
    location: { lat: 29.9792, lng: 31.1342 },
    rating: 5,
    visitDuration: 3,
    tips: ['Visit early morning to avoid crowds', 'Hire a local guide'],
  },
  {
    name: 'Luxor Temple',
    city: 'Luxor',
    category: 'historical',
    description: 'A large Ancient Egyptian temple complex on the east bank of the Nile.',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Luxor_temple_at_night.jpg/600px-Luxor_temple_at_night.jpg'],
    location: { lat: 25.6997, lng: 32.6392 },
    rating: 4.8,
    visitDuration: 2,
    tips: ['Beautiful at night when lit up', 'Combine with Karnak Temple'],
  },
  {
    name: 'White Desert',
    city: 'Farafra',
    category: 'nature',
    description: 'Surreal landscape of white chalk rock formations.',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/White_Desert_Egypt.jpg/600px-White_Desert_Egypt.jpg'],
    location: { lat: 27.0539, lng: 27.9717 },
    rating: 4.9,
    visitDuration: 6,
    tips: ['Camp overnight for stargazing', 'Go with a guided tour'],
  },
];

const hotels = [
  {
    name: 'Mena House Hotel',
    city: 'Giza',
    description: 'Iconic hotel with direct views of the Pyramids.',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Mena_House_Hotel.jpg/600px-Mena_House_Hotel.jpg'],
    location: { lat: 29.9764, lng: 31.1308 },
    rating: 4.8,
    pricePerNight: 250,
    stars: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
  },
  {
    name: 'Sofitel Winter Palace',
    city: 'Luxor',
    description: 'A legendary Victorian palace hotel on the Nile.',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Luxor_Sofitel_Winter_Palace.jpg/600px-Luxor_Sofitel_Winter_Palace.jpg'],
    location: { lat: 25.6989, lng: 32.6391 },
    rating: 4.7,
    pricePerNight: 180,
    stars: 5,
    amenities: ['WiFi', 'Pool', 'Garden', 'Restaurant', 'Bar'],
  },
  {
    name: 'Desert Lodge',
    city: 'Farafra',
    description: 'Eco-lodge near the White Desert with stunning views.',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/White_Desert_Egypt.jpg/600px-White_Desert_Egypt.jpg'],
    location: { lat: 27.0601, lng: 27.9683 },
    rating: 4.5,
    pricePerNight: 80,
    stars: 3,
    amenities: ['WiFi', 'Desert Tours', 'Restaurant'],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    await Place.deleteMany({});
    await Hotel.deleteMany({});
    console.log('Cleared existing data...');

    const seededPlaces = await Place.insertMany(places);
    console.log('✅ Seeded 3 places');

    // Link hotels to nearby places by matching city
    const hotelsWithPlaces = hotels.map((hotel) => ({
      ...hotel,
      nearbyPlaces: seededPlaces
        .filter((p) => p.city === hotel.city)
        .map((p) => p._id),
    }));

    await Hotel.insertMany(hotelsWithPlaces);
    console.log('✅ Seeded 3 hotels with nearby places linked');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();