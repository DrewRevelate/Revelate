'use client';

import { useState, useEffect } from 'react';
import { useAdminApi } from '@/lib/hooks/useAdminApi';
import ServiceForm from './ServiceForm';

interface Service {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  category: string;
  icon?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesTable() {
  const { callApi, loading, error } = useAdminApi();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await callApi<Service[]>('/api/admin/services', 'GET');
      if (data) {
        setServices(data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await callApi(
        `/api/admin/services/${service.id}`,
        'PATCH',
        { isActive: !service.isActive }
      );
      await loadServices();
    } catch (err) {
      console.error('Failed to update service:', err);
    }
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete "${service.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await callApi(`/api/admin/services/${service.id}`, 'DELETE');
      await loadServices();
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d9ff]"></div>
        <p className="text-gray-400 mt-4">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No services found</p>
        <p className="text-sm">Click &quot;New Service&quot; to create your first service.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium">Featured</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium">Order</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr
              key={service.id}
              className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {service.icon && <span className="text-xl">{service.icon}</span>}
                  <div>
                    <div className="text-white font-medium">{service.name}</div>
                    <div className="text-xs text-gray-500">{service.slug}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-300 capitalize">{service.category}</td>
              <td className="py-3 px-4 text-right text-gray-300">
                ${service.basePrice.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => handleToggleActive(service)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    service.isActive
                      ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                      : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="py-3 px-4 text-center">
                {service.isFeatured ? (
                  <span className="text-yellow-400">⭐</span>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-center text-gray-400">{service.displayOrder}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setEditMode(true);
                    }}
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    className="px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editMode && selectedService && (
        <ServiceForm
          service={selectedService}
          onClose={() => {
            setEditMode(false);
            setSelectedService(null);
          }}
          onSuccess={loadServices}
        />
      )}
    </div>
  );
}
