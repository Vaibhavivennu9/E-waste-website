import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Eye, 
  Trash2,
  Plus,
  User
} from 'lucide-react';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/api/donations');
      setDonations(response.data.donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const reserveDonation = async (id) => {
    if (window.confirm('Are you sure you want to reserve this donation for pickup?')) {
      try {
        await axios.put(`/api/donations/${id}/reserve`);
        toast.success('Donation reserved successfully');
        fetchDonations();
      } catch (error) {
        console.error('Error reserving donation:', error);
        toast.error('Failed to reserve donation');
      }
    }
  };

  const cancelDonation = async (id) => {
    if (window.confirm('Are you sure you want to cancel this donation?')) {
      try {
        await axios.delete(`/api/donations/${id}`);
        toast.success('Donation cancelled successfully');
        fetchDonations();
      } catch (error) {
        console.error('Error cancelling donation:', error);
        toast.error('Failed to cancel donation');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'status-available',
      reserved: 'status-reserved',
      picked_up: 'status-scheduled',
      delivered: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-pending';
  };

  const getStatusLabel = (status) => {
    const labels = {
      available: 'Available',
      reserved: 'Reserved',
      picked_up: 'Picked Up',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
              <p className="text-gray-600 mt-2">
                Browse available donations and manage your own donations
              </p>
            </div>
            <Link to="/donation/new" className="btn-primary flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              New Donation
            </Link>
          </div>
        </div>

        {/* Donations List */}
        {donations.length > 0 ? (
          <div className="space-y-6">
            {donations.map((donation) => (
              <div key={donation._id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`status-badge ${getStatusColor(donation.status)}`}>
                        {getStatusLabel(donation.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Donation Details
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-2" />
                            {donation.items?.length} items
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {donation.pickupAddress?.city}, {donation.pickupAddress?.state}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(donation.preferredDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {donation.preferredTimeSlot}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Purpose: {donation.donationPurpose}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Items
                        </h3>
                        <div className="space-y-1">
                          {donation.items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {item.quantity}x {item.category} {item.brand && `(${item.brand})`}
                              <span className="ml-2 text-xs text-gray-500">
                                - {item.condition}
                              </span>
                            </div>
                          ))}
                          {donation.items?.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{donation.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {donation.notes && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600">{donation.notes}</p>
                      </div>
                    )}

                    {donation.recipient && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Reserved by:</h4>
                        <p className="text-sm text-gray-600">{donation.recipient.name}</p>
                      </div>
                    )}

                    {donation.assignedCollector && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Assigned Collector:</h4>
                        <p className="text-sm text-gray-600">{donation.assignedCollector.name}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <Link
                      to={`/donations/${donation._id}`}
                      className="btn-outline flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                    
                    {donation.status === 'available' && (
                      <button
                        onClick={() => reserveDonation(donation._id)}
                        className="btn-primary flex items-center text-sm"
                      >
                        Reserve
                      </button>
                    )}
                    
                    {(donation.status === 'available' || donation.status === 'reserved') && 
                     donation.donor && (
                      <button
                        onClick={() => cancelDonation(donation._id)}
                        className="btn-secondary flex items-center text-sm text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-600 mb-6">
              Start by making your first donation or check back later for available items
            </p>
            <Link to="/donation/new" className="btn-primary">
              Make Donation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donations;
