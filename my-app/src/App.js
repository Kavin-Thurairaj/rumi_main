import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

import Homepage from "./components/Homepage";
import LoginPage from "./components/LoginPage";
import TenantSignup from "./components/TenantSignup";
import LandlordSignup from "./components/LandlordSignup";
import AdminDashboard from "./components/AdminDashboard";
import LandlordDashboard from "./components/LandlordDashboard";
import ListingPage from "./room_listing/listing_page";
import BrowseRooms from "./components/BrowseRooms";
import HowItWorks from "./components/HowItWorks";
import RoomShareListing from "./room_share_lisiting/page/sharelisting";
import RoomSharePostPage from "./room_share_lisiting/page/RoomSharePostPage";
import VerifyEmail from "./auth/VerifyEmail";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Homepage />} />
      <Route path="/rooms" element={<BrowseRooms />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/share" element={<RoomShareListing />} />
      <Route path="/share/post" element={<RoomSharePostPage />} />
      <Route path="/listing/:id" element={<ListingPage />} />
      <Route path="/verify" element={<VerifyEmail />} />

      {/* Auth routes — redirect if already logged in */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/signup/tenant"
        element={user ? <Navigate to="/" replace /> : <TenantSignup />}
      />
      <Route
        path="/signup/landlord"
        element={user ? <Navigate to="/" replace /> : <LandlordSignup />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard/landlord"
        element={
          user ? <LandlordDashboard /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/admin"
        element={user ? <AdminDashboard /> : <Navigate to="/login" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
