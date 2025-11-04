'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material';

const STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

export default function DealsPage() {
  const [dealsByStage, setDealsByStage] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const apiKey = localStorage.getItem('admin_api_key');
      const adminUser = localStorage.getItem('admin_user');

      const response = await fetch('/api/crm/deals?groupByStage=true', {
        headers: {
          'X-Admin-Key': apiKey || '',
          'X-Admin-User': adminUser || '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setDealsByStage(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px"><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="600" mb={3}>Deal Pipeline</Typography>
      <Grid container spacing={2}>
        {STAGES.map((stage) => (
          <Grid item xs={12} md={4} key={stage}>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, minHeight: 400 }}>
              <Typography variant="h6" mb={2} sx={{ textTransform: 'capitalize' }}>
                {stage.replace('_', ' ')}
                <Chip label={dealsByStage[stage]?.length || 0} size="small" sx={{ ml: 1 }} />
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(dealsByStage[stage] || []).map((deal: any) => (
                  <Card key={deal.id} variant="outlined">
                    <CardContent>
                      <Typography variant="body1" fontWeight={500}>{deal.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{deal.company.name}</Typography>
                      {deal.value && (
                        <Typography variant="body2" color="primary" mt={1}>
                          ${Number(deal.value).toLocaleString()}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
