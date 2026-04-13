import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StoryFeed from './pages/StoryFeed';
import StoryDetail from './pages/StoryDetail';
import Dashboard from './pages/Dashboard';
import CreateStory from './pages/CreateStory';
import EditStory from './pages/EditStory';
import Trending from './pages/Trending';
import Awards from './pages/Awards';
import Verify from './pages/Verify';
import Community from './pages/Community';
import Help from './pages/Help';
import Privacy from './pages/Privacy';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import API_BASE_URL from './config';

const App = () => {
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/config`)
      .then(res => res.json())
      .then(data => {
         if(data && data.brandColor) {
             document.documentElement.style.setProperty('--brand-color', data.brandColor);
         }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Navbar />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!rounded-[1.5rem] !p-5 !font-sans !font-black !text-xs !uppercase !tracking-widest !bg-white/90 !backdrop-blur-xl !border !border-slate-100 !shadow-2xl !text-slate-900',
        }}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<StoryFeed />} />
          <Route path="/story/:id" element={<ProtectedRoute><StoryDetail /></ProtectedRoute>} />
          <Route path="/create-story" element={<ProtectedRoute><CreateStory /></ProtectedRoute>} />
          <Route path="/edit-story/:id" element={<ProtectedRoute><EditStory /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/community" element={<Community />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
