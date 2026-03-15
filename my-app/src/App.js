
import './App.css';
// room listing_page import
import ListingPage from "./room_listing/listing_page";
import RoomImageUpload from './components/room_image_upload';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TenantSignup from './components/TenantSignup';
import LandlordSignup from './components/LandlordSignup';
import LandlordPage from './user_roles/page/land_lord';

import Hero from './components/Hero';
import CategoryCarousel from './components/CategoryCarousel';
import PlaceScroller from './components/PlaceScroller';
import Home_statement from './components/Home_statement';

function App() {
  return (
    <div className="App">
      
      <Hero />
      <CategoryCarousel />
      <Home_statement />
      <PlaceScroller />

      <ListingPage/>
      {/* <RoomImageUpload/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandlordPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup/tenant" element={<TenantSignup />} />
          <Route path="/signup/landlord" element={<LandlordSignup />} />
          <Route path="/landlord" element={<LandlordPage />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;