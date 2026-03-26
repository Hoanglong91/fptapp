import { vi } from 'vitest';

export const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
    getUser: vi.fn(),
    updateUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  })),
  rpc: vi.fn(),
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
  })),
  removeChannel: vi.fn(),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));
