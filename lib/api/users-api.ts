import type { User } from '../../src/types';
import { API_CONFIG } from '../../src/config/api.config';

const API_BASE = API_CONFIG.BASE_URL;

interface BackendUser {
  id: number;
  full_name: string;
  company_name?: string;
  company?: string;
  email: string;
  role_name?: string;
  onboarding_completed?: boolean;
  create_date_time?: string;
}

interface ApiEnvelope<T> {
  success?: boolean;
  status?: 'success' | 'error';
  message?: string;
  data: T;
  count?: number;
}

class UsersApiError extends Error {}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  let body: ApiEnvelope<T> | null = null;
  try {
    body = await res.json();
  } catch {}

  if (!res.ok || (body && body.success === false) || (body && body.status === 'error')) {
    throw new UsersApiError(body?.message || `Request failed (${res.status})`);
  }

  return (body?.data as T) ?? (undefined as T);
}

function placeholderAvatar(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'U')}`;
}

const SELLER_ROLES = new Set(['seller_free', 'seller_premium']);

function toUser(row: BackendUser): User {
  const role = row.role_name ?? '';
  return {
    id: String(row.id),
    name: row.full_name || 'Unknown user',
    avatar: placeholderAvatar(row.full_name ?? ''),
    email: row.email,
    companyName: row.company_name ?? row.company ?? '',
    role: role,
    isVerified: SELLER_ROLES.has(role),
  } as User;
}

/** GET /api/users — every user on the platform. */
export async function fetchAllUsers(): Promise<User[]> {
  const rows = await apiFetch<BackendUser[]>(API_CONFIG.ENDPOINTS.USERS.LIST);
  return (rows ?? []).map(toUser);
}

/** GET /api/users/:id — single user by id. */
export async function fetchUserById(id: string): Promise<User> {
  const row = await apiFetch<BackendUser>(API_CONFIG.ENDPOINTS.USERS.DETAIL(id));
  return toUser(row);
}

export { UsersApiError };