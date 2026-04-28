require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
const Place = require('../models/Place');

const seedHotels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Get place IDs for nearbyPlaces
    const places = await Place.find({}, '_id city');
    const cairoPlaces = places.filter(p => p.city === 'Cairo').map(p => p._id);
    const gizaPlaces = places.filter(p => p.city === 'Giza').map(p => p._id);
    const luxorPlaces = places.filter(p => p.city === 'Luxor').map(p => p._id);
    const aswanPlaces = places.filter(p => p.city === 'Aswan').map(p => p._id);
    const alexandriaPlaces = places.filter(p => p.city === 'Alexandria').map(p => p._id);
    const hurghadaPlaces = places.filter(p => p.city === 'Hurghada').map(p => p._id);
    const sharmPlaces = places.filter(p => p.city === 'Sharm El Sheikh').map(p => p._id);

    await Hotel.deleteMany({});
    console.log("🗑️  Cleared existing hotels");

    const hotels = [
      {
        name: "Marriott Mena House",
        city: "Giza",
        description: "A storied property at the foot of the pyramids with gardens, history, and iconic views of the Great Pyramid.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuA66LAA9sa51VRE_HO6gvFcvAIbxgltDucEf7B_ShSeAIRNUNbMOHeBbWlVUMa27EVFhi6UYbNpYv1SoyPvRRhvzuhfihPrynN10okZmhQsEfQ8F8ceg81b5bA23GBYEp6BdaqPLbOhkPZf2DrSmtiFdTN6DVYaECgmyALel9ClIPY1ZW_cw9lFtSOX0neJDqqbeXQjmbA3K20Uv50KOsp_OV-7CendfxyC2tqGnOxJpZCGg5e-Si4_DfaFF4ZE2gYU6MU2PXNIBME"],
        location: { lat: 29.9753, lng: 31.1324 },
        rating: 4.5,
        pricePerNight: 280,
        amenities: ["Free WiFi", "Swimming pool", "Spa", "Pyramid view rooms", "Restaurant"],
        stars: 5,
        nearbyPlaces: [...gizaPlaces.slice(0, 2), ...cairoPlaces.slice(0, 1)]
      },
      {
        name: "Sofitel Winter Palace",
        city: "Luxor",
        description: "Classic Nile-side grandeur paired with easy access to Luxor's east and west bank monuments.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAWcds-pDUOGi3CYKE4sLjbquc6rlcO5QcgclN3TtEcTwx6Gsqhe3uvJhTietmhHxSSNDx_RjKNZSIXIZ9xlU4rvcNwfAoQ5-maSDO0SGoJdbl3XM_jEyXIFTtLnCDxRo8HVqDJLHoxtgUtwY7oXtvlUA4Pl3t6x3In2YcW55R3FXYtZbGTIhOF_Xf6Ex8riRBhhD2B1eF4Irm8VE48vhTkvOS8Uk-od3tAXdMeNzRJ6sxH3najYixPhHj7PhDLkPWUSPtq9YHKXWM"],
        location: { lat: 25.6969, lng: 32.6396 },
        rating: 4.7,
        pricePerNight: 220,
        amenities: ["Nile view", "Swimming pool", "Spa", "Colonial architecture", "Fine dining"],
        stars: 5,
        nearbyPlaces: luxorPlaces.slice(0, 3)
      },
      {
        name: "Sofitel Legend Old Cataract",
        city: "Aswan",
        description: "Legendary hotel perched on the Nile with Agatha Christie connections and stunning views of the river and desert.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBHegEuZ7OVgtflLBBJ3EM9N171POXQeePLnNciFllvhrIx404grsu35VksYrWM0tsevzb0usFR9wt_Wq4ye6DP8xga12oMWn3qBzXZxZivkz5pFRoBqv_8MBf72OmsoI2rzJamhCwqvgZI1u09GVvwIGaxX61RuDwUwfDpNWReyW-liYb_sS3aZ5rBpj1RM3R4zLXracXJn-NYSZanhJGjSSPkLKiLuxhkU5KCFyBapMC99stHLWAsSq4Cr192j0mCo4-nfJxnf2k"],
        location: { lat: 24.0886, lng: 32.8779 },
        rating: 4.8,
        pricePerNight: 310,
        amenities: ["Nile view", "Spa", "Swimming pool", "Butler service", "Luxury suites"],
        stars: 5,
        nearbyPlaces: aswanPlaces.slice(0, 2)
      },
      {
        name: "Steigenberger Aldau Beach",
        city: "Hurghada",
        description: "A broad beachfront base with calm luxury and easy access to reef excursions on the Red Sea.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBHegEuZ7OVgtflLBBJ3EM9N171POXQeePLnNciFllvhrIx404grsu35VksYrWM0tsevzb0usFR9wt_Wq4ye6DP8xga12oMWn3qBzXZxZivkz5pFRoBqv_8MBf72OmsoI2rzJamhCwqvgZI1u09GVvwIGaxX61RuDwUwfDpNWReyW-liYb_sS3aZ5rBpj1RM3R4zLXracXJn-NYSZanhJGjSSPkLKiLuxhkU5KCFyBapMC99stHLWAsSq4Cr192j0mCo4-nfJxnf2k"],
        location: { lat: 27.2579, lng: 33.8116 },
        rating: 4.6,
        pricePerNight: 180,
        amenities: ["Private beach", "All-inclusive", "Diving center", "Water sports", "Kids club"],
        stars: 5,
        nearbyPlaces: hurghadaPlaces.slice(0, 2)
      },
      {
        name: "Four Seasons Resort Sharm El Sheikh",
        city: "Sharm El Sheikh",
        description: "A polished Red Sea retreat suited to diving, spa time, and elegant downtime overlooking the coral reefs.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCTjkZpOQi0HlhKgfGmTy9kPAbceQBAEyZT5XrgOfWVPMa9CqRMsb48SoOtbbbf3DkkH3iXZ3aN4oAgD9UlUFcshVqtzJy5NIemwyVn5DQcr8s5IerQL_ftyHdvRHZPLcA1MlzPnhJUWe9C4DNIL_clZZTDKwUvSj7RKvd0fEDw7AJMxGpGJQp0UIyKVOvPGHJEQqRiPNhMKxBD-2SSY-MLrHM8ySOqHW9x7vM4TNbHDEUb4URSyi9tQjXifMoKWn-gFMmvH2awVok"],
        location: { lat: 27.9158, lng: 34.3296 },
        rating: 4.7,
        pricePerNight: 290,
        amenities: ["Private beach", "Infinity pool", "Spa", "Diving center", " fine dining"],
        stars: 5,
        nearbyPlaces: sharmPlaces.slice(0, 2)
      },
      {
        name: "Le Riad Hotel de Charme",
        city: "Cairo",
        description: "A small-scale luxury base near old Cairo's texture, markets, and atmosphere. Boutique charm with modern comfort.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCDjIBCV2bAh1l-XuXxg7DdFN61K2tMkl1D-knXeJ-LufLEMdyUqZwOah-I4jW6bQ_ntiV7RZlEI8iSErVUdPoZN7YtRUmhfq7hCirVVpNBGACJIHJ9FbW6Hy5F1WdKKEyT6S6Hfkp1DImsPDgIOvh1HwJyXZTcSiTi7LcjfXlRGxxk-S7nIKO6OSksO94SAEkgz7-wcSdMynTdDUiVFZ_Avd3zjNTAsXhf7RT2ayNtq5s-l12XxIUdz57OMNomOir8OxjhsHFI7Bk"],
        location: { lat: 30.0478, lng: 31.2622 },
        rating: 4.4,
        pricePerNight: 95,
        amenities: ["Boutique style", "Rooftop terrace", "Free WiFi", "Breakfast included", "Central location"],
        stars: 3,
        nearbyPlaces: cairoPlaces.slice(0, 3)
      },
      {
        name: "Steigenberger Nile Palace",
        city: "Luxor",
        description: "A comfortable central base for temple-focused days and easy riverfront evenings in the heart of Luxor.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAWcds-pDUOGi3CYKE4sLjbquc6rlcO5QcgclN3TtEcTwx6Gsqhe3uvJhTietmhHxSSNDx_RjKNZSIXIZ9xlU4rvcNwfAoQ5-maSDO0SGoJdbl3XM_jEyXIFTtLnCDxRo8HVqDJLHoxtgUtwY7oXtvlUA4Pl3t6x3In2YcW55R3FXYtZbGTIhOF_Xf6Ex8riRBhhD2B1eF4Irm8VE48vhTkvOS8Uk-od3tAXdMeNzRJ6sxH3najYixPhHj7PhDLkPWUSPtq9YHKXWM"],
        location: { lat: 25.6872, lng: 32.6392 },
        rating: 4.5,
        pricePerNight: 160,
        amenities: ["Nile view", "Swimming pool", "Restaurant", "Fitness center", "Airport shuttle"],
        stars: 4,
        nearbyPlaces: luxorPlaces.slice(0, 2)
      },
      {
        name: "Paradise Inn Windsor Palace",
        city: "Alexandria",
        description: "A classic city stay on the Mediterranean corniche that suits a slower coastal cultural itinerary.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCDjIBCV2bAh1l-XuXxg7DdFN61K2tMkl1D-knXeJ-LufLEMdyUqZwOah-I4jW6bQ_ntiV7RZlEI8iSErVUdPoZN7YtRUmhfq7hCirVVpNBGACJIHJ9FbW6Hy5F1WdKKEyT6S6Hfkp1DImsPDgIOvh1HwJyXZTcSiTi7LcjfXlRGxxk-S7nIKO6OSksO94SAEkgz7-wcSdMynTdDUiVFZ_Avd3zjNTAsXhf7RT2ayNtq5s-l12XxIUdz57OMNomOir8OxjhsHFI7Bk"],
        location: { lat: 31.2156, lng: 29.9245 },
        rating: 4.3,
        pricePerNight: 110,
        amenities: ["Sea view", "Restaurant", "Free WiFi", "Private beach access", "Breakfast buffet"],
        stars: 4,
        nearbyPlaces: alexandriaPlaces.slice(0, 2)
      },
      {
        name: "White Desert Eco Camp",
        city: "Farafra",
        description: "A simple but atmospheric overnight setup focused on the landscape, not hotel formality. Perfect for stargazing.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDtlACg03CFW0ydSpAjrkIRhWbc9dzWsxb7vF3p-R06YIafiJoGAHWF9MPQSTrBtSygqRe2GDTECs9-BMDzj3_r8UazaE6WMvMAlSxl8eWH9ZC3duRDbf697zz8pXRcnl67BuZ6yJ7nZnHUSckQZSzni5-6ifvNRdX_lLmTOSXbQyRNw1GJh0JeFbe8yGofEJgFF3xy9dlfD2ht0gw7iY8Au7MJdRVUjO3U2AznOH9K1LHwiXbF3csdmmXGJA_7gcudgXGwTa9AS80"],
        location: { lat: 27.3761, lng: 28.3065 },
        rating: 4.6,
        pricePerNight: 60,
        amenities: ["Desert camping", "Traditional meals", "Stargazing", "4x4 transfers", "Bedouin experience"],
        stars: 1,
        nearbyPlaces: []
      }
    ];

    const result = await Hotel.insertMany(hotels);
    console.log(`✅ Seeded ${result.length} hotels`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedHotels();
