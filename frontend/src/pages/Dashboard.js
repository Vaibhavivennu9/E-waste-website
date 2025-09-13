import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Recycle, 
  Heart, 
  TrendingUp, 
  Calendar,
  MapPin,
  Clock,
  Plus,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/users/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      scheduled: 'status-scheduled',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      available: 'status-available',
      reserved: 'status-reserved'
    };
    return colors[status] || 'status-pending';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your e-waste activities
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/collection/new" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Schedule Collection</h3>
                <p className="text-gray-600">Request pickup for your e-waste</p>
              </div>
              <Plus className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </Link>

          <Link to="/donation/new" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Donate Items</h3>
                <p className="text-gray-600">Donate working electronics</p>
              </div>
              <Plus className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Recycle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {dashboardData?.stats?.collections?.find(s => s._id === 'completed')?.count || 0}
            </h3>
            <p className="text-gray-600">Collections Completed</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {dashboardData?.stats?.donations?.find(s => s._id === 'delivered')?.count || 0}
            </h3>
            <p className="text-gray-600">Donations Made</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {dashboardData?.collections?.length || 0}
            </h3>
            <p className="text-gray-600">Total Collections</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {dashboardData?.donations?.length || 0}
            </h3>
            <p className="text-gray-600">Total Donations</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Collections */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Collections</h2>
              <Link to="/collections" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View all
              </Link>
            </div>
            
            {dashboardData?.collections?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.collections.map((collection) => (
                  <div key={collection._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`status-badge ${getStatusColor(collection.status)}`}>
                        {collection.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {collection.pickupAddress?.city}, {collection.pickupAddress?.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {collection.preferredTimeSlot} • {collection.items?.length} items
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Recycle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No collections yet</p>
                <Link to="/collection/new" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Schedule your first collection
                </Link>
              </div>
            )}
          </div>

          {/* Recent Donations */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
              <Link to="/donations" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View all
              </Link>
            </div>
            
            {dashboardData?.donations?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.donations.map((donation) => (
                  <div key={donation._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`status-badge ${getStatusColor(donation.status)}`}>
                        {donation.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {donation.pickupAddress?.city}, {donation.pickupAddress?.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {donation.preferredTimeSlot} • {donation.items?.length} items
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No donations yet</p>
                <Link to="/donation/new" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Make your first donation
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
