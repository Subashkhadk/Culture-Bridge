'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

interface Report {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  reporter: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
}

export default function AdminReports() {
  const { token } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, [token]);

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams();
      if (filter) params.append('status', filter);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to load reports');
      }
      const data = await response.json();
      setReports(data.reports || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (reportId: string, status: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin-slow">🚨</div>
          <div className="text-on-surface-variant">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">🚨 Reports</h1>
        <p className="text-sm text-on-surface-variant">Manage user reports</p>
      </div>

      <div className="flex gap-3">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            fetchReports();
          }}
          className="px-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none bg-surface-container-lowest text-on-surface"
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="dismissed">Dismissed</option>
          <option value="blocked">Blocked</option>
        </select>
        <button
          onClick={() => fetchReports()}
          className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="bg-surface-container-low rounded-2xl p-8 text-center border border-outline-variant">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-on-surface-variant">No {filter} reports found</p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-on-surface">
                      {report.targetType} report
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-1">
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  {report.description && (
                    <p className="text-sm text-on-surface-variant mt-1">
                      {report.description}
                    </p>
                  )}
                  <p className="text-xs text-on-surface-variant/70 mt-2">
                    Reported by @{report.reporter.username} • {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(report.id, 'reviewed')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => updateStatus(report.id, 'dismissed')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => updateStatus(report.id, 'blocked')}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition"
                      >
                        Block
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
