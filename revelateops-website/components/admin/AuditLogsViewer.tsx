'use client';

import { useState, useEffect } from 'react';
import { useAdminApi } from '@/lib/hooks/useAdminApi';

interface AuditLog {
  id: string;
  tableName: string;
  recordId: string;
  action: string;
  changedBy: string;
  changesSummary?: string;
  changedAt: string;
}

export default function AuditLogsViewer() {
  const { callApi, loading, error } = useAdminApi();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState({
    tableName: '',
    action: '',
    changedBy: '',
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.tableName) params.append('tableName', filters.tableName);
      if (filters.action) params.append('action', filters.action);
      if (filters.changedBy) params.append('changedBy', filters.changedBy);

      const url = `/api/admin/audit-logs${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await callApi<AuditLog[]>(url, 'GET');
      if (data) {
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    loadLogs();
  };

  const handleClearFilters = () => {
    setFilters({ tableName: '', action: '', changedBy: '' });
    setTimeout(() => loadLogs(), 100);
  };

  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      created: 'bg-green-900/30 text-green-400',
      updated: 'bg-blue-900/30 text-blue-400',
      deleted: 'bg-red-900/30 text-red-400',
      activated: 'bg-green-900/30 text-green-400',
      deactivated: 'bg-gray-700/30 text-gray-400',
    };
    return colors[action.toLowerCase()] || 'bg-gray-700/30 text-gray-300';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  if (loading && logs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d9ff]"></div>
        <p className="text-gray-400 mt-4">Loading audit logs...</p>
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-[#0A0F1E] border border-gray-700 rounded-lg p-4">
        <h3 className="text-white font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Table</label>
            <select
              value={filters.tableName}
              onChange={(e) => handleFilterChange('tableName', e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1f3a] border border-gray-600 rounded text-white focus:outline-none focus:border-[#00d9ff]"
            >
              <option value="">All Tables</option>
              <option value="Service">Service</option>
              <option value="Package">Package</option>
              <option value="ScopingFactor">ScopingFactor</option>
              <option value="ScopingRule">ScopingRule</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Action</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1f3a] border border-gray-600 rounded text-white focus:outline-none focus:border-[#00d9ff]"
            >
              <option value="">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              <option value="activated">Activated</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Changed By</label>
            <input
              type="text"
              value={filters.changedBy}
              onChange={(e) => handleFilterChange('changedBy', e.target.value)}
              placeholder="admin"
              className="w-full px-3 py-2 bg-[#1a1f3a] border border-gray-600 rounded text-white focus:outline-none focus:border-[#00d9ff]"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-[#00d9ff] text-[#0A0F1E] font-medium rounded hover:bg-[#00b8db] transition-colors"
            >
              Apply
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg mb-2">No audit logs found</p>
          <p className="text-sm">Changes to services, packages, and scoping rules will appear here.</p>
        </div>
      ) : (
        <div className="bg-[#0A0F1E] border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1f3a]">
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date/Time</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Table</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Action</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Record ID</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Changed By</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Changes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {formatDate(log.changedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs">
                        {log.tableName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs capitalize ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs font-mono">
                      {log.recordId.substring(0, 8)}...
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {log.changedBy}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm max-w-md truncate">
                      {log.changesSummary || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logs.length > 0 && (
            <div className="bg-[#1a1f3a] px-4 py-3 border-t border-gray-700 text-sm text-gray-400">
              Showing {logs.length} log{logs.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
