# Kemet Travel - Egypt Travel Platform

A full-stack travel booking platform for exploring Egypt's ancient wonders and modern luxury. Built with Next.js, Express, and MongoDB.


## Team Members

- Yusuf Ahmed Ibrahim Shoman
- Mohamed Khairy Eid Elzeblawy
- Mohamed Reda Ibrahim Ata
- Mustafa Mohamed Mohamed Hussein
- Kirina Anis Samir
- Eman Abd-Elrahman Shoeib
- Mai Nasr Mohamed
- Aya Salah Eliwa

## Features

- **User Authentication** - Register, login with JWT
- **Explore Places** - Browse Egyptian attractions by city and category
- **Trip Planning** - Create custom trips, add places by day
- **Curated Packages** - 6 pre-built travel packages with full itineraries
- **Hotel Suggestions** - Smart hotel recommendations based on trip cities
- **Booking System** - Reserve trips and accommodations


## Tech Stack

### Frontend (Client)
- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** - Design system with custom tokens
- **Zustand** - State management
- **Axios** - HTTP client

### Backend (Server)
- **Node.js + Express** - REST API
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
egypt-travel/
├── client/              # Next.js frontend (port 3000)
│   ├── app/             # App Router pages
│   ├── components/      # Reusable components
│   ├── lib/             # API client, utilities
│   └── store/           # Zustand stores
│
└── server/              # Express backend (port 5000)
    └── src/
        ├── models/      # Mongoose schemas
        ├── routes/      # API routes
        ├── controllers/ # Business logic
        ├── middleware/  # Auth middleware
        └── utils/       # Seed scripts, token generator
```

## Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MKhyry/egypt-travel.git
cd egypt-travel
```

### 2. Setup Backend (Server)

```bash
cd server
npm install
```

Create `server/.env` from the example:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/egypt-travel
JWT_SECRET=your_super_secret_key_change_this_later
NODE_ENV=development
```

Start MongoDB and seed the database:

```bash
# Seed packages into MongoDB
node src/utils/seedPackages.js
```

Start the server:

```bash
npm run dev  # Uses nodemon
```

Server runs at `http://localhost:5000`

### 3. Setup Frontend (Client)

Open a new terminal:

```bash
cd client
npm install
```

Create `client/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the client:

```bash
npm run dev
```

Client runs at `http://localhost:3000`



## Pages

| Route | Description |
|--------|-------------|
| `/` | Homepage with hero, destinations, experiences |
| `/explore` | Browse and filter places |
| `/place/:id` | Place details |
| `/trips` | Curated travel packages |
| `/trips/:id` | Package details with itinerary |
| `/my-trip` | User's trip planner |
| `/hotels` | Hotel listings |
| `/hotels/:id` | Hotel details |
| `/login` | Login page |
| `/signup` | Registration page |
| `/booking` | Booking page |
| `/confirmation` | Booking confirmation |
| `/dashboard` | User dashboard |

