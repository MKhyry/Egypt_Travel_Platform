require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('../models/Package');

const packages = [
  {
    title: "Wonders of the Nile",
    duration: "7 Days / 6 Nights",
    days: 7,
    cities: "Cairo - Luxor - Aswan",
    price: 1890,
    tier: "Luxury",
    description: "Follow the legendary Nile from the pyramids of Giza to the temples of Aswan, with expert Egyptologist guides throughout.",
    heroDescription: "Journey through the cradle of civilization, from the Great Pyramids to the sun-drenched temples of Luxor and Aswan.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDktBUr5CbyXByxC8AUGUN-QjO4xvr4YjgsIddC4jOuZj0zMitLXwu12TjNCvOzIQyrM3-zAmJiMR6EimOUIelYtJ_1PLwY8bXkxAVQFNNgXg5P6w6Af4vtDIjB3ldJGj2kvgDWWQTTxTg3NroEq1XKEw0VjoWScD5KrrM2jTnLzCL9qkEdZ0JARYrPQHk6vEy-WnNC8HingWwqHEzAuf_wRM1kX6T1IXvqu4Pem2kYmrB99TeADrIWoY71aca6soEj1jBpmr8p2bM",
    routeMapImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBENkaMslM0YMhDlEYP4Ytc3TuqXrfBccKdOKZFlYlsSb9aPLaGTk7pGEOTQWgXfX60cVHmWJoj4TOTFmOmI-nDIDalih2dvlIpfNH13uZZBliPf6o2QYRO7Fz_C9Y5bLq_m6nzewSq8VN0mZBSbDJGC7YaneckWzl43AQr9iL90h4qGPnygLRIX2Sr0Am-FPL9gAbMm4aeVwdxwGFfrC_VZ9UeOg9KMy1YNPLXnhkbQHOhluld360sK5WcsBF7lE_CSzulA2lqPI",
    regions: ["Cairo", "Luxor", "Aswan"],
    route: ["Cairo", "Luxor", "Aswan"],
    rating: 4.9,
    reviews: 124,
    includes: [
      "6 nights in handpicked 5-star heritage hotels",
      "Private airport transfers with meet and assist",
      "Domestic flights between Cairo, Luxor, and Aswan",
      "Private Egyptologist for all archaeological visits",
      "Daily breakfast and select curated lunches"
    ],
    icons: ["flight", "hotel", "person_pin_circle"],
    itinerary: [
      {
        dayLabel: "1",
        title: "Cairo Arrival and Welcome",
        description: "Arrive in Cairo, meet your concierge, and settle into a landmark Nile-side stay before a welcome dinner with views of the city lights.",
        meals: "Dinner",
        stay: "Marriott Mena House",
        accentIcon: "hotel",
        accentLabel: "Heritage check-in"
      },
      {
        dayLabel: "2",
        title: "Pyramids and the Great Sphinx",
        description: "Spend the day on the Giza Plateau with a private guide, including the Great Pyramid, the Sphinx, and a relaxed lunch overlooking the desert edge.",
        meals: "Breakfast, Lunch",
        accentIcon: "photo_camera",
        accentLabel: "Giza Plateau"
      },
      {
        dayLabel: "3-4",
        title: "Luxor Temples and the West Bank",
        description: "Fly south to Luxor for Karnak, Luxor Temple, and the royal tombs of the Valley of the Kings, balanced with unhurried evenings on the Nile.",
        meals: "Breakfast",
        stay: "Sofitel Winter Palace",
        accentIcon: "temple_buddhist",
        accentLabel: "Temple circuit"
      },
      {
        dayLabel: "5-7",
        title: "Aswan Islands and Farewell Cruise",
        description: "Continue to Aswan for Philae, felucca views, and a graceful finale among palm-lined riverbanks before departure support back to Cairo.",
        meals: "Breakfast, Lunch",
        stay: "Sofitel Legend Old Cataract",
        accentIcon: "sailing",
        accentLabel: "Nile finale"
      }
    ],
    hotels: [
      {
        name: "Marriott Mena House",
        city: "Giza, Cairo",
        description: "A storied property at the foot of the pyramids with gardens, history, and iconic views."
      },
      {
        name: "Sofitel Winter Palace",
        city: "Luxor",
        description: "Classic Nile-side grandeur paired with easy access to Luxor's east and west bank monuments."
      }
    ]
  },
  {
    title: "Ancient Wonders Tour",
    duration: "5 Days / 4 Nights",
    days: 5,
    cities: "Cairo - Giza",
    price: 980,
    tier: "Boutique",
    description: "An immersive deep dive into Egypt's most iconic monuments with private dawn access to the Pyramids.",
    heroDescription: "A focused heritage escape through Cairo and Giza, crafted for travelers who want Egypt's icons without rushing.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0XoEusnRJ-BU1XWbCYaMTS7Pg7Sg1sOrWiw13bAaaeFjosZ2iecq-M29xxtPJnLxGVUlM0u59Lasc_DWaG7i4M0wFjZ3xNVEfNV4msbmkiCn6SzHOA9di28X8c54AhZD_0jIt_XpeyYHvXjevV8cpokjTS5BmhqqibZjEmP2RXEE9AMY3l7TvGoSLMVLfqZ7sb7c0BiMtlpzOBcdS0PE2DLNDmiZmyQThk3nO-hY_J1QLdQqjIJjaUWHYWvhJtjKkccp59gagMvc",
    routeMapImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBENkaMslM0YMhDlEYP4Ytc3TuqXrfBccKdOKZFlYlsSb9aPLaGTk7pGEOTQWgXfX60cVHmWJoj4TOTFmOmI-nDIDalih2dvlIpfNH13uZZBliPf6o2QYRO7Fz_C9Y5bLq_m6nzewSq8VN0mZBSbDJGC7YaneckWzl43AQr9iL90h4qGPnygLRIX2Sr0Am-FPL9gAbMm4aeVwdxwGFfrC_VZ9UeOg9KMy1YNPLXnhkbQHOhluld360sK5WcsBF7lE_CSzulA2lqPI",
    regions: ["Cairo"],
    route: ["Cairo", "Giza"],
    rating: 4.8,
    reviews: 91,
    includes: [
      "4 nights in a boutique heritage hotel",
      "Private guided visits to Giza and Saqqara",
      "Dedicated airport transfers and city transport",
      "Daily breakfast and one signature dinner",
      "Flexible afternoon for museums or old Cairo"
    ],
    icons: ["hotel", "person_pin_circle", "directions_car"],
    itinerary: [
      {
        dayLabel: "1",
        title: "Arrival and Old Cairo",
        description: "Ease into the city with a Nile-front check-in and a slow evening through Khan El Khalili and historic streets.",
        meals: "Dinner",
        stay: "Le Riad Hotel de Charme",
        accentIcon: "storefront",
        accentLabel: "Historic quarter"
      },
      {
        dayLabel: "2",
        title: "Sunrise at the Pyramids",
        description: "Start early for the plateau's quietest hour, then continue with the Sphinx and curated storytelling from your guide.",
        meals: "Breakfast, Lunch",
        accentIcon: "brightness_5",
        accentLabel: "Private dawn access"
      },
      {
        dayLabel: "3-5",
        title: "Saqqara, Museum, and Free Design Time",
        description: "Mix major landmarks with flexible time for the Grand Egyptian Museum, Coptic Cairo, or a designer shopping stop.",
        meals: "Breakfast",
        accentIcon: "museum",
        accentLabel: "Flexible museum day"
      }
    ],
    hotels: [
      {
        name: "Le Riad Hotel de Charme",
        city: "Cairo",
        description: "A small-scale luxury base near old Cairo's texture, markets, and atmosphere."
      },
      {
        name: "Marriott Mena House",
        city: "Giza",
        description: "A classic pyramid-view stay for travelers who want proximity and heritage in one place."
      }
    ]
  },
  {
    title: "Red Sea & Cairo Escape",
    duration: "10 Days / 9 Nights",
    days: 10,
    cities: "Cairo - Hurghada - Sharm",
    price: 2450,
    tier: "Luxury",
    description: "The perfect fusion of cultural immersion at the pyramids and relaxation at the Red Sea coral reefs.",
    heroDescription: "Pair Egypt's most iconic monuments with generous Red Sea time, balancing city intensity and coastal reset.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHegEuZ7OVgtflLBBJ3EM9N171POXQeePLnNciFllvhrIx404grsu35VksYrWM0tsevzb0usFR9wt_Wq4ye6DP8xga12oMWn3qBzXZxZivkz5pFRoBqv_8MBf72OmsoI2rzJamhCwqvgZI1u09GVvwIGaxX61RuDwUwfDpNWReyW-liYb_sS3aZ5rBpj1RM3R4zLXracXJn-NYSZanhJGjSSPkLKiLuxhkU5KCFyBapMC99stHLWAsSq4Cr192j0mCo4-nfJxnf2k",
    routeMapImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBENkaMslM0YMhDlEYP4Ytc3TuqXrfBccKdOKZFlYlsSb9aPLaGTk7pGEOTQWgXfX60cVHmWJoj4TOTFmOmI-nDIDalih2dvlIpfNH13uZZBliPf6o2QYRO7Fz_C9Y5bLq_m6nzewSq8VN0mZBSbDJGC7YaneckWzl43AQr9iL90h4qGPnygLRIX2Sr0Am-FPL9gAbMm4aeVwdxwGFfrC_VZ9UeOg9KMy1YNPLXnhkbQHOhluld360sK5WcsBF7lE_CSzulA2lqPI",
    regions: ["Cairo", "Red Sea"],
    route: ["Cairo", "Hurghada", "Sharm El Sheikh"],
    rating: 4.9,
    reviews: 88,
    includes: [
      "City stay in Cairo plus two premium Red Sea resorts",
      "Domestic flights and private coastal transfers",
      "Snorkeling excursion and guided pyramid day",
      "Daily breakfast and select resort dinners",
      "Concierge support for beach, spa, and optional diving add-ons"
    ],
    icons: ["flight", "hotel", "beach_access", "person_pin_circle"],
    itinerary: [
      {
        dayLabel: "1-2",
        title: "Cairo Icons",
        description: "See the pyramids, old Cairo, and the city's layered neighborhoods before heading east for the coast.",
        meals: "Breakfast, Lunch",
        accentIcon: "temple_buddhist",
        accentLabel: "City immersion"
      },
      {
        dayLabel: "3-6",
        title: "Hurghada Reef Days",
        description: "Slow the pace with reef excursions, private beach time, and a luxury resort rhythm on the Red Sea.",
        meals: "Breakfast, Dinner",
        stay: "Steigenberger Aldau Beach",
        accentIcon: "beach_access",
        accentLabel: "Coastal resort stay"
      },
      {
        dayLabel: "7-10",
        title: "Sharm Escape and Departure",
        description: "Finish with polished resort time in Sharm El Sheikh, optional diving, and a smooth departure transfer.",
        meals: "Breakfast",
        stay: "Four Seasons Sharm El Sheikh",
        accentIcon: "scuba_diving",
        accentLabel: "Resort finale"
      }
    ],
    hotels: [
      {
        name: "Steigenberger Aldau Beach",
        city: "Hurghada",
        description: "A broad beachfront base with calm luxury and easy access to reef excursions."
      },
      {
        name: "Four Seasons Resort Sharm El Sheikh",
        city: "Sharm El Sheikh",
        description: "A polished Red Sea retreat suited to diving, spa time, and elegant downtime."
      }
    ]
  },
  {
    title: "Luxor Temple Trail",
    duration: "4 Days / 3 Nights",
    days: 4,
    cities: "Luxor - Karnak",
    price: 760,
    tier: "Essential",
    description: "Walk among the greatest concentration of ancient temples on earth, guided by specialists in pharaonic history.",
    heroDescription: "A compact temple-focused journey designed for travelers who want Luxor's essentials in a concentrated, elegant format.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDC2ItatpzjOuC810H4DiK-UF2bfVg9KdfJwymrjAQK-TZM2iqKOhLyjbVcyEPJi6k7eeJdug0CLNRjBblOCYobWw5PIVqatW3EmQULE2T-1fGoOP7godsTFB5NDUbqUXO0yvujp0c2qSeE8Vkx8qFYTMFmNqiLNE-9PbBNSPbE66cFXYiYZLApbmXjFwj1UCv2QXldFwiMvxWiONcIEuU0smkzPBz_nyZMhSlcRri7ZSQfFUdFigxyGepyWR4gJWJdIGPBRGGpGu0",
    routeMapImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBENkaMslM0YMhDlEYP4Ytc3TuqXrfBccKdOKZFlYlsSb9aPLaGTk7pGEOTQWgXfX60cVHmWJoj4TOTFmOmI-nDIDalih2dvlIpfNH13uZZBliPf6o2QYRO7Fz_C9Y5bLq_m6nzewSq8VN0mZBSbDJGC7YaneckWzl43AQr9iL90h4qGPnygLRIX2Sr0Am-FPL9gAbMm4aeVwdxwGFfrC_VZ9UeOg9KMy1YNPLXnhkbQHOhluld360sK5WcsBF7lE_CSzulA2lqPI",
    regions: ["Luxor"],
    route: ["Luxor", "Karnak"],
    rating: 4.7,
    reviews: 63,
    includes: [
      "3 nights in a central Luxor hotel",
      "Private guided access to Karnak and Luxor Temple",
      "West Bank excursion with entry planning support",
      "Daily breakfast and one sunset Nile dinner",
      "Airport transfers within Luxor"
    ],
    icons: ["hotel", "person_pin_circle"],
    itinerary: [
      {
        dayLabel: "1",
        title: "Arrival on the Nile",
        description: "Check into Luxor and enjoy a first evening on the corniche before a calm dinner with river views.",
        meals: "Dinner",
        accentIcon: "water",
        accentLabel: "Nile arrival"
      },
      {
        dayLabel: "2",
        title: "Karnak and Luxor Temple",
        description: "Spend a full day tracing processional routes, temple courts, and dynastic layers with an expert guide.",
        meals: "Breakfast",
        accentIcon: "castle",
        accentLabel: "Temple deep dive"
      },
      {
        dayLabel: "3-4",
        title: "Valley of the Kings and Departure",
        description: "Cross to the West Bank for royal tombs and mortuary temples, then depart after a final relaxed morning.",
        meals: "Breakfast",
        accentIcon: "landscape",
        accentLabel: "West Bank circuit"
      }
    ],
    hotels: [
      {
        name: "Steigenberger Nile Palace",
        city: "Luxor",
        description: "A comfortable central base for temple-focused days and easy riverfront evenings."
      }
    ]
  },
  {
    title: "White Desert Safari",
    duration: "3 Days / 2 Nights",
    days: 3,
    cities: "Cairo - Farafra",
    price: 640,
    tier: "Essential",
    description: "Camp under the stars among Egypt's surreal chalk formations in one of Africa's most otherworldly landscapes.",
    heroDescription: "A desert-first escape with dramatic geology, open skies, and a softer adventure rhythm than a classic city itinerary.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBt5Q5FqayxlccoJHk41GOWTmmgK7SKNESrs-PFLHEcznJLv9R78qQq5alxzJdBhitjlwxhbGVa83mHJKsu4MQY1F4WUF9KRP_V3OTJyYWbQTmFvNbF-MyiOjuj5uVCAntJ0SZI31qfYJGa8s7yPBAC87LlUPu8GQz9JE6GHsk4z3Ie8E_VwVVoxPwTP7wMfJBvASH2mEqepFVOl5tpuG3kyPI5IlL6SbbauawJMO7XHAkBOIcu9sYKsnVJj1AP4JKDQ4flcXsMuWs",
    routeMapImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBENkaMslM0YMhDlEYP4Ytc3TuqXrfBccKdOKZFlYlsSb9aPLaGTk7pGEOTQWgXfX60cVHmWJoj4TOTFmOmI-nDIDalih2dvlIpfNH13uZZBliPf6o2QYRO7Fz_C9Y5bLq_m6nzewSq8VN0mZBSbDJGC7YaneckWzl43AQr9iL90h4qGPnygLRIX2Sr0Am-FPL9gAbMm4aeVwdxwGFfrC_VZ9UeOg9KMy1YNPLXnhkbQHOhluld360sK5WcsBF7lE_CSzulA2lqPI",
    regions: ["Cairo"],
    route: ["Cairo", "Farafra"],
    rating: 4.8,
    reviews: 57,
    includes: [
      "4x4 transfers and desert camp logistics",
      "Guide support and sunset desert picnic",
      "Camp setup with evening fire circle",
      "Breakfast and camp meals",
      "Return transfer to Cairo"
    ],
    icons: ["directions_car", "person_pin_circle"],
    itinerary: [
      {
        dayLabel: "1",
        title: "Road to the White Desert",
        description: "Leave Cairo early and drive west through the changing landscape toward Bahariya and Farafra.",
        meals: "Lunch, Dinner",
        accentIcon: "directions_car",
        accentLabel: "Desert transfer"
      },
      {
        dayLabel: "2",
        title: "Camp Among Chalk Formations",
        description: "Spend the day exploring sculpted desert shapes, then settle into a quiet camp under a broad night sky.",
        meals: "Breakfast, Dinner",
        accentIcon: "camping",
        accentLabel: "Stargazing camp"
      },
      {
        dayLabel: "3",
        title: "Return to Cairo",
        description: "After sunrise and breakfast in camp, head back east with time to decompress before the city returns.",
        meals: "Breakfast",
        accentIcon: "wb_sunny",
        accentLabel: "Sunrise departure"
      }
    ],
    hotels: [
      {
        name: "White Desert Eco Camp",
        city: "Farafra",
        description: "A simple but atmospheric overnight setup focused on the landscape, not hotel formality."
      }
    ]
  },
  {
    title: "Alexandria & Nile Delta",
    duration: "6 Days / 5 Nights",
    days: 6,
    cities: "Alexandria - Cairo",
    price: 1120,
    tier: "Boutique",
    description: "Explore Cleopatra's city, the catacombs, and the Mediterranean coast before returning to the eternal capital.",
    heroDescription: "A softer-paced northbound itinerary where Mediterranean light, layered history, and urban culture carry the trip.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDjIBCV2bAh1l-XuXxg7DdFN61K2tMkl1D-knXeJ-LufLEMdyUqZwOah-I4jW6bQ_ntiV7RZlEI8iSErVUdPoZN7YtRUmhfq7hCirVVpNBGACJIHJ9FbW6Hy5F1WdKKEyT6S6Hfkp1DImsPDgIOvh1HwJyXZTcSiTi7LcjfXlRGxxk-S7nIKO6OSksO94SAEkgz7-wcSdMynTdDUiVFZ_Avd3zjNTAsXhf7RT2ayNtq5s-l12XxIUdz57OMNomOir8OxjhsHFI7Bk",
    routeMapImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBENkaMslM0YMhDlEYP4Ytc3TuqXrfBccKdOKZFlYlsSb9aPLaGTk7pGEOTQWgXfX60cVHmWJoj4TOTFmOmI-nDIDalih2dvlIpfNH13uZZBliPf6o2QYRO7Fz_C9Y5bLq_m6nzewSq8VN0mZBSbDJGC7YaneckWzl43AQr9iL90h4qGPnygLRIX2Sr0Am-FPL9gAbMm4aeVwdxwGFfrC_VZ9UeOg9KMy1YNPLXnhkbQHOhluld360sK5WcsBF7lE_CSzulA2lqPI",
    regions: ["Cairo"],
    route: ["Alexandria", "Cairo"],
    rating: 4.7,
    reviews: 70,
    includes: [
      "5 nights in boutique city stays",
      "Private Alexandria touring and transfer planning",
      "Library, catacomb, and waterfront scheduling support",
      "Breakfast daily plus one seafood dinner",
      "Return transport into Cairo"
    ],
    icons: ["flight", "hotel", "person_pin_circle"],
    itinerary: [
      {
        dayLabel: "1-2",
        title: "Alexandria Waterfront and Catacombs",
        description: "Begin on the Mediterranean with a measured mix of Greco-Roman sites, harbor walks, and seafood evenings.",
        meals: "Breakfast, Dinner",
        accentIcon: "sailing",
        accentLabel: "Mediterranean start"
      },
      {
        dayLabel: "3-4",
        title: "Library, Corniche, and Design Stops",
        description: "Balance major landmarks with quieter moments at the modern library, cafes, and curated local shops.",
        meals: "Breakfast",
        accentIcon: "menu_book",
        accentLabel: "Culture and cafe day"
      },
      {
        dayLabel: "5-6",
        title: "Cairo Return and Departure",
        description: "Transition back to Cairo for a final museum or shopping window before outbound travel.",
        meals: "Breakfast",
        accentIcon: "train",
        accentLabel: "Capital return"
      }
    ],
    hotels: [
      {
        name: "Paradise Inn Windsor Palace",
        city: "Alexandria",
        description: "A classic city stay that suits a slower coastal cultural itinerary."
      }
    ]
  }
];

const seedPackages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Package.deleteMany({});
    console.log("🗑️  Cleared existing packages");

    const result = await Package.insertMany(packages);
    console.log(`✅ Seeded ${result.length} packages`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedPackages();
