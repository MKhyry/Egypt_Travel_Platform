require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');

const dataDir = path.join(__dirname, '../data');

const loadJSON = (file) => {
  const filePath = path.join(dataDir, file);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const seedAll = async () => {
  try {
    console.log('--- Starting Full Seed ---');

    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB');

    // Load JSON files
    const placesData = loadJSON('places.json');
    const hotelsData = loadJSON('hotels.json');
    const packagesData = loadJSON('packages.json');
    console.log(` Loaded: ${placesData.length} places, ${hotelsData.length} hotels, ${packagesData.length} packages`);

    // Clear existing collections
    console.log('\n Clearing existing collections...');
    await Place.deleteMany({});
    console.log(' Cleared places collection');
    await Hotel.deleteMany({});
    console.log(' Cleared hotels collection');
    await Package.deleteMany({});
    console.log(' Cleared packages collection');

    // Seed places
    console.log('\n Seeding places...');
    const placesResult = await Place.insertMany(placesData);
    console.log(` Seeded ${placesResult.length} places`);

    // Fetch seeded places to get their _id values
    const seededPlaces = await Place.find({}, '_id city');
    console.log(` Fetched ${seededPlaces.length} seeded places for linking`);

    // Link hotel nearbyPlaces by matching city
    console.log('\n Linking hotel nearbyPlaces by city...');
    const hotelsToSeed = hotelsData.map((hotel) => {
      const nearby = seededPlaces
        .filter((p) => p.city === hotel.city)
        .map((p) => p._id);
      return { ...hotel, nearbyPlaces: nearby };
    });
    const hotelsResult = await Hotel.insertMany(hotelsToSeed);
    console.log(` Seeded ${hotelsResult.length} hotels with linked nearbyPlaces`);

    // Seed packages
    console.log('\n Seeding packages...');
    const packagesResult = await Package.insertMany(packagesData);
    console.log(` Seeded ${packagesResult.length} packages`);

    console.log('\n--- Seed Complete ---');

    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error(' Seed error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedAll();
