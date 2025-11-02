'use client';

import { useState, useEffect } from 'react';
import { useAdminApi } from '@/lib/hooks/useAdminApi';

interface Package {
  id: string;
  name: string;
  slug: string;
  type: 'stage' | 'targeted' | 'custom';
  stage?: string;
  basePrice: number;
  discountPercentage?: number;
  timelineWeeksMin?: number;
  timelineWeeksMax?: number;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function PackagesTable() {
  const { callApi, loading, error } = useAdminApi();
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await callApi<Package[]>('/api/admin/packages', 'GET');
      if (data) {
        setPackages(data);
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
    }
  };

  const handleToggleActive = async (pkg: Package) => {
    try {
      await callApi(
        `/api/admin/packages/${pkg.id}`,
        'PATCH',
        { isActive: !pkg.isActive }
      );
      await loadPackages();
    } catch (err) {
      console.error('Failed to update package:', err);
    }
  };

  const handleDelete = async (pkg: Package) => {
    if (!confirm(`Are you sure you want to delete "${pkg.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await callApi(`/api/admin/packages/${pkg.id}`, 'DELETE');
      await loadPackages();
    } catch (err) {
      console.error('Failed to delete package:', err);
    }
  };

  if (loading && packages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d9ff]"></div>
        <p className="text-gray-400 mt-4">Loading packages...</p>
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

  if (packages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No packages found</p>
        <p className="text-sm">Click &quot;New Package&quot; to create your first package.</p>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      stage: 'Stage-Based',
      targeted: 'Targeted Fix',
      custom: 'Custom',
    };
    return labels[type] || type;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Stage</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium">Timeline</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium">Featured</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr
              key={pkg.id}
              className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
            >
              <td className="py-3 px-4">
                <div>
                  <div className="text-white font-medium">{pkg.name}</div>
                  <div className="text-xs text-gray-500">{pkg.slug}</div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
                  {getTypeLabel(pkg.type)}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-300 capitalize">
                {pkg.stage || '-'}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="text-gray-300">${pkg.basePrice.toLocaleString()}</div>
                {pkg.discountPercentage && (
                  <div className="text-xs text-green-400">
                    -{pkg.discountPercentage}% off
                  </div>
                )}
              </td>
              <td className="py-3 px-4 text-center text-gray-300">
                {pkg.timelineWeeksMin && pkg.timelineWeeksMax
                  ? `${pkg.timelineWeeksMin}-${pkg.timelineWeeksMax}w`
                  : '-'}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => handleToggleActive(pkg)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    pkg.isActive
                      ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                      : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="py-3 px-4 text-center">
                {pkg.isFeatured ? (
                  <span className="text-yellow-400">⭐</span>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => alert('Package editor coming soon!')}
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg)}
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
    </div>
  );
}
