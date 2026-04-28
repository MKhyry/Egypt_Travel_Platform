require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('../models/Place');

const places = [
  {
    name: "Great Pyramids of Giza",
    city: "Giza",
    category: "historical",
    description: "The only surviving wonder of the ancient world, built over 4,500 years ago. The complex includes the Great Pyramid of Khufu, the Pyramid of Khafre, and the Great Sphinx.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuC8yJCG_yGTTQ4L_k3tACmYx1XEMSi-e__WNlOaz8IjhcCPhElXkl1_7xad3EuMKZF-JSWD1_XWTLrItWyL7R9hUcJHjCVzfWL99VwDlNiFE4Dwehz-h-0hfxN_smIAMgy5gdKpLnUW82RasX7Ru3ucKyd2yDIw27AwetX-Cl5Tr38TVmphaw3SRXNhRqOiZDw7uH71FbNCtOMCf-obPa72RNN6im4Txcb-ugkXvGW-tgnPZ_pNTfftOS2T8axHL-Mo9gxymBa_92E"],
    location: { lat: 29.9792, lng: 31.1342 },
    rating: 4.9,
    visitDuration: 4,
    tips: ["Best visited at sunrise", "Buy tickets online in advance", "Camel rides available but negotiate price"]
  },
  {
    name: "Karnak Temple",
    city: "Luxor",
    category: "historical",
    description: "One of the largest religious complexes ever built. The temple was constructed over a 2,000-year period, primarily dedicated to the god Amun.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDC2ItatpzjOuC810H4DiK-UF2bfVg9KdfJwymrjAQK-TZM2iqKOhLyjbVcyEPJi6k7eeJdug0CLNRjBblOCYobWw5PIVqatW3EmQULE2T-1fGoOP7godsTFB5NDUbqUXO0yvujp0c2qSeE8Vkx8qFYTMFmNqiLNE-9PbBNSPbE66cFXYiYZLApbmXjFwj1UCv2QXldFwiMvxWiONcIEuU0smkzPBz_nyZMhSlcRri7ZSQfFUdFigxyGepyWR4gJWJdIGPBRGGpGu0"],
    location: { lat: 25.7188, lng: 32.6574 },
    rating: 4.8,
    visitDuration: 3,
    tips: ["Visit early morning", "Hire a licensed guide", "Sound and light show in the evening"]
  },
  {
    name: "Valley of the Kings",
    city: "Luxor",
    category: "historical",
    description: "The royal necropolis of the New Kingdom pharaohs, containing elaborately decorated tombs including Tutankhamun's tomb discovered in 1922.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCgZoWx3CImobkPiqCORQYZR4jza8vBfK0YuliKF5q7Ie2q3n1BpH1mS5eSNZV7LXM6MCiq2XZfT1MZETy5k3IAWvVfbdA7ascs--ejtA2dHMfwZXk8RsIiV_YiUQglrLtUisSB9hQwWZDJbntPjK9JTpKL0qw0pVCpFY5EO5jMYvwV5gTYnZausoI-zLbNK1WOXvSUr-mViZC8Z4pkqwqMf-YSjzjooUM56jATqu5TF5hB5ueHLVOG0D8jPdOIdR_vo3vREekHiho"],
    location: { lat: 25.7402, lng: 32.6014 },
    rating: 4.9,
    visitDuration: 4,
    tips: ["Tomb of Seti I is a must-see", "Bring water, it gets hot", "Photography not allowed inside tombs"]
  },
  {
    name: "Philae Temple",
    city: "Aswan",
    category: "historical",
    description: "A beautiful temple complex on an island in the Nile, dedicated to the goddess Isis. It was relocated stone by stone when the Aswan High Dam was built.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBHegEuZ7OVgtflLBBJ3EM9N171POXQeePLnNciFllvhrIx404grsu35VksYrWM0tsevzb0usFR9wt_Wq4ye6DP8xga12oMWn3qBzXZxZivkz5pFRoBqv_8MBf72OmsoI2rzJamhCwqvgZI1u09GVvwIGaxX61RuDwUwfDpNWReyW-liYb_sS3aZ5rBpj1RM3R4zLXracXJn-NYSZanhJGjSSPkLKiLuxhkU5KCFyBapMC99stHLWAsSq4Cr192j0mCo4-nfJxnf2k"],
    location: { lat: 24.0252, lng: 32.8849 },
    rating: 4.7,
    visitDuration: 3,
    tips: ["Take a motorboat to the island", "Visit at sunset for best lighting", "Sound and light show available"]
  },
  {
    name: "Library of Alexandria",
    city: "Alexandria",
    category: "cultural",
    description: "A modern library and cultural center built to commemorate the ancient Library of Alexandria, one of the largest and most significant libraries of the ancient world.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBLxW4QH9Kgv7RUUGFqOXH_yGfULmupukrpUM-1MtujoWBoEtGX_yGLHOR-6VyI7XDZut2DuJUElwpNbgkQoxTIpjzGMd8vlT5xSz1LB8u7oKUF79lmjKsLK1xECjWDYAg_wN7kX_q9N_xyBZFFMSWysSOkQvamIoc_lftv16Ar9-sT5HdqiO6fcCo08EN0GS6nTPNUErJBwJ5Ep_hjNDgy_0Em7EiqbJH2NoYWdutET4_RcfN4uWD_4Y8hUmRPSNGLBuB-YuMEf4U"],
    location: { lat: 31.2089, lng: 29.9088 },
    rating: 4.6,
    visitDuration: 2,
    tips: ["Free guided tours available", "The manuscript museum is excellent", "Rooftop offers great sea views"]
  },
  {
    name: "Khan El Khalili Bazaar",
    city: "Cairo",
    category: "cultural",
    description: "A major souk in Islamic Cairo, one of the oldest bazaars in the Middle East. A maze of narrow alleys filled with shops, cafes, and workshops.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBLxW4QH9Kgv7RUUGFqOXH_yGfULmupukrpUM-1MtujoWBoEtGX_yGLHOR-6VyI7XDZut2DuJUElwpNbgkQoxTIpjzGMd8vlT5xSz1LB8u7oKUF79lmjKsLK1xECjWDYAg_wN7kX_q9N_xyBZFFMSWysSOkQvamIoc_lftv16Ar9-sT5HdqiO6fcCo08EN0GS6nTPNUErJBwJ5Ep_hjNDgy_0Em7EiqbJH2NoYWdutET4_RcfN4uWD_4Y8hUmRPSNGLBuB-YuMEf4U"],
    location: { lat: 30.0478, lng: 31.2622 },
    rating: 4.5,
    visitDuration: 3,
    tips: ["Best visited in the evening", "Bargain for better prices", "Try the traditional coffee shops"]
  },
  {
    name: "White Desert",
    city: "Farafra",
    category: "nature",
    description: "A stunning national park known for its surreal white chalk rock formations shaped by wind and sand over millennia. A unique camping and stargazing destination.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDtlACg03CFW0ydSpAjrkIRhWbc9dzWsxb7vF3p-R06YIafiJoGAHWF9MPQSTrBtSygqRe2GDTECs9-BMDzj3_r8UazaE6WMvMAlSxl8eWH9ZC3duRDbf697zz8pXRcnl67BuZ6yJ7nZnHUSckQZSzni5-6ifvNRdX_lLmTOSXbQyRNw1GJh0JeFbe8yGofEJgFF3xy9dlfD2ht0gw7iY8Au7MJdRVUjO3U2AznOH9K1LHwiXbF3csdmmXGJA_7gcudgXGwTa9AS80"],
    location: { lat: 27.3761, lng: 28.3065 },
    rating: 4.8,
    visitDuration: 8,
    tips: ["Bring warm clothes for night", "4x4 required", "Best seen during full moon"]
  },
  {
    name: "Sharm El Sheikh Reefs",
    city: "Sharm El Sheikh",
    category: "beach",
    description: "World-renowned coral reefs perfect for snorkeling and diving. Ras Mohammed National Park offers some of the best underwater experiences in the Red Sea.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBHegEuZ7OVgtflLBBJ3EM9N171POXQeePLnNciFllvhrIx404grsu35VksYrWM0tsevzb0usFR9wt_Wq4ye6DP8xga12oMWn3qBzXZxZivkz5pFRoBqv_8MBf72OmsoI2rzJamhCwqvgZI1u09GVvwIGaxX61RuDwUwfDpNWReyW-liYb_sS3aZ5rBpj1RM3R4zLXracXJn-NYSZanhJGjSSPkLKiLuxhkU5KCFyBapMC99stHLWAsSq4Cr192j0mCo4-nfJxnf2k"],
    location: { lat: 27.9158, lng: 34.3296 },
    rating: 4.7,
    visitDuration: 6,
    tips: ["Best diving season: March-May", "Book boat trips in advance", "Coral reef protection rules apply"]
  },
  {
    name: "Siwa Oasis",
    city: "Siwa",
    category: "nature",
    description: "A tranquil oasis near the Libyan border, known for its olive groves, natural springs, and the ancient Oracle Temple of Amun where Alexander the Great was declared a god.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBLxW4QH9Kgv7RUUGFqOXH_yGfULmupukrpUM-1MtujoWBoEtGX_yGLHOR-6VyI7XDZut2DuJUElwpNbgkQoxTIpjzGMd8vlT5xSz1LB8u7oKUF79lmjKsLK1xECjWDYAg_wN7kX_q9N_xyBZFFMSWysSOkQvamIoc_lftv16Ar9-sT5HdqiO6fcCo08EN0GS6nTPNUErJBwJ5Ep_hjNDgy_0Em7EiqbJH2NoYWdutET4_RcfN4uWD_4Y8hUmRPSNGLBuB-YuMEf4U"],
    location: { lat: 29.2016, lng: 25.5189 },
    rating: 4.6,
    visitDuration: 5,
    tips: ["Best visited October-April", "Try the local dates", "Stay in eco-lodges"]
  },
  {
    name: "Hurghada Marina",
    city: "Hurghada",
    category: "beach",
    description: "A vibrant marina and resort area on the Red Sea coast, offering excellent diving, snorkeling, and water sports. Gateway to some of Egypt's best dive sites.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBHegEuZ7OVgtflLBBJ3EM9N171POXQeePLnNciFllvhrIx404grsu35VksYrWM0tsevzb0usFR9wt_Wq4ye6DP8xga12oMWn3qBzXZxZivkz5pFRoBqv_8MBf72OmsoI2rzJamhCwqvgZI1u09GVvwIGaxX61RuDwUwfDpNWReyW-liYb_sS3aZ5rBpj1RM3R4zLXracXJn-NYSZanhJGjSSPkLKiLuxhkU5KCFyBapMC99stHLWAsSq4Cr192j0mCo4-nfJxnf2k"],
    location: { lat: 27.2579, lng: 33.8116 },
    rating: 4.5,
    visitDuration: 4,
    tips: ["Great for family trips", "Many all-inclusive resorts", "Day trips to Giftun Island"]
  },
  {
    name: "Citadel of Saladin",
    city: "Cairo",
    category: "historical",
    description: "A medieval Islamic fortification built by Saladin in the 12th century. Home to the beautiful Muhammad Ali Mosque with its distinctive alabaster walls.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCgfJ03orX3lGf8Z1miWc2rcZzQD3JyiIQIwWw2qma0vkN5xC-q1xS90Qur-mKIDNuG96L1dPkBEYGd8O9ltE82PrS1zpOs-KuxazQ8uwC5dbI9oLqt43YzTbAAC9Rdn5zH8wWsx0Ffi30_0BpOURRAnARs5y_AtS9zbgacxsJ5LAYBkf7idD5jlovU7-yX2pwNljSsyXmAwnY_J2NKcMfj7paOfXBTZ_K47aKU1UF6zH5EHZGLkMrQr9adBljyLbwL7fmBEun4V8o"],
    location: { lat: 30.0287, lng: 31.2587 },
    rating: 4.7,
    visitDuration: 3,
    tips: ["Best views of Cairo from the citadel", "Visit the military museum inside", "Dress modestly - it's a mosque"]
  },
  {
    name: "Abu Simbel Temples",
    city: "Aswan",
    category: "historical",
    description: "Two massive rock temples built by Ramesses II. The temples were relocated in the 1960s to avoid being submerged by Lake Nasser.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuA0XoEusnRJ-BU1XWbCYaMTS7Pg7Sg1sOrWiw13bAaaeFjosZ2iecq-M29xxtPJnLxGVUlM0u59Lasc_DWaG7i4M0wFjZ3xNVEfNV4msbmkiCn6SzHOA9di28X8c54AhZD_0jIt_XpeyYHvXjevV8cpokjTS5BmhqqibZjEmP2RXEE9AMY3l7TvGoSLMVLfqZ7sb7c0BiMtlpzOBcdS0PE2DLNDmiZmyQThk3nO-hY_J1QLdQqjIJjaUWHYWvhJtjKkccp59gagMvc"],
    location: { lat: 22.3372, lng: 31.6258 },
    rating: 4.9,
    visitDuration: 5,
    tips: ["Early morning flight from Aswan", "Sunrise view is spectacular", "Sound and light show"]
  },
  {
    name: "Saqqara Step Pyramid",
    city: "Cairo",
    category: "historical",
    description: "The world's oldest stone pyramid, built for Pharaoh Djoser by the architect Imhotep around 2700 BC. Part of the vast Saqqara necropolis.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBLxW4QH9Kgv7RUUGFqOXH_yGfULmupukrpUM-1MtujoWBoEtGX_yGLHOR-6VyI7XDZut2DuJUElwpNbgkQoxTIpjzGMd8vlT5xSz1LB8u7oKUF79lmjKsLK1xECjWDYAg_wN7kX_q9N_xyBZFFMSWysSOkQvamIoc_lftv16Ar9-sT5HdqiO6fcCo08EN0GS6nTPNUErJBwJ5Ep_hjNDgy_0Em7EiqbJH2NoYWdutET4_RcfN4uWD_4Y8hUmRPSNGLBuB-YuMEf4U"],
    location: { lat: 29.8714, lng: 31.2165 },
    rating: 4.6,
    visitDuration: 3,
    tips: ["Combine with Giza in one day", "Imhotep Museum is excellent", "Less crowded than Giza"]
  },
  {
    name: "Red Sea Desert Safari",
    city: "Hurghada",
    category: "adventure",
    description: "Experience the thrill of quad biking, dune bashing, and Bedouin dinner in the Eastern Desert mountains near Hurghada.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBHegEuZ7OVgtflLBBJ3EM9N171POXQeePLnNciFllvhrIx404grsu35VksYrWM0tsevzb0usFR9wt_Wq4ye6DP8xga12oMWn3qBzXZxZivkz5pFRoBqv_8MBf72OmsoI2rzJamhCwqvgZI1u09GVvwIGaxX61RuDwUwfDpNWReyW-liYb_sS3aZ5rBpj1RM3R4zLXracXJn-NYSZanhJGjSSPkLKiLuxhkU5KCFyBapMC99stHLWAsSq4Cr192j0mCo4-nfJxnf2k"],
    location: { lat: 27.3, lng: 33.8 },
    rating: 4.5,
    visitDuration: 6,
    tips: ["Bring sunscreen and water", "Morning safaris are cooler", "Great for photography"]
  }
];

const seedPlaces = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Place.deleteMany({});
    console.log("🗑️  Cleared existing places");

    const result = await Place.insertMany(places);
    console.log(`✅ Seeded ${result.length} places`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedPlaces();
