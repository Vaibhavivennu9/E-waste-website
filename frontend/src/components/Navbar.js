import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  User, 
  LogOut, 
  Plus, 
  List, 
  Heart,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="ReCycleNet Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-900">ReCycleNet</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Home className="w-4 h-4 inline mr-1" />
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/collection/new" 
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Schedule Collection
                </Link>
                <Link 
                  to="/donation/new" 
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Heart className="w-4 h-4 inline mr-1" />
                  Donate Items
                </Link>
                <Link 
                  to="/collections" 
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <List className="w-4 h-4 inline mr-1" />
                  My Collections
                </Link>
                <Link 
                  to="/donations" 
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Heart className="w-4 h-4 inline mr-1" />
                  My Donations
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4 mr-1" />
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-green-600 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/collection/new" 
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Schedule Collection
                  </Link>
                  <Link 
                    to="/donation/new" 
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Donate Items
                  </Link>
                  <Link 
                    to="/collections" 
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Collections
                  </Link>
                  <Link 
                    to="/donations" 
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Donations
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
