import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Youtube, Briefcase, Search, Bookmark, ExternalLink, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Chatbot from '@/components/Chatbot';
import GPACalculator from '@/components/GPACalculator';

const semesterData = [
  { id: 1, name: 'Semester 1', type: 'regular' },
  { id: 2, name: 'Semester 2', type: 'regular' },
  { id: 3, name: 'Semester 3', type: 'regular' },
  { id: 4, name: 'Semester 4', type: 'regular' },
  { id: 5, name: 'Semester 5', type: 'regular' },
  { id: 6, name: 'Semester 6', type: 'internship' },
  { id: 7, name: 'Semester 7', type: 'regular' },
  { id: 8, name: 'Semester 8', type: 'regular' },
  { id: 9, name: 'Semester 9', type: 'regular' },
];

const majorNames: Record<string, string> = {
  se: 'Software Engineering',
  mm: 'Multimedia',
  cn: 'Chinese Language',
  mk: 'Marketing',
};

const sampleResources = {
  documents: [
    { id: 1, title: 'Introduction to Programming - Complete Notes', source: 'Studocu', rating: 4.8, downloads: 1250 },
    { id: 2, title: 'Data Structures & Algorithms Summary', source: 'Studocu', rating: 4.5, downloads: 890 },
    { id: 3, title: 'Database Design Fundamentals', source: 'Studocu', rating: 4.7, downloads: 756 },
    { id: 4, title: 'Web Development Basics', source: 'Studocu', rating: 4.6, downloads: 920 },
  ],
  research: [
    { id: 1, title: 'Modern Software Development Practices', source: 'ResearchGate', citations: 145 },
    { id: 2, title: 'AI in Education: A Systematic Review', source: 'ResearchGate', citations: 89 },
    { id: 3, title: 'Cloud Computing Architecture Patterns', source: 'ResearchGate', citations: 234 },
  ],
  videos: [
    { id: 1, title: 'Complete Programming Course for Beginners', channel: 'FPT Tech', views: '125K', duration: '4:32:15' },
    { id: 2, title: 'Data Structures Explained', channel: 'CS Academy', views: '89K', duration: '2:15:30' },
    { id: 3, title: 'Web Development Full Tutorial', channel: 'Code With Me', views: '234K', duration: '6:45:00' },
  ],
  internship: [
    { id: 1, title: 'Internship Guidelines 2024', type: 'PDF Guide' },
    { id: 2, title: 'Report Template', type: 'DOCX Template' },
    { id: 3, title: 'Company Preparation Tips', type: 'Article' },
    { id: 4, title: 'Interview Questions Database', type: 'Resource' },
  ],
};

export default function SemesterView() {
  const { majorId } = useParams();
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  const majorName = majorNames[majorId || ''] || 'Unknown Major';
  const currentSemester = semesterData.find(s => s.id === selectedSemester);

  const toggleBookmark = (itemId: string) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderResourceCard = (resource: any, type: string) => {
    const itemId = `${type}-${resource.id}`;
    const isBookmarked = bookmarkedItems.has(itemId);

    return (
      <motion.div
        key={resource.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-5 hover:shadow-soft transition-all duration-300 group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            type === 'documents' ? 'bg-blue-100 text-blue-600' :
            type === 'research' ? 'bg-purple-100 text-purple-600' :
            type === 'videos' ? 'bg-red-100 text-red-600' :
            'bg-orange-100 text-orange-600'
          }`}>
            {type === 'documents' && <FileText className="w-5 h-5" />}
            {type === 'research' && <BookOpen className="w-5 h-5" />}
            {type === 'videos' && <Youtube className="w-5 h-5" />}
            {type === 'internship' && <Briefcase className="w-5 h-5" />}
          </div>
          <button
            onClick={() => toggleBookmark(itemId)}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-muted'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <h4 className="font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {resource.title}
        </h4>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{resource.source || resource.channel || resource.type}</span>
          {resource.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span>{resource.rating}</span>
            </div>
          )}
          {resource.views && <span>{resource.views} views</span>}
          {resource.citations && <span>{resource.citations} citations</span>}
        </div>

        <Button variant="ghost" size="sm" className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Resource
        </Button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Back Button & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => selectedSemester ? setSelectedSemester(null) : navigate('/majors')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {selectedSemester ? 'Back to Semesters' : 'Back to Majors'}
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {majorName}
          </h1>
          <p className="text-muted-foreground">
            {selectedSemester 
              ? `${currentSemester?.name} ${currentSemester?.type === 'internship' ? '- Internship' : '- Learning Materials'}`
              : 'Select a semester to view learning materials'
            }
          </p>
        </motion.div>

        {!selectedSemester ? (
          /* Semester Timeline */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-primary rounded-full hidden md:block" />

            <div className="space-y-6 md:space-y-0">
              {semesterData.map((semester, index) => (
                <motion.div
                  key={semester.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} md:py-4`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-md hidden md:block z-10" />

                  {/* Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedSemester(semester.id)}
                    className={`w-full md:w-[calc(50%-3rem)] cursor-pointer ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}
                  >
                    <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lifted ${
                      semester.type === 'internship' 
                        ? 'bg-gradient-to-r from-warning/10 to-primary/10 border-warning/30 hover:border-warning'
                        : 'bg-card border-border hover:border-primary'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${
                          semester.type === 'internship'
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          {semester.id}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{semester.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {semester.type === 'internship' ? 'Internship Period' : 'Academic Semester'}
                          </p>
                        </div>
                        {semester.type === 'internship' && (
                          <Briefcase className="ml-auto w-6 h-6 text-warning" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Semester Content */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {currentSemester?.type === 'internship' ? (
              /* Internship Content */
              <div className="grid md:grid-cols-2 gap-4">
                {sampleResources.internship.map(resource => renderResourceCard(resource, 'internship'))}
              </div>
            ) : (
              /* Regular Semester Tabs */
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted p-1 rounded-xl">
                  <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="research" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Research
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Youtube className="w-4 h-4 mr-2" />
                    Videos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="documents">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sampleResources.documents.map(doc => renderResourceCard(doc, 'documents'))}
                  </div>
                </TabsContent>

                <TabsContent value="research">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sampleResources.research.map(paper => renderResourceCard(paper, 'research'))}
                  </div>
                </TabsContent>

                <TabsContent value="videos">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sampleResources.videos.map(video => renderResourceCard(video, 'videos'))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </motion.div>
        )}

        {/* GPA Calculator Section */}
        <GPACalculator />
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
