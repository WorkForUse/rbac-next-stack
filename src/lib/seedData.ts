// Static seed data for development
export const seedUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'Admin',
    status: 'active',
    permissions: [
      'view_dashboard',
      'view_leads',
      'view_tasks',
      'view_reports',
      'view_users',
      'manage_users',
      'manage_tasks',
      'view_audit',
      'view_profile',
      'manage_self'
    ]
  },
  {
    id: 2,
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'Manager@123',
    role: 'Manager',
    status: 'active',
    permissions: [
      'view_dashboard',
      'view_leads',
      'view_tasks',
      'view_reports',
      'view_users',
      'manage_tasks',
      'view_profile',
      'manage_self'
    ]
  },
  {
    id: 3,
    name: 'Agent User',
    email: 'agent@example.com',
    password: 'Agent@123',
    role: 'Agent',
    status: 'active',
    permissions: [
      'view_dashboard',
      'view_leads',
      'view_tasks',
      'view_reports',
      'view_profile',
      'manage_self'
    ]
  },
  {
    id: 4,
    name: 'Jawed Akhtar',
    email: 'jawed12@gmail.com',
    password: '!RSF#$%ADZXVA43@',
    role: 'Agent',
    status: 'active',
    permissions: [
      'view_dashboard',
      'view_leads',
      'view_tasks',
      'view_reports',
      'view_users',
      'view_profile',
      'manage_self'
    ]
  }
];

export type SeedUser = typeof seedUsers[0];
