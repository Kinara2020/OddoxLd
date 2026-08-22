import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import ActivitySearch from './pages/ActivitySearch';
import BudgetBreakdown from './pages/BudgetBreakdown';
import SharedItinerary from './pages/SharedItinerary';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import InteractiveMap from './pages/InteractiveMap';
import AnimatedBackground from './components/AnimatedBackground';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen pb-16 md:pb-0 relative z-0">
          <AnimatedBackground />
          <Navbar />
          <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<Discover />} />
          <Route path="/map" element={<InteractiveMap />} />
          <Route path="/shared/:slug" element={<SharedItinerary />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
          <Route path="/trips/new" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/trips/:id/build" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
          <Route path="/trips/:id/view" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
          <Route path="/trips/:id/budget" element={<ProtectedRoute><BudgetBreakdown /></ProtectedRoute>} />
          <Route path="/trips/:id/stops/:stopId/activities" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}