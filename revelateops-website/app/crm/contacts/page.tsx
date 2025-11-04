'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const apiKey = localStorage.getItem('admin_api_key');
      const adminUser = localStorage.getItem('admin_user');

      const response = await fetch('/api/crm/contacts', {
        headers: {
          'X-Admin-Key': apiKey || '',
          'X-Admin-User': adminUser || '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setContacts(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px"><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="600">Contacts</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>Add Contact</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact: any) => (
              <TableRow key={contact.id} hover>
                <TableCell>{`${contact.firstName} ${contact.lastName}`}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.company?.name || '-'}</TableCell>
                <TableCell>{contact.title || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
