export type Role = 'user' | 'admin' | 'mechanic';

interface RoleConfig {
  defaultRoute: string;
  allowedRoutes: string[];
  loginRoute: string;
  displayName: string;
}

export const roleConfig: Record<Role, RoleConfig> = {
  user: {
    defaultRoute: '/',
    allowedRoutes: ['/', '/service', '/user/profile', '/user/service-history'],
    loginRoute: '/auth/user/login',
    displayName: 'User'
  },
  admin: {
    defaultRoute: '/admin/dashboard',
    allowedRoutes: ['/admin/dashboard'],
    loginRoute: '/auth/admin/login',
    displayName: 'Admin'
  },
  mechanic: {
    defaultRoute: '/mechanic/dashboard',
    allowedRoutes: ['/mechanic/dashboard'],
    loginRoute: '/auth/mechanic/login',
    displayName: 'Mechanic'
  },
};