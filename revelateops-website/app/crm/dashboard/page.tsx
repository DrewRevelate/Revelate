'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Card, CardContent, Grid, Typography, CircularProgress, Chip } from '@mui/material';
import {
  BusinessOutlined,
  TrendingUpOutlined,
  FolderOutlined,
  CheckCircleOutline,
  WarningOutlined,
} from '@mui/icons-material';

interface DashboardData {
  companies: {
    total: number;
  };
  pipeline: {
    totalValue: number;
    dealCount: number;
    averageDealSize: number;
    byStage: Record<string, number>;
  };
  projects: {
    total: number;
    byStatus: Record<string, number>;
    averageProgress: number;
  };
  tasks: {
    total: number;
    overdue: number;
    completionRate: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
}

export default function CRMDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const apiKey = localStorage.getItem('admin_api_key');
      const adminUser = localStorage.getItem('admin_user');

      const response = await fetch('/api/crm/dashboard', {
        headers: {
          'X-Admin-Key': apiKey || '',
          'X-Admin-User': adminUser || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      setDashboard(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !dashboard) {
    return (
      <Box p={3}>
        <Typography color="error">{error || 'Failed to load dashboard'}</Typography>
      </Box>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        CRM Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Companies Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BusinessOutlined sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {dashboard.companies.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Companies
                  </Typography>
                </Box>
              </Box>
              <Link href="/crm/companies" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  View all →
                </Typography>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Pipeline Value Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpOutlined sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(dashboard.pipeline.totalValue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pipeline Value
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {dashboard.pipeline.dealCount} active deals
              </Typography>
              <Link href="/crm/deals" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  View pipeline →
                </Typography>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Projects Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <FolderOutlined sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {dashboard.projects.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Projects
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {dashboard.projects.averageProgress}% avg progress
              </Typography>
              <Link href="/crm/projects" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  View projects →
                </Typography>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircleOutline sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {dashboard.tasks.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Box>
              {dashboard.tasks.overdue > 0 && (
                <Chip
                  icon={<WarningOutlined />}
                  label={`${dashboard.tasks.overdue} overdue`}
                  color="error"
                  size="small"
                  sx={{ mb: 1 }}
                />
              )}
              <Link href="/crm/tasks" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  View tasks →
                </Typography>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Deal Pipeline by Stage */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Deal Pipeline by Stage
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(dashboard.pipeline.byStage).map(([stage, count]) => (
                  <Box
                    key={stage}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {stage.replace('_', ' ')}
                    </Typography>
                    <Chip label={count} size="small" color="primary" variant="outlined" />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Tasks by Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(dashboard.tasks.byStatus).map(([status, count]) => (
                  <Box
                    key={status}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {status.replace('_', ' ')}
                    </Typography>
                    <Chip label={count} size="small" color="default" variant="outlined" />
                  </Box>
                ))}
              </Box>
              <Box mt={2} pt={2} borderTop={1} borderColor="divider">
                <Typography variant="body2" color="text.secondary">
                  Completion Rate: <strong>{dashboard.tasks.completionRate}%</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Quick Actions
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6} md={3}>
                  <Link href="/crm/companies" style={{ textDecoration: 'none' }}>
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <BusinessOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
                      <Typography variant="body2" mt={1}>
                        Manage Companies
                      </Typography>
                    </Box>
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Link href="/crm/contacts" style={{ textDecoration: 'none' }}>
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Typography variant="h4">👥</Typography>
                      <Typography variant="body2" mt={1}>
                        Manage Contacts
                      </Typography>
                    </Box>
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Link href="/crm/deals" style={{ textDecoration: 'none' }}>
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <TrendingUpOutlined sx={{ fontSize: 32, color: 'success.main' }} />
                      <Typography variant="body2" mt={1}>
                        View Pipeline
                      </Typography>
                    </Box>
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Link href="/crm/tasks" style={{ textDecoration: 'none' }}>
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <CheckCircleOutline sx={{ fontSize: 32, color: 'warning.main' }} />
                      <Typography variant="body2" mt={1}>
                        Manage Tasks
                      </Typography>
                    </Box>
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
