import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LeaderboardPage from '@/pages/LeaderboardPage';
import { mockSupabase } from '../mocks/supabase';

vi.mock('@/integrations/supabase/client', async () => {
  const actual = await vi.importActual('../mocks/supabase') as any;
  return { supabase: actual.mockSupabase };
});
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock Navbar (it uses useAuth, useLearningStreak internally)
vi.mock('@/components/layout/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock('@/components/OnlineUsersCounter', () => ({
  default: () => <div data-testid="online-counter">Online</div>,
}));

vi.mock('@/components/Chatbot', () => ({
  default: () => <div data-testid="chatbot">Chatbot</div>,
}));

vi.mock('@/components/CommunityChat', () => ({
  default: () => <div data-testid="community-chat">CommunityChat</div>,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

describe('LeaderboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock data for ranking
    const mockUsers = [
      { user_id: '1', display_name: 'Student A', points: 500, rank: 'Master', major: 'se' },
      { user_id: '2', display_name: 'Student B', points: 100, rank: 'Pro', major: 'mm' },
    ];
    
    (mockSupabase.from as any).mockImplementation((table: string) => {
      return {
        select: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockUsers, error: null }),
      };
    });
  });

  it('should render the leaderboard title and student list', async () => {
    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    // Default language is Vietnamese
    expect(screen.getByText(/Bảng xếp hạng/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Student A')).toBeInTheDocument();
      expect(screen.getByText('Student B')).toBeInTheDocument();
    });

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Master')).toBeInTheDocument();
  });

  it('should show empty state when no students found', async () => {
    (mockSupabase.from as any).mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    }));

    render(
      <TestWrapper>
        <LeaderboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Không tìm thấy cao thủ nào/i)).toBeInTheDocument();
    });
  });
});

