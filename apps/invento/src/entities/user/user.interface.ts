export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}
