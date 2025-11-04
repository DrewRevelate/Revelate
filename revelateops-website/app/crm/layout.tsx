'use client';

import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import {
  DashboardOutlined,
  BusinessOutlined,
  ContactsOutlined,
  TrendingUpOutlined,
  FolderOutlined,
  CheckCircleOutline,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

const menuItems = [
  { label: 'Dashboard', path: '/crm/dashboard', icon: <DashboardOutlined /> },
  { label: 'Companies', path: '/crm/companies', icon: <BusinessOutlined /> },
  { label: 'Contacts', path: '/crm/contacts', icon: <ContactsOutlined /> },
  { label: 'Deals', path: '/crm/deals', icon: <TrendingUpOutlined /> },
  { label: 'Projects', path: '/crm/projects', icon: <FolderOutlined /> },
  { label: 'Tasks', path: '/crm/tasks', icon: <CheckCircleOutline /> },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight="600" color="primary">
            CRM System
          </Typography>
        </Toolbar>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              href={item.path}
              sx={{
                mb: 0.5,
                borderRadius: 1,
                bgcolor: pathname === item.path ? 'primary.main' : 'transparent',
                color: pathname === item.path ? 'white' : 'text.primary',
                '&:hover': {
                  bgcolor: pathname === item.path ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: pathname === item.path ? 'white' : 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        {children}
      </Box>
    </Box>
  );
}
