import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ThumbsUp, Send, Trophy, Star, Award, Trash2, HelpCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ResourceDiscussionsProps {
  resourceId: string;
  resourceTitle: string;
}

export default function ResourceDiscussions({ resourceId, resourceTitle }: ResourceDiscussionsProps) {
  const { comments, loading, addComment, deleteComment, toggleUpvote } = useDiscussions(resourceId);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        setUserRole((data as any)?.role || "student");
      }
    };
    fetchRole();
  }, [user]);

  const isAdmin = userRole === "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await addComment(newComment);
    setNewComment("");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá bình luận này?")) {
      await deleteComment(id);
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "Master": return <Trophy className="w-3 h-3 text-yellow-500" />;
      case "Pro": return <Star className="w-3 h-3 text-primary" />;
      default: return <Award className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Master": return "border-yellow-500/50 text-yellow-500 bg-yellow-500/5";
      case "Pro": return "border-primary/50 text-primary bg-primary/5";
      default: return "border-muted text-muted-foreground bg-muted/5";
    }
  };

  return (
    <div className="mt-12 bg-card rounded-3xl border border-border/50 overflow-hidden shadow-2xl shadow-black/5">
      {/* Forum Header */}
      <div className="bg-muted/10 p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase">Thảo luận môn học</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">
              Đặt câu hỏi cho môn: <span className="text-primary italic">"{resourceTitle}"</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Post Comment Input */}
        <form onSubmit={handleSubmit} className="flex gap-4 items-start">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-white font-black text-xs">U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div className="relative group">
               <textarea
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)}
                 placeholder="Hỏi bài hoặc thảo luận về môn này..."
                 className="w-full min-h-[100px] bg-muted/20 border border-border/50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-muted-foreground/50"
               />
               <div className="absolute top-4 right-4 text-muted-foreground/10 group-hover:text-primary/10 transition-colors">
                 <HelpCircle className="w-12 h-12" />
               </div>
            </div>
            <div className="flex justify-between items-center px-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] italic">
                +10 điểm khi bình luận hữu ích 💎
              </p>
              <Button 
                type="submit"
                className="rounded-full px-6 font-black uppercase tracking-widest text-xs h-10 shadow-lg shadow-primary/20"
              >
                Gửi <Send className="w-3.5 h-3.5 ml-2" />
              </Button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex gap-4 p-4 rounded-3xl hover:bg-muted/20 transition-all border border-transparent hover:border-border/20"
              >
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="w-10 h-10 border-2 border-border/50">
                    <AvatarImage src={comment.user_avatar || ""} />
                    <AvatarFallback className="bg-muted text-foreground font-black text-xs uppercase">
                      {comment.user_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${getRankColor(comment.user_rank || "Newbie")}`}>
                    {getRankIcon(comment.user_rank || "Newbie")}
                    {comment.user_rank}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="font-black text-sm uppercase tracking-tight">{comment.user_name}</span>
                       <span className="text-[10px] text-muted-foreground opacity-50">
                         • {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: vi })}
                       </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {(isAdmin || user?.id === comment.user_id) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10 transition-all flex items-center justify-center opacity-100"
                          onClick={() => handleDelete(comment.id)}
                          title="Xoá bình luận"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {comment.is_best_answer && (
                        <div className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Target className="w-2.5 h-2.5" />
                          Best Answer
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {comment.content}
                  </p>
                  
                  <div className="pt-2 flex items-center gap-4">
                    <button
                      onClick={() => toggleUpvote(comment.id)}
                      className={`flex items-center gap-1.5 py-1 px-3 rounded-full border transition-all ${
                        comment.user_has_upvoted
                          ? "bg-primary/10 border-primary text-primary scale-105 shadow-lg shadow-primary/10"
                          : "bg-muted/10 border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${comment.user_has_upvoted ? "fill-current" : ""}`} />
                      <span className="text-xs font-black">{comment.upvotes_count || 0}</span>
                    </button>
                    <button 
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors"
                    >
                      Trả lời
                    </button>
                  </div>

                  {/* Reply Input Box */}
                  <AnimatePresence>
                    {replyTo === comment.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pl-4 border-l-2 border-primary/20 space-y-3"
                      >
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Trả lời ${comment.user_name}...`}
                          className="w-full min-h-[80px] bg-muted/20 border border-border/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-full text-[10px] font-bold uppercase"
                            onClick={() => setReplyTo(null)}
                          >
                            Hủy
                          </Button>
                          <Button 
                            size="sm" 
                            className="rounded-full text-[10px] font-bold uppercase px-4"
                            onClick={async () => {
                              if (!replyText.trim()) return;
                              await addComment(`@${comment.user_name}: ${replyText}`);
                              setReplyText("");
                              setReplyTo(null);
                            }}
                          >
                            Gửi trả lời
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && comments.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-3xl opacity-50">
               <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
               <p className="font-black italic uppercase tracking-tighter text-sm">Chưa có ai thảo luận môn này sếp ơi!</p>
               <p className="text-xs font-bold mt-1 uppercase tracking-widest">Hãy là người đầu tiên đặt câu hỏi nhé 👑</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
