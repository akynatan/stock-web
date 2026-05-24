export interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'user' | 'admin';
  active: boolean;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}
