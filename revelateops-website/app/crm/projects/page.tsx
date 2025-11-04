'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, LinearProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const apiKey = localStorage.getItem('admin_api_key');
      const adminUser = localStorage.getItem('admin_user');

      const response = await fetch('/api/crm/projects', {
        headers: {
          'X-Admin-Key': apiKey || '',
          'X-Admin-User': adminUser || '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setProjects(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px"><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="600">Projects</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>Add Project</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Progress</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project: any) => (
              <TableRow key={project.id} hover>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.company.name}</TableCell>
                <TableCell>
                  <Chip label={project.status} size="small" color={project.status === 'completed' ? 'success' : 'default'} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={project.progressPercent}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2">{project.progressPercent}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
