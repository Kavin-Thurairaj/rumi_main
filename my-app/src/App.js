import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import LoginPage from './components/LoginPage';
import TenantSignup from './components/TenantSignup';
import LandlordSignup from './components/LandlordSignup';
import AdminDashboard from './components/AdminDashboard';
import LandlordDashboard from './components/LandlordDashboard';
import ListingPage from './room_listing/listing_page';
import BrowseRooms from './components/BrowseRooms';
import HowItWorks from './components/HowItWorks';
import RoomShareListing from './room_share_lisiting/page/sharelisting';
import RoomSharePostPage from './room_share_lisiting/page/RoomSharePostPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"                   element={<Homepage />} />
        <Route path="/rooms"              element={<BrowseRooms />} />
        <Route path="/how-it-works"       element={<HowItWorks />} />
        <Route path="/share"              element={<RoomShareListing />} />
        <Route path="/share/post" element={<RoomSharePostPage />} />
        <Route path="/listing/:id"        element={<ListingPage />} />

        {/* ── Auth ── */}
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/signup/tenant"      element={<TenantSignup />} />
        <Route path="/signup/landlord"    element={<LandlordSignup />} />

        {/* ── Dashboards ── */}
        <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
        <Route path="/admin"              element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
