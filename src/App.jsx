import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RoutineSetup from './pages/RoutineSetup.jsx';
import SnackLibrary from './pages/SnackLibrary.jsx';
import Progress from './pages/Progress.jsx';
import Settings from './pages/Settings.jsx';
import Scan from './pages/Scan.jsx';

export default function App() {  
  return (
    <BrowserRouter>
      <div className="min-h-full">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/routine" element={<RoutineSetup />} />
          <Route path="/snacks" element={<SnackLibrary />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


