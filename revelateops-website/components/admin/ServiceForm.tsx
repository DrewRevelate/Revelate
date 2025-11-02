'use client';

import { useState, useEffect } from 'react';
import { useAdminApi } from '@/lib/hooks/useAdminApi';

interface Service {
  id?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  basePrice: number;
  category: string;
  icon?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceForm({ service, onClose, onSuccess }: ServiceFormProps) {
  const { callApi, loading, error, setError } = useAdminApi();
  const isEditMode = !!service?.id;

  const [formData, setFormData] = useState<Service>({
    name: service?.name || '',
    slug: service?.slug || '',
    shortDescription: service?.shortDescription || '',
    fullDescription: service?.fullDescription || '',
    basePrice: service?.basePrice || 0,
    category: service?.category || '',
    icon: service?.icon || '',
    isActive: service?.isActive ?? true,
    isFeatured: service?.isFeatured ?? false,
    displayOrder: service?.displayOrder ?? 0,
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      // Only auto-generate slug if we're creating a new service and slug hasn't been manually edited
      slug: !isEditMode && !prev.slug ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditMode) {
        await callApi(`/api/admin/services/${service.id}`, 'PATCH', formData);
      } else {
        await callApi('/api/admin/services', 'POST', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save service:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1f3a] border border-gray-700 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-white mb-6">
          {isEditMode ? 'Edit Service' : 'Create New Service'}
        </h3>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400 mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                placeholder="e.g., Data Pipeline Optimization"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                placeholder="e.g., data-pipeline-optimization"
                required
              />
            </div>
          </div>

          {/* Category and Icon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                placeholder="e.g., analytics"
                required
              />
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-300 mb-2">
                Icon (emoji)
              </label>
              <input
                type="text"
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                placeholder="📊"
              />
            </div>

            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-300 mb-2">
                Base Price *
              </label>
              <input
                type="number"
                id="basePrice"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                placeholder="5000"
                required
                min="0"
                step="100"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-300 mb-2">
              Short Description
            </label>
            <input
              type="text"
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
              placeholder="Brief one-line description"
            />
          </div>

          <div>
            <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-300 mb-2">
              Full Description
            </label>
            <textarea
              id="fullDescription"
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
              placeholder="Detailed description of the service"
              rows={4}
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
              </label>
              <input
                type="number"
                id="displayOrder"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0A0F1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-[#00d9ff] focus:ring-[#00d9ff] focus:ring-offset-0 bg-[#0A0F1E]"
                />
                <span className="ml-3 text-gray-300 font-medium">Active</span>
              </label>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-[#00d9ff] focus:ring-[#00d9ff] focus:ring-offset-0 bg-[#0A0F1E]"
                />
                <span className="ml-3 text-gray-300 font-medium">Featured ⭐</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#00d9ff] text-[#0A0F1E] font-medium rounded-lg hover:bg-[#00b8db] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
