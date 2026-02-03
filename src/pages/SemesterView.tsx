import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Youtube, Briefcase, Search, Filter, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Chatbot from '@/components/Chatbot';
import CommunityChat from '@/components/CommunityChat';
import GPACalculator from '@/components/GPACalculator';
import ResourceCard from '@/components/semester/ResourceCard';
import SemesterCard from '@/components/semester/SemesterCard';
import { courseData, internshipResources, majorNames, semesterData, CourseResource } from '@/data/courseData';
import { useFavorites } from '@/hooks/useFavorites';

export default function SemesterView() {
  const { majorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSemester = searchParams.get('semester') ? parseInt(searchParams.get('semester')!) : null;
  const [selectedSemester, setSelectedSemester] = useState<number | null>(initialSemester);
  const [searchQuery, setSearchQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  const majorName = majorNames[majorId || ''] || 'Unknown Major';
  const currentSemester = semesterData.find(s => s.id === selectedSemester);

  const handleToggleFavorite = (e: React.MouseEvent, resource: CourseResource) => {
    e.stopPropagation();
    if (majorId && selectedSemester) {
      toggleFavorite(String(resource.id), resource.title, selectedSemester, majorId);
    }
  };

  const getCurrentResources = (): CourseResource[] => {
    if (!selectedSemester || !majorId) return [];
    if (currentSemester?.type === 'internship') return internshipResources;
    return courseData[majorId]?.[selectedSemester] || [];
  };

  const currentResources = getCurrentResources();
  const filteredResources = currentResources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const documentResources = filteredResources.filter(r => r.type === 'documents');
  const researchResources = filteredResources.filter(r => r.type === 'research');
  const videoResources = filteredResources.filter(r => r.type === 'videos');

  const openResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navbar />

      <main className="container py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 md:mb-10"
        >
          <Button
            variant="ghost"
            onClick={() => selectedSemester ? setSelectedSemester(null) : navigate('/majors')}
            className="mb-3 sm:mb-4 hover:bg-muted group text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {selectedSemester ? 'Quay lại danh sách học kỳ' : 'Quay lại chọn ngành'}
          </Button>

          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-warning flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent truncate">
                {majorName}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {selectedSemester 
                  ? `${currentSemester?.name} ${currentSemester?.type === 'internship' ? '- Thực tập' : '- Tài liệu'}`
                  : 'Chọn học kỳ để xem tài liệu'
                }
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedSemester ? (
            /* Semester Timeline */
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="relative"
            >
              {/* Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-primary rounded-full hidden md:block opacity-30" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary rounded-full hidden md:block" />

              <div className="space-y-4 md:space-y-0">
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
            /* Semester Content */
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm tài liệu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-12 bg-card border-border/50 focus:border-primary text-sm"
                  />
                </div>
                <Button variant="outline" className="h-10 sm:h-12 px-4 sm:px-6 w-full sm:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc
                </Button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
                <div className="bg-blue-500/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 text-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-500">{documentResources.length}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Tài liệu</p>
                </div>
                <div className="bg-red-500/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 text-center">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-500">{videoResources.length}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Video</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 text-center">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-500 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-500">{researchResources.length}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Nghiên cứu</p>
                </div>
              </div>

              {currentSemester?.type === 'internship' ? (
                /* Internship Content */
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
                    <h2 className="text-base sm:text-lg md:text-xl font-bold">Tài liệu Thực tập (OJT)</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                    {filteredResources.map((resource, index) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        index={index}
                        isBookmarked={majorId ? isFavorite(String(resource.id), majorId) : false}
                        onBookmark={(e) => handleToggleFavorite(e, resource)}
                        onClick={() => openResource(resource.url)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Regular Semester Tabs */
                <Tabs defaultValue="documents" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 bg-muted/50 p-1 sm:p-1.5 rounded-lg sm:rounded-xl h-auto">
                    <TabsTrigger 
                      value="documents" 
                      className="rounded-md sm:rounded-lg py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-blue-600"
                    >
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Tài liệu</span> ({documentResources.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="videos" 
                      className="rounded-md sm:rounded-lg py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-red-500"
                    >
                      <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Video</span> ({videoResources.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="research" 
                      className="rounded-md sm:rounded-lg py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-purple-500"
                    >
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">NC</span> ({researchResources.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="documents">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                      {documentResources.length > 0 ? (
                        documentResources.map((doc, index) => (
                          <ResourceCard
                            key={doc.id}
                            resource={doc}
                            index={index}
                            isBookmarked={majorId ? isFavorite(String(doc.id), majorId) : false}
                            onBookmark={(e) => handleToggleFavorite(e, doc)}
                            onClick={() => openResource(doc.url)}
                          />
                        ))
                      ) : (
                        <EmptyState type="documents" />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="videos">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                      {videoResources.length > 0 ? (
                        videoResources.map((video, index) => (
                          <ResourceCard
                            key={video.id}
                            resource={video}
                            index={index}
                            isBookmarked={majorId ? isFavorite(String(video.id), majorId) : false}
                            onBookmark={(e) => handleToggleFavorite(e, video)}
                            onClick={() => openResource(video.url)}
                          />
                        ))
                      ) : (
                        <EmptyState type="videos" />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="research">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                      {researchResources.length > 0 ? (
                        researchResources.map((paper, index) => (
                          <ResourceCard
                            key={paper.id}
                            resource={paper}
                            index={index}
                            isBookmarked={majorId ? isFavorite(String(paper.id), majorId) : false}
                            onBookmark={(e) => handleToggleFavorite(e, paper)}
                            onClick={() => openResource(paper.url)}
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

        {/* GPA Calculator Section */}
        <GPACalculator />
      </main>

      {/* Community Chat & Chatbot */}
      <CommunityChat />
      <Chatbot />
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
