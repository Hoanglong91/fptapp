import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Youtube, Briefcase, Search, Filter, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Chatbot from '@/components/Chatbot';
import CommunityChat from '@/components/CommunityChat';
import ResourceCard from '@/components/semester/ResourceCard';
import SemesterCard from '@/components/semester/SemesterCard';
import ResourceDiscussions from '@/components/semester/ResourceDiscussions';
import { courseData, internshipResources, majorNames, semesterData, CourseResource } from '@/data/courseData';
import { useFavorites } from '@/hooks/useFavorites';
import { useGamification } from '@/hooks/useGamification';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ExternalLink, MessageSquare, ThumbsUp, Zap } from 'lucide-react';

export default function SemesterView() {
  const { majorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSemester = searchParams.get('semester') ? parseInt(searchParams.get('semester')!) : null;
  const [selectedSemester, setSelectedSemester] = useState<number | null>(initialSemester);
  const [dbResources, setDbResources] = useState<CourseResource[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<CourseResource | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addPoints } = useGamification();

  const majorName = majorNames[majorId || ''] || 'Unknown Major';
  const currentSemester = semesterData.find(s => s.id === selectedSemester);

  const handleToggleFavorite = (e: React.MouseEvent, resource: CourseResource) => {
    e.stopPropagation();
    if (majorId && selectedSemester) {
      toggleFavorite(String(resource.id), resource.title, selectedSemester, majorId);
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      // If there's a search query, do a global search across all semesters
      if (searchQuery.length >= 2) {
        setDbLoading(true);
        try {
          const { data, error } = await (supabase as any)
            .from('curriculum_resources')
            .select('*')
            .ilike('title', `%${searchQuery}%`);

          if (!error && data) {
            setDbResources(data);
          }
        } catch (err) {
          console.error('Error global searching:', err);
        } finally {
          setDbLoading(false);
        }
        return;
      }

      // Normal behavior: fetch for specific major and semester
      if (!selectedSemester || !majorId) {
        setDbResources([]);
        return;
      }
      
      setDbLoading(true);
      try {
        const { data, error } = await (supabase as any)
          .from('curriculum_resources')
          .select('*')
          .eq('major', majorId)
          .eq('semester', selectedSemester);

        if (!error && data && data.length > 0) {
          setDbResources(data);
        } else {
          // Fallback to hardcoded data if nothing in DB
          const hardcoded = currentSemester?.type === 'internship' 
            ? internshipResources 
            : courseData[majorId]?.[selectedSemester] || [];
          setDbResources(hardcoded);
        }
      } catch (err) {
        console.error('Error fetching db resources:', err);
      } finally {
        setDbLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResources();
    }, 300); // Add debounce

    return () => clearTimeout(timer);
  }, [selectedSemester, majorId, searchQuery]);

  const currentResources = dbResources;
  const filteredResources = currentResources; // The query already filters it

  const documentResources = filteredResources.filter(r => r.type === 'documents');
  const researchResources = filteredResources.filter(r => r.type === 'research');
  const videoResources = filteredResources.filter(r => r.type === 'videos');

  const openResource = (resource: CourseResource) => {
    setSelectedResource(resource);
  };

  const handleExternalAction = (url: string) => {
    addPoints('download');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/50 to-background">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => selectedSemester ? setSelectedSemester(null) : navigate('/majors')}
            className="mb-6 hover:bg-primary/10 group text-sm font-bold rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {selectedSemester ? 'Quay lại danh sách học kỳ' : 'Quay lại chọn ngành'}
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black italic tracking-tighter bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent uppercase">
                  {majorName}
                </h1>
                <p className="text-xs sm:text-sm font-bold opacity-50 uppercase tracking-widest mt-1">
                  {selectedSemester 
                    ? `${currentSemester?.name} ${currentSemester?.type === 'internship' ? '• Thực tập OJT' : '• Kho học liệu'}`
                    : 'Chọn học kỳ để bắt đầu hành trình'
                  }
                </p>
              </div>
            </div>

            {/* Global Search Bar (Always visible in Header or content) */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
              <Input
                placeholder="Tìm mã môn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 sm:h-14 bg-card/50 backdrop-blur-xl border-border/50 focus:border-primary text-base rounded-2xl shadow-xl shadow-black/5"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary uppercase hover:opacity-70 transition-opacity"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {dbLoading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
             <p className="font-black tracking-[0.3em] animate-pulse text-sm uppercase">Đang truy quét kho học liệu...</p>
          </div>
        ) : searchQuery.length >= 2 ? (
          /* UNIFIED SEARCH HUB VIEW */
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between border-b border-border/10 pb-6">
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter flex items-center gap-3">
                 <div className="w-2 h-8 bg-primary rounded-full" />
                 KẾT QUẢ TÌM KIẾM: <span className="text-primary uppercase underline underline-offset-8">"{searchQuery}"</span>
              </h2>
              <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-xs font-black text-primary uppercase tracking-widest">Tìm thấy {filteredResources.length} mục</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  index={index}
                  isBookmarked={majorId ? isFavorite(String(resource.id), majorId) : false}
                  onBookmark={(e) => handleToggleFavorite(e, resource)}
                  onClick={() => openResource(resource)}
                />
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-32 bg-muted/20 rounded-[4rem] border border-dashed border-border/50">
                 <Search className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-10" />
                 <p className="text-2xl font-black opacity-30 italic uppercase tracking-tighter">Hic, không tìm thấy môn này sếp ơi!</p>
                 <p className="text-sm opacity-20 font-bold mt-2 uppercase tracking-widest">Thử kiểm tra lại mã môn xem sao nhé</p>
              </div>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {!selectedSemester ? (
              /* Timeline / Semester Grid */
              <motion.div
                key="timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="relative"
              >
                {/* Visual Timeline Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-secondary/50 to-primary/50 rounded-full hidden lg:block blur-[2px] opacity-20" />
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary rounded-full hidden lg:block opacity-40" />

                <div className="space-y-6 lg:space-y-0">
                  {semesterData.map((semester, index) => (
                    <SemesterCard
                      key={semester.id}
                      semester={semester}
                      index={index}
                      onClick={() => setSelectedSemester(semester.id)}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Standard Semester View with Tabs */
              <motion.div
                key="content"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-12"
              >
                {/* Quick Stats Bar */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-blue-500/5 hover:bg-blue-500/10 transition-colors rounded-3xl p-4 sm:p-6 border border-blue-500/10 text-center group">
                    <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-2xl sm:text-4xl font-black text-blue-500">{documentResources.length}</p>
                    <p className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">Tài liệu</p>
                  </div>
                  <div className="bg-red-500/5 hover:bg-red-500/10 transition-colors rounded-3xl p-4 sm:p-6 border border-red-500/10 text-center group">
                    <Youtube className="w-8 h-8 text-red-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-2xl sm:text-4xl font-black text-red-500">{videoResources.length}</p>
                    <p className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">Video</p>
                  </div>
                  <div className="bg-purple-500/5 hover:bg-purple-500/10 transition-colors rounded-3xl p-4 sm:p-6 border border-purple-500/10 text-center group">
                    <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-2xl sm:text-4xl font-black text-purple-500">{researchResources.length}</p>
                    <p className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">Nghiên cứu</p>
                  </div>
                </div>

                {currentSemester?.type === 'internship' ? (
                  /* Internship Experience */
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
                        <Briefcase className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase">Kinh nghiệm Thực tập (OJT)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredResources.map((resource, index) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          index={index}
                          isBookmarked={majorId ? isFavorite(String(resource.id), majorId) : false}
                          onBookmark={(e) => handleToggleFavorite(e, resource)}
                          onClick={() => openResource(resource)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Regular Academic Semester */
                  <Tabs defaultValue="documents" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-10 bg-muted/30 p-2 rounded-[2rem] h-auto border border-white/5 backdrop-blur-md">
                      <TabsTrigger 
                        value="documents" 
                        className="rounded-[1.5rem] py-4 text-sm font-black uppercase tracking-widest data-[state=active]:bg-card data-[state=active]:text-blue-500 data-[state=active]:shadow-2xl transition-all"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Tài liệu ({documentResources.length})
                      </TabsTrigger>
                      <TabsTrigger 
                        value="videos" 
                        className="rounded-[1.5rem] py-4 text-sm font-black uppercase tracking-widest data-[state=active]:bg-card data-[state=active]:text-red-500 data-[state=active]:shadow-2xl transition-all"
                      >
                        <Youtube className="w-4 h-4 mr-2" />
                        Video ({videoResources.length})
                      </TabsTrigger>
                      <TabsTrigger 
                        value="research" 
                        className="rounded-[1.5rem] py-4 text-sm font-black uppercase tracking-widest data-[state=active]:bg-card data-[state=active]:text-purple-500 data-[state=active]:shadow-2xl transition-all"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        NC ({researchResources.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="documents" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {documentResources.length > 0 ? (
                          documentResources.map((doc, index) => (
                            <ResourceCard
                              key={doc.id}
                              resource={doc}
                              index={index}
                              isBookmarked={majorId ? isFavorite(String(doc.id), majorId) : false}
                              onBookmark={(e) => handleToggleFavorite(e, doc)}
                              onClick={() => openResource(doc)}
                            />
                          ))
                        ) : (
                          <EmptyState type="documents" />
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="videos" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videoResources.length > 0 ? (
                          videoResources.map((video, index) => (
                            <ResourceCard
                              key={video.id}
                              resource={video}
                              index={index}
                              isBookmarked={majorId ? isFavorite(String(video.id), majorId) : false}
                              onBookmark={(e) => handleToggleFavorite(e, video)}
                              onClick={() => openResource(video)}
                            />
                          ))
                        ) : (
                          <EmptyState type="videos" />
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="research" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {researchResources.length > 0 ? (
                          researchResources.map((paper, index) => (
                            <ResourceCard
                              key={paper.id}
                              resource={paper}
                              index={index}
                              isBookmarked={majorId ? isFavorite(String(paper.id), majorId) : false}
                              onBookmark={(e) => handleToggleFavorite(e, paper)}
                              onClick={() => openResource(paper)}
                            />
                          ))
                        ) : (
                          <EmptyState type="research" />
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Community Chat & Chatbot */}
      <CommunityChat major={majorId} />
      <Chatbot />

      {/* Resource Detail & Discussion Mini-Forum */}
      <Sheet open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl bg-background border-l border-border/50 p-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 space-y-8">
            {selectedResource && (
              <>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                         {selectedResource.source} • {selectedResource.type}
                       </span>
                       <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase leading-none">
                         {selectedResource.title}
                       </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-muted/20 rounded-2xl border border-border/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Đánh giá môn học</p>
                        <div className="flex items-center gap-1 text-warning">
                           <Zap className="w-4 h-4 fill-current" />
                           <span className="text-lg font-black italic">{selectedResource.rating || 'N/A'}</span>
                        </div>
                     </div>
                     <div className="p-4 bg-muted/20 rounded-2xl border border-border/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Lượt thảo luận</p>
                        <div className="flex items-center gap-1 text-primary">
                           <MessageSquare className="w-4 h-4 fill-current" />
                           <span className="text-lg font-black italic">Active</span>
                        </div>
                     </div>
                  </div>

                  <Button 
                    variant="default" 
                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 group"
                    onClick={() => handleExternalAction(selectedResource.url)}
                  >
                    Mở tài liệu ngay <ExternalLink className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                  </Button>
                  
                  <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest opacity-50">
                     Nhận +5 điểm khi mở tài liệu học tập 💎
                  </p>
                </motion.div>

                {/* Discussion Section */}
                <ResourceDiscussions 
                   resourceId={String(selectedResource.id)} 
                   resourceTitle={selectedResource.title} 
                />
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function EmptyState({ type }: { type: string }) {
  const messages: Record<string, { icon: React.ReactNode; text: string }> = {
    documents: { icon: <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/50" />, text: 'Chưa có tài liệu cho học kỳ này' },
    videos: { icon: <Youtube className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/50" />, text: 'Chưa có video cho học kỳ này' },
    research: { icon: <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/50" />, text: 'Chưa có bài nghiên cứu cho học kỳ này' },
  };

  const { icon, text } = messages[type] || messages.documents;

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
      {icon}
      <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">{text}</p>
      <p className="text-xs sm:text-sm text-muted-foreground/70">Tài liệu sẽ được cập nhật sớm</p>
    </div>
  );
}
