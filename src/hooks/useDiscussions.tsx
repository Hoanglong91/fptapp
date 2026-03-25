import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useGamification } from './useGamification';

export interface DiscussionComment {
  id: string;
  user_id: string;
  resource_id: string;
  content: string;
  is_best_answer: boolean;
  created_at: string;
  upvotes_count?: number;
  user_has_upvoted?: boolean;
  user_name?: string;
  user_avatar?: string;
  user_rank?: string;
}

export function useDiscussions(resourceId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addPoints } = useGamification();
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    if (!resourceId) return;
    setLoading(true);

    try {
      console.log('Fetching comments for resource:', resourceId);
      
      // Perform a clean fetch with explicit profile selection
      const { data, error } = await (supabase as any)
        .from('discussions')
        .select(`
          id,
          user_id,
          resource_id,
          content,
          is_best_answer,
          created_at,
          user:profiles(display_name, avatar_url, rank)
        `)
        .eq('resource_id', resourceId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }

      console.log('Raw comments data:', data);

      // Simple fetch for upvotes
      const { data: upvoteCounts, error: upvoteError } = await (supabase as any)
        .from('discussion_upvotes')
        .select('discussion_id');
      
      if (upvoteError) console.error('Error fetching upvotes:', upvoteError);

      // Check current user's upvotes
      let myUpvoteIds: string[] = [];
      if (user) {
        const { data: userUpvotes } = await (supabase as any)
          .from('discussion_upvotes')
          .select('discussion_id')
          .eq('user_id', user.id);
        
        myUpvoteIds = (userUpvotes || []).map((uv: any) => uv.discussion_id);
      }

      const formatted = (data || []).map((c: any) => {
        // Calculate upvotes for this comment
        const upVotes = (upvoteCounts || []).filter((uv: any) => uv.discussion_id === c.id).length;
        
        return {
          id: c.id,
          user_id: c.user_id,
          resource_id: c.resource_id,
          content: c.content,
          is_best_answer: c.is_best_answer || false,
          created_at: c.created_at,
          user_name: (c.user as any)?.display_name || 'FPT Student',
          user_avatar: (c.user as any)?.avatar_url,
          user_rank: (c.user as any)?.rank || 'Newbie',
          upvotes_count: upVotes,
          user_has_upvoted: myUpvoteIds.includes(c.id)
        };
      });

      console.log('Formatted comments for UI:', formatted);
      setComments(formatted);
    } catch (err) {
      console.error('CRITICAL: Error in fetchComments:', err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user) {
      toast({ title: 'Cần đăng nhập', description: 'Vui lòng đăng nhập để bình luận.', variant: 'destructive' });
      return;
    }

    try {
      console.log('Adding comment:', content);
      
      const { data, error } = await (supabase as any)
        .from('discussions')
        .insert({
          user_id: user.id,
          resource_id: resourceId,
          content
        })
        .select();

      if (error) {
        console.error('Error inserting comment:', error);
        throw error;
      }

      console.log('Comment inserted successfully:', data);
      toast({ title: 'Đã bình luận', description: 'Bình luận của bạn đã được đăng!' });
      
      // Award points
      try {
        await addPoints('comment');
      } catch (pErr) {
        console.error('Error awarding points:', pErr);
      }
      
      await fetchComments();
    } catch (err) {
      toast({ title: 'Lỗi', description: 'Không thể đăng bình luận.', variant: 'destructive' });
      console.error(err);
    }
  };

  const toggleUpvote = async (commentId: string) => {
    if (!user) return;

    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    try {
      if (comment.user_has_upvoted) {
        await (supabase as any)
          .from('discussion_upvotes')
          .delete()
          .eq('user_id', user.id)
          .eq('discussion_id', commentId);
      } else {
        await (supabase as any)
          .from('discussion_upvotes')
          .insert({
            user_id: user.id,
            discussion_id: commentId
          });
          
        await addPoints('like');
      }
      
      await fetchComments();
    } catch (err) {
      console.error('Error toggling upvote:', err);
    }
  };

  useEffect(() => {
    if (resourceId) {
      fetchComments();
    }
  }, [resourceId, user]);

  return { comments, loading, addComment, toggleUpvote, refresh: fetchComments };
}
