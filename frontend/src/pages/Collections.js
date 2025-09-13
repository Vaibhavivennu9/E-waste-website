import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Recycle, 
  MapPin, 
  Calendar, 
  Clock, 
  Eye, 
  Trash2,
  ArrowLeft,
  Plus
} from 'lucide-react';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get('/api/collections');
      setCollections(response.data.collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const cancelCollection = async (id) => {
    if (window.confirm('Are you sure you want to cancel this collection?')) {
      try {
        await axios.delete(`/api/collections/${id}`);
        toast.success('Collection cancelled successfully');
        fetchCollections();
      } catch (error) {
        console.error('Error cancelling collection:', error);
        toast.error('Failed to cancel collection');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      scheduled: 'status-scheduled',
      in_progress: 'status-scheduled',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-pending';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
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
              <h1 className="text-3xl font-bold text-gray-900">My Collections</h1>
              <p className="text-gray-600 mt-2">
                Track your e-waste collection requests
              </p>
            </div>
            <Link to="/collection/new" className="btn-primary flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              New Collection
            </Link>
          </div>
        </div>

        {/* Collections List */}
        {collections.length > 0 ? (
          <div className="space-y-6">
            {collections.map((collection) => (
              <div key={collection._id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`status-badge ${getStatusColor(collection.status)}`}>
                        {getStatusLabel(collection.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Collection Details
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Recycle className="w-4 h-4 mr-2" />
                            {collection.items?.length} items
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {collection.pickupAddress?.city}, {collection.pickupAddress?.state}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(collection.preferredDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {collection.preferredTimeSlot}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Items
                        </h3>
                        <div className="space-y-1">
                          {collection.items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {item.quantity}x {item.category} {item.brand && `(${item.brand})`}
                            </div>
                          ))}
                          {collection.items?.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{collection.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {collection.notes && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600">{collection.notes}</p>
                      </div>
                    )}

                    {collection.assignedCollector && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Assigned Collector:</h4>
                        <p className="text-sm text-gray-600">{collection.assignedCollector.name}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <Link
                      to={`/collections/${collection._id}`}
                      className="btn-outline flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                    {(collection.status === 'pending' || collection.status === 'scheduled') && (
                      <button
                        onClick={() => cancelCollection(collection._id)}
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
            <Recycle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
            <p className="text-gray-600 mb-6">
              Start by scheduling your first e-waste collection
            </p>
            <Link to="/collection/new" className="btn-primary">
              Schedule Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
