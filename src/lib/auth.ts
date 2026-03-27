import { supabase } from './supabase';

export interface User {
  id: string;
  user_id: string;
  created_at: string;
}

export async function register(userId: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    return { success: false, error: 'このユーザーIDは既に使用されています' };
  }

  const passwordHash = await hashPassword(password);

  const { data, error } = await supabase
    .from('users')
    .insert({ user_id: userId, password_hash: passwordHash })
    .select()
    .single();

  if (error) {
    return { success: false, error: 'アカウント作成に失敗しました' };
  }

  localStorage.setItem('currentUser', JSON.stringify(data));
  return { success: true, user: data };
}

export async function login(userId: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!user) {
    return { success: false, error: 'ユーザーIDまたはパスワードが間違っています' };
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return { success: false, error: 'ユーザーIDまたはパスワードが間違っています' };
  }

  localStorage.setItem('currentUser', JSON.stringify(user));
  return { success: true, user };
}

export function logout(): void {
  localStorage.removeItem('currentUser');
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
