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
      console.log('🔍 Fetching discussions with profiles...');
      
      const { data, error } = await (supabase as any)
        .from('discussions')
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url,
            rank,
            points
          ),
          discussion_upvotes (
            user_id
          )
        `)
        .eq('resource_id', resourceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) {
        setComments([]);
        return;
      }

      const formatted = data.map((item: any) => {
        const profile = item.profiles || {};
        const upvotes = item.discussion_upvotes || [];
        const upCount = upvotes.length;
        const userHasUpvoted = user ? upvotes.some((uv: any) => uv.user_id === user.id) : false;
        
        // Rank & Name logic
        const userRank = profile.rank || 'Newbie';
        let displayName = profile.display_name;
        
        // FALLBACK: If this is the current user, use their Auth metadata
        if (!displayName && user && item.user_id === user.id) {
          displayName = user.user_metadata?.display_name || user.email?.split('@')[0];
        }
        
        if (!displayName) {
          displayName = 'Học viên FPT';
        }
        
        return {
          id: item.id,
          user_id: item.user_id,
          resource_id: item.resource_id,
          content: item.content || '',
          is_best_answer: item.is_best_answer || false,
          created_at: item.created_at,
          user_name: displayName,
          user_avatar: profile.avatar_url,
          user_rank: userRank,
          upvotes_count: upCount,
          user_has_upvoted: userHasUpvoted
        };
      });

      console.log('✨ Comments loaded:', formatted);
      setComments(formatted);
    } catch (err) {
      console.error('🔥 Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;
    
    try {
      console.log('🗑️ Attempting to delete comment:', commentId);
      const { error } = await (supabase as any)
        .from('discussions')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({ title: 'Đã xoá', description: 'Bình luận đã được xoá thành công!' });
      await fetchComments();
    } catch (err: any) {
      console.error('❌ Error deleting comment:', err);
      toast({ 
        title: 'Lỗi', 
        description: 'Không thể xoá bình luận. Vui lòng thử lại.', 
        variant: 'destructive' 
      });
    }
  };

  const addComment = async (content: string) => {
    if (!user) {
      toast({ title: 'Cần đăng nhập', description: 'Vui lòng đăng nhập để bình luận.', variant: 'destructive' });
      return;
    }

    try {
      console.log('🚀 Step 1: Inserting comment for user:', user.id);
      
      // We insert into discussions and let the database handle common defaults
      const { data, error } = await (supabase as any)
        .from('discussions')
        .insert({
          user_id: user.id, // This should match the profiles.id
          resource_id: resourceId,
          content: content.trim()
        })
        .select();

      if (error) {
        console.error('❌ DISCUSSIONS INSERT ERROR:', error);
        throw error;
      }

      console.log('✅ Comment saved successfully!', data);
      toast({ title: 'Đã bình luận', description: 'Bình luận của bạn đã được đăng!' });
      
      // Update local state immediately for instant feedback
      await fetchComments();

      // OPTIONAL: Award points in background (doesn't block if fails)
      try {
        console.log('💎 Step 2: Attempting to award points...');
        await addPoints('comment');
      } catch (pErr) {
        console.warn('⚠️ Points awarding failed, but comment was saved:', pErr);
      }
      
    } catch (err: any) {
      console.error('🔥 CRITICAL ERROR in addComment:', err);
      toast({ 
        title: 'Lỗi đăng bình luận', 
        description: err.message || 'Hệ thống đang bận, vui lòng thử lại sau.', 
        variant: 'destructive' 
      });
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

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    toggleUpvote,
    refresh: fetchComments
  };
}
