'use client';

import { useState } from 'react';
import AdminAuth from '@/components/admin/AdminAuth';
import ServicesTable from '@/components/admin/ServicesTable';
import ServiceForm from '@/components/admin/ServiceForm';
import PackagesTable from '@/components/admin/PackagesTable';
import AuditLogsViewer from '@/components/admin/AuditLogsViewer';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'services' | 'packages' | 'scoping' | 'audit'>(
    'services'
  );
  const [showCreateService, setShowCreateService] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0F1E] via-[#1a1f3a] to-[#0A0F1E]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage services, packages, and scoping rules</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'services'
                ? 'text-[#00d9ff] border-b-2 border-[#00d9ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'packages'
                ? 'text-[#00d9ff] border-b-2 border-[#00d9ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Packages
          </button>
          <button
            onClick={() => setActiveTab('scoping')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'scoping'
                ? 'text-[#00d9ff] border-b-2 border-[#00d9ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Scoping Rules
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'audit'
                ? 'text-[#00d9ff] border-b-2 border-[#00d9ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Audit Logs
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1f3a]/50 border border-gray-700 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Total Services</div>
            <div className="text-3xl font-bold text-white">--</div>
          </div>
          <div className="bg-[#1a1f3a]/50 border border-gray-700 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Total Packages</div>
            <div className="text-3xl font-bold text-white">--</div>
          </div>
          <div className="bg-[#1a1f3a]/50 border border-gray-700 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Active Rules</div>
            <div className="text-3xl font-bold text-white">--</div>
          </div>
          <div className="bg-[#1a1f3a]/50 border border-gray-700 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Quotes Generated</div>
            <div className="text-3xl font-bold text-white">--</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-[#1a1f3a]/30 border border-gray-700 rounded-lg p-8">
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Services Management</h2>
                <button
                  onClick={() => setShowCreateService(true)}
                  className="px-4 py-2 bg-[#00d9ff] text-[#0A0F1E] font-medium rounded-lg hover:bg-[#00b8db] transition-colors"
                >
                  + New Service
                </button>
              </div>
              <p className="text-gray-400 mb-6">
                Manage individual service offerings. Click a service to edit or use the toggle to
                activate/deactivate.
              </p>
              <ServicesTable key={refreshKey} />
            </div>
          )}

          {activeTab === 'packages' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Packages Management</h2>
                <button
                  onClick={() => alert('Package creation coming soon!')}
                  className="px-4 py-2 bg-[#00d9ff] text-[#0A0F1E] font-medium rounded-lg hover:bg-[#00b8db] transition-colors"
                >
                  + New Package
                </button>
              </div>
              <p className="text-gray-400 mb-6">
                Manage service packages and bundles. Click a package to edit or use the toggle to
                activate/deactivate.
              </p>
              <PackagesTable />
            </div>
          )}

          {activeTab === 'scoping' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Scoping Rules Management</h2>
                <button className="px-4 py-2 bg-[#00d9ff] text-[#0A0F1E] font-medium rounded-lg hover:bg-[#00b8db] transition-colors">
                  + New Rule
                </button>
              </div>
              <p className="text-gray-400 mb-4">
                Configure dynamic pricing and timeline rules for packages.
              </p>
              <div className="text-center py-12 text-gray-500">
                Scoping rules component coming soon...
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Audit Logs</h2>
              <p className="text-gray-400 mb-6">
                View all administrative changes to services, packages, and scoping rules.
              </p>
              <AuditLogsViewer />
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Create Service Modal */}
      {showCreateService && (
        <ServiceForm
          onClose={() => setShowCreateService(false)}
          onSuccess={() => {
            setRefreshKey((prev) => prev + 1);
            setShowCreateService(false);
          }}
        />
      )}
    </AdminAuth>
  );
}
