
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TenantSignup from './components/TenantSignup';
import LandlordSignup from './components/LandlordSignup';
import LandlordPage from './user_roles/page/land_lord';

function App() {
  return (
    <div className="App">
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