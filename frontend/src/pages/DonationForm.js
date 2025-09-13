import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, MapPin, Calendar, Clock, ArrowLeft, Heart } from 'lucide-react';

const DonationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      items: [{ category: '', brand: '', model: '', condition: 'good', quantity: 1, description: '', estimatedValue: 0 }],
      preferredDate: '',
      preferredTimeSlot: 'morning',
      donationPurpose: 'charity'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post('/api/donations', data);
      toast.success('Donation submitted successfully!');
      navigate('/donations');
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error(error.response?.data?.message || 'Failed to create donation');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    append({ category: '', brand: '', model: '', condition: 'good', quantity: 1, description: '', estimatedValue: 0 });
  };

  const removeItem = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const categories = [
    'laptop', 'desktop', 'mobile', 'tablet', 'monitor', 
    'keyboard', 'mouse', 'printer', 'router', 'other'
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const timeSlots = [
    { value: 'morning', label: 'Morning (9 AM - 12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
    { value: 'evening', label: 'Evening (5 PM - 8 PM)' }
  ];

  const purposes = [
    { value: 'education', label: 'Education' },
    { value: 'charity', label: 'Charity' },
    { value: 'community', label: 'Community' },
    { value: 'refurbishment', label: 'Refurbishment' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-red-500" />
            Donate Electronic Items
          </h1>
          <p className="text-gray-600 mt-2">
            Help others by donating your working electronic devices.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Items Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Items to Donate</h2>
            
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Item {index + 1}</h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      {...register(`items.${index}.category`, { required: 'Category is required' })}
                      className="input-field"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.items[index].category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      {...register(`items.${index}.brand`)}
                      type="text"
                      className="input-field"
                      placeholder="e.g., Apple, Samsung, Dell"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      {...register(`items.${index}.model`)}
                      type="text"
                      className="input-field"
                      placeholder="e.g., iPhone 12, MacBook Pro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      {...register(`items.${index}.condition`, { required: 'Condition is required' })}
                      className="input-field"
                    >
                      {conditions.map(condition => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.condition && (
                      <p className="mt-1 text-sm text-red-600">{errors.items[index].condition.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      {...register(`items.${index}.quantity`, { 
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Quantity must be at least 1' }
                      })}
                      type="number"
                      min="1"
                      className="input-field"
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.items[index].quantity.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Value (₹)
                    </label>
                    <input
                      {...register(`items.${index}.estimatedValue`, { 
                        min: { value: 0, message: 'Value cannot be negative' }
                      })}
                      type="number"
                      min="0"
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register(`items.${index}.description`)}
                    rows={3}
                    className="input-field"
                    placeholder="Describe the item's condition and any accessories included..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="btn-outline flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Item
            </button>
          </div>

          {/* Donation Purpose */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Donation Purpose</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose *
              </label>
              <select
                {...register('donationPurpose', { required: 'Donation purpose is required' })}
                className="input-field"
              >
                {purposes.map(purpose => (
                  <option key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </option>
                ))}
              </select>
              {errors.donationPurpose && (
                <p className="mt-1 text-sm text-red-600">{errors.donationPurpose.message}</p>
              )}
            </div>
          </div>

          {/* Pickup Address */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Pickup Address
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  {...register('pickupAddress.street', { required: 'Street address is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Enter street address"
                />
                {errors.pickupAddress?.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.street.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  {...register('pickupAddress.city', { required: 'City is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Enter city"
                />
                {errors.pickupAddress?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  {...register('pickupAddress.state', { required: 'State is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Enter state"
                />
                {errors.pickupAddress?.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  {...register('pickupAddress.zipCode', { required: 'ZIP code is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Enter ZIP code"
                />
                {errors.pickupAddress?.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.zipCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark
                </label>
                <input
                  {...register('pickupAddress.landmark')}
                  type="text"
                  className="input-field"
                  placeholder="Nearby landmark (optional)"
                />
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Pickup
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  {...register('preferredDate', { required: 'Preferred date is required' })}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
                {errors.preferredDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.preferredDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time Slot *
                </label>
                <select
                  {...register('preferredTimeSlot', { required: 'Time slot is required' })}
                  className="input-field"
                >
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                {errors.preferredTimeSlot && (
                  <p className="mt-1 text-sm text-red-600">{errors.preferredTimeSlot.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="input-field"
                placeholder="Any special instructions or additional information..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
