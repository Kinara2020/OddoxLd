<div align="center">
  <img src="https://images.unsplash.com/photo-1488646953014-85cb84e231b8?auto=format&fit=crop&w=800&q=80" alt="GlobeTrotter Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px; object-fit: cover; height: 250px;" />
  
  # 🌍 GlobeTrotter
  **A premium, collaborative multi-city travel planning platform.**
  
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#api-reference">API Reference</a>
  </p>
</div>

---

## ✈️ Overview

GlobeTrotter is a modern, high-performance travel application designed to help users curate the perfect multi-city itinerary. Featuring an immersive, premium user interface inspired by the best travel apps in the world, GlobeTrotter allows you to discover real-world destinations, plan activities, track budgets, and share your adventures with the world.

## ✨ Features

- **Immersive User Experience:** A stunning, fully responsive dark-mode UI with smooth micro-interactions, floating labels, and gorgeous imagery.
- **Interactive Itinerary Builder:** Drag-and-drop activities, manage multiple city stops, and visualize your route with a dynamic timeline.
- **Activity Discovery:** Explore and add real-world activities to your itinerary via integrated travel APIs.
- **Visual Budget Dashboard:** Track your estimated expenses with beautiful charts, category breakdowns, and real-time budget utilization alerts.
- **Public Trip Sharing:** Publish your itinerary to generate a stunning public landing page that anyone can view.
- **Trip Cloning:** Browse public itineraries and instantly clone them into your own workspace to customize.
- **Secure Authentication:** Robust email/password authentication with protected routes.
- **Row Level Security (RLS):** Supabase database policies ensure users can only modify their own private trip data.

---

## 🛠 Tech Stack

### **Frontend**
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Custom Dark Theme & Keyframe Animations)
- **Routing:** React Router v6
- **Data Visualization:** Recharts
- **Icons:** Lucide React

### **Backend**
- **Framework:** Node.js + Express
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (JWT)
- **APIs:** GeoDB Cities, Geoapify Places, ExchangeRate-API

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- A [Supabase](https://supabase.com/) project

### 2. Database Setup
Execute the provided `schema.sql` script in your Supabase SQL Editor. This will set up all required tables, views, and Row Level Security (RLS) policies.

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `backend/.env` file:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
GEODB_RAPIDAPI_KEY=your_key
GEOAPIFY_KEY=your_key
EXCHANGE_RATE_KEY=your_key
```
Start the backend server:
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```
Create a `frontend/.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

*Tip: You can also use the `start.bat` file in the project root on Windows to boot both servers simultaneously!*

---

## 📂 Project Structure

```text
globetrotter/
├── backend/
│   ├── config/          # Environment & Database config
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth & Error handling
│   ├── routes/          # API route definitions
│   ├── services/        # External API integrations
│   └── server.js        # Express entry point
│
└── frontend/
    ├── src/
    │   ├── api/         # Axios client & Supabase config
    │   ├── components/  # Reusable UI components
    │   ├── context/     # React Context (Auth)
    │   ├── pages/       # Full-page route components
    │   └── App.jsx      # Router & Global Layout
    ├── index.html       # Vite entry point
    └── tailwind.config.js
```

---

## 📡 API Reference

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create a new workspace
- `GET /api/trips/:id` - Get specific trip details
- `PATCH /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/share` - Toggle public visibility
- `POST /api/trips/:id/copy` - Clone a public trip

### Stops & Activities
- `POST /api/stops` - Add a city stop to an itinerary
- `DELETE /api/stops/:id` - Remove a stop
- `POST /api/stops/:id/activities` - Add an activity to a stop

### Discovery & Budget
- `GET /api/cities/search?q=` - Search for global cities
- `GET /api/activities?cityId=` - Discover activities for a city
- `GET /api/budget/:tripId` - Get total cost and category breakdown
- `GET /api/public/:slug` - Fetch a shared public itinerary

---

## 📝 Known Limitations
- Free-tier external API rate limits are mitigated using database caching, but heavy usage may still trigger limits.
- Currently optimized for desktop and modern mobile browsers.

---
<div align="center">
  <p>Built with ❤️ for modern travelers.</p>
</div>
