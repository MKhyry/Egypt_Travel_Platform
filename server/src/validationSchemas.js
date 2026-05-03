const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format');

// Auth schemas
const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
  }),
};

// Place schemas
const getPlacesSchema = {
  query: Joi.object({
    city: Joi.string().trim(),
    category: Joi.string().trim(),
  }),
};

const getPlaceByIdSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

// Trip schemas
const createTripSchema = {
  body: Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    notes: Joi.string().trim().max(500).allow(''),
  }),
};

const tripIdSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const addPlaceToTripSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    placeId: objectId.required(),
    day: Joi.number().integer().min(1).required(),
  }),
};

const removePlaceFromTripSchema = {
  params: Joi.object({
    id: objectId.required(),
    placeId: objectId.required(),
  }),
};

const addHotelToTripSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    hotelId: objectId.required(),
    checkIn: Joi.date().iso().required(),
    nights: Joi.number().integer().min(1).required(),
  }),
};

// Hotel schemas
const getHotelsSchema = {
  query: Joi.object({
    city: Joi.string().trim(),
    stars: Joi.number().integer().min(1).max(5),
    maxPrice: Joi.number().min(0),
  }),
};

const getHotelByIdSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const getHotelSuggestionsSchema = {
  params: Joi.object({
    tripId: objectId.required(),
  }),
};

// Package schemas
const getPackagesSchema = {
  query: Joi.object({
    tier: Joi.string().valid('Luxury', 'Boutique', 'Essential'),
    region: Joi.string().trim(),
    duration: Joi.string().valid('short', 'medium', 'long'),
  }),
};

const getPackageByIdSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

// Admin Place schemas
const createPlaceSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).required(),
    city: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    images: Joi.array().items(Joi.string()).min(1).required(),
    rating: Joi.number().min(0).max(5),
    visitDuration: Joi.number().min(1),
    location: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    }).optional(),
    tips: Joi.array().items(Joi.string()).optional(),
  }),
};

const updatePlaceSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2),
    city: Joi.string().trim(),
    category: Joi.string().trim(),
    description: Joi.string().trim(),
    images: Joi.array().items(Joi.string()),
    rating: Joi.number().min(0).max(5),
    visitDuration: Joi.number().min(1),
    location: Joi.object({
      lat: Joi.number(),
      lng: Joi.number(),
    }).optional(),
    tips: Joi.array().items(Joi.string()).optional(),
  }),
};

// Admin Hotel schemas
const createHotelSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).required(),
    city: Joi.string().trim().required(),
    stars: Joi.number().integer().min(1).max(5).required(),
    pricePerNight: Joi.number().min(0).required(),
    images: Joi.array().items(Joi.string()).min(1).required(),
    description: Joi.string().trim().allow(''),
    nearbyPlaces: Joi.array().items(Joi.string()).optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
  }),
};

const updateHotelSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2),
    city: Joi.string().trim(),
    stars: Joi.number().integer().min(1).max(5),
    pricePerNight: Joi.number().min(0),
    images: Joi.array().items(Joi.string()),
    description: Joi.string().trim().allow(''),
    nearbyPlaces: Joi.array().items(Joi.string()).optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
  }),
};

// Admin Package schemas
const createPackageSchema = {
  body: Joi.object({
    title: Joi.string().trim().min(3).required(),
    days: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().required(),
    tier: Joi.string().valid('Luxury', 'Boutique', 'Essential').required(),
    regions: Joi.array().items(Joi.string()).min(1).required(),
    itinerary: Joi.array().items(Joi.object()).optional(),
    hotels: Joi.array().items(Joi.object()).optional(),
    includes: Joi.array().items(Joi.string()).optional(),
  }),
};

const updatePackageSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    title: Joi.string().trim().min(3),
    days: Joi.number().integer().min(1),
    price: Joi.number().min(0),
    description: Joi.string().trim(),
    image: Joi.string().trim(),
    tier: Joi.string().valid('Luxury', 'Boutique', 'Essential'),
    regions: Joi.array().items(Joi.string()),
    itinerary: Joi.array().items(Joi.object()).optional(),
    hotels: Joi.array().items(Joi.object()).optional(),
    includes: Joi.array().items(Joi.string()).optional(),
  }),
};

// Booking schemas
const createBookingSchema = {
  body: Joi.object({
    tripId: objectId,
    packageId: objectId,
    startDate: Joi.date().iso().min('now').required(),
    guests: Joi.number().integer().min(1).required(),
    contactName: Joi.string().trim().min(2).required(),
    contactEmail: Joi.string().trim().lowercase().email().required(),
    contactPhone: Joi.string().trim().pattern(/^[+\d\s-]{7,20}$/),
    notes: Joi.string().trim().max(500).allow(''),
  }).or('tripId', 'packageId'),
};

const bookingIdSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  getPlacesSchema,
  getPlaceByIdSchema,
  createPlaceSchema,
  updatePlaceSchema,
  createTripSchema,
  tripIdSchema,
  addPlaceToTripSchema,
  removePlaceFromTripSchema,
  addHotelToTripSchema,
  getHotelsSchema,
  getHotelByIdSchema,
  getHotelSuggestionsSchema,
  createHotelSchema,
  updateHotelSchema,
  getPackagesSchema,
  getPackageByIdSchema,
  createPackageSchema,
  updatePackageSchema,
  createBookingSchema,
  bookingIdSchema,
};
