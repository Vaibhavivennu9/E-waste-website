import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CollectionForm from './pages/CollectionForm';
import DonationForm from './pages/DonationForm';
import Collections from './pages/Collections';
import Donations from './pages/Donations';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/collection/new" element={
                <ProtectedRoute>
                  <CollectionForm />
                </ProtectedRoute>
              } />
              <Route path="/donation/new" element={
                <ProtectedRoute>
                  <DonationForm />
                </ProtectedRoute>
              } />
              <Route path="/collections" element={
                <ProtectedRoute>
                  <Collections />
                </ProtectedRoute>
              } />
              <Route path="/donations" element={
                <ProtectedRoute>
                  <Donations />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
