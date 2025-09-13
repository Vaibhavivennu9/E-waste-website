import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Save, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.put('/api/users/profile', data);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{user?.name}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <span className={`status-badge ${user?.isVerified ? 'status-completed' : 'status-pending'}`}>
                {user?.isVerified ? 'Verified' : 'Unverified'}
              </span>
              <div className="mt-4">
                <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
            </div>

            {/* Account Stats */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collections</span>
                  <span className="text-gray-900">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Donations</span>
                  <span className="text-gray-900">-</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-outline"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                        type="text"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="input-field pl-10 bg-gray-50"
                        placeholder="Email address"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[\+]?[1-9][\d]{0,15}$/,
                            message: 'Invalid phone number'
                          }
                        })}
                        type="tel"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || ''}
                        disabled
                        className="input-field pl-10 bg-gray-50"
                        placeholder="User role"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Role is managed by administrators
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      {...register('address')}
                      rows={3}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Security Settings */}
            <div className="card mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">Last updated: Never</p>
                  </div>
                  <button className="btn-outline text-sm">
                    Change Password
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <button className="btn-outline text-sm">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
