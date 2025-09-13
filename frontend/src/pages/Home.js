import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Recycle, 
  Heart, 
  MapPin, 
  Clock, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform E-Waste into
              <span className="block text-green-200">Hope & Opportunity</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Join our mission to responsibly recycle electronic waste and donate working devices to those in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/collection/new" className="btn-primary bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
                    Schedule Collection
                  </Link>
                  <Link to="/donation/new" className="btn-outline border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3">
                    Donate Items
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn-outline border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to make a big impact on the environment and community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Recycle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Schedule Collection</h3>
              <p className="text-gray-600">
                Tell us about your electronic waste and schedule a convenient pickup time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Donate Working Items</h3>
              <p className="text-gray-600">
                Donate working electronics to schools, charities, and individuals in need.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Track Impact</h3>
              <p className="text-gray-600">
                Monitor your environmental impact and see how your donations help others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose E-Waste Hub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make e-waste management simple, secure, and impactful
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600 text-sm">
                Your data is completely wiped before recycling or donation
              </p>
            </div>

            <div className="card text-center">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Convenient Pickup</h3>
              <p className="text-gray-600 text-sm">
                We come to your location at your preferred time
              </p>
            </div>

            <div className="card text-center">
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Service</h3>
              <p className="text-gray-600 text-sm">
                Fast processing and transparent tracking system
              </p>
            </div>

            <div className="card text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Impact</h3>
              <p className="text-gray-600 text-sm">
                Help bridge the digital divide through donations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join thousands of users who are already making a positive impact on the environment and their communities.
          </p>
          {!isAuthenticated && (
            <Link 
              to="/register" 
              className="btn-primary bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3 inline-flex items-center"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold">E-Waste Hub</span>
              </div>
              <p className="text-gray-400">
                Making e-waste management simple and impactful for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>E-waste Collection</li>
                <li>Device Donation</li>
                <li>Data Destruction</li>
                <li>Recycling</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQ</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@ewastehub.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Green St, Eco City</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 E-Waste Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
