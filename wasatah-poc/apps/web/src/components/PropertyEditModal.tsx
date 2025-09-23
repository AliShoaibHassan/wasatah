import { useState, useEffect } from 'react';
import { usePropertyStore } from '../stores/usePropertyStore';
import type { Property } from '../types/models';
import Notification from './Notification';

interface PropertyEditModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyEditModal = ({ property, isOpen, onClose }: PropertyEditModalProps) => {
  const [formData, setFormData] = useState({
    title: property.title,
    description: property.description,
    price: property.price,
    area: property.area,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    yearBuilt: property.yearBuilt,
    features: property.features.join(', ')
  });

  const { updateProperty, isLoading } = usePropertyStore();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        yearBuilt: property.yearBuilt,
        features: property.features.join(', ')
      });
    }
  }, [isOpen, property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updates = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        updatedAt: new Date().toISOString()
      };
      
      await updateProperty(property.id, updates);
      setNotification({
        message: 'Property updated successfully!',
        type: 'success',
        isVisible: true
      });
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error('Failed to update property:', error);
      setNotification({
        message: 'Failed to update property. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'area' || name === 'bedrooms' || name === 'bathrooms' || name === 'yearBuilt' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Property</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="form-label">Property Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="form-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="form-label">Price (SAR)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="area" className="form-label">Area (sqm)</label>
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className="form-label">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="yearBuilt" className="form-label">Year Built</label>
              <input
                type="number"
                id="yearBuilt"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleChange}
                className="form-input"
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="features" className="form-label">Features (comma-separated)</label>
            <input
              type="text"
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Swimming Pool, Garden, Parking"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Property'}
            </button>
          </div>
        </form>

        {/* Notification */}
        <Notification
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      </div>
    </div>
  );
};

export default PropertyEditModal;
