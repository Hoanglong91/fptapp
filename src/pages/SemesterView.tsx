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

// Course data with real links for each major and semester
const courseData: Record<string, Record<number, CourseResource[]>> = {
  se: {
    1: [
      { id: 1, title: 'C Programming Tutorial', source: 'W3Schools', type: 'documents', rating: 4.8, url: 'https://www.w3schools.com/c/' },
      { id: 2, title: 'Learn C Programming', source: 'GeeksforGeeks', type: 'documents', rating: 4.6, url: 'https://www.geeksforgeeks.org/c-programming-language/' },
      { id: 3, title: 'C Programming Full Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '15M', url: 'https://www.youtube.com/watch?v=KJgsSFOSQv0' },
      { id: 4, title: 'Mathematics for Computer Science', source: 'MIT OCW', type: 'research', citations: 89, url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/' },
      { id: 5, title: 'Calculus Basics', source: 'Khan Academy', type: 'documents', rating: 4.9, url: 'https://www.khanacademy.org/math/calculus-1' },
    ],
    2: [
      { id: 1, title: 'Java OOP Tutorial', source: 'W3Schools', type: 'documents', rating: 4.7, url: 'https://www.w3schools.com/java/java_oop.asp' },
      { id: 2, title: 'Data Structures in Java', source: 'GeeksforGeeks', type: 'documents', rating: 4.9, url: 'https://www.geeksforgeeks.org/data-structures/' },
      { id: 3, title: 'Java OOP Full Course', source: 'YouTube', type: 'videos', channel: 'Programming with Mosh', views: '2.5M', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34' },
      { id: 4, title: 'Discrete Mathematics', source: 'Khan Academy', type: 'documents', rating: 4.5, url: 'https://www.khanacademy.org/computing/computer-science/algorithms' },
      { id: 5, title: 'DSA Complete Guide', source: 'GitHub', type: 'documents', rating: 4.8, url: 'https://github.com/TheAlgorithms/Java' },
    ],
    3: [
      { id: 1, title: 'SQL Tutorial', source: 'W3Schools', type: 'documents', rating: 4.8, url: 'https://www.w3schools.com/sql/' },
      { id: 2, title: 'HTML CSS JavaScript', source: 'W3Schools', type: 'documents', rating: 4.6, url: 'https://www.w3schools.com/html/' },
      { id: 3, title: 'SQL Full Course 2024', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '8.7M', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { id: 4, title: 'Database Design Guide', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/database-management-system/' },
      { id: 5, title: 'Web Development Roadmap', source: 'GitHub', type: 'research', citations: 156, url: 'https://github.com/kamranahmedse/developer-roadmap' },
    ],
    4: [
      { id: 1, title: 'Software Engineering Basics', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/software-engineering/' },
      { id: 2, title: 'Operating Systems Tutorial', source: 'GeeksforGeeks', type: 'documents', rating: 4.5, url: 'https://www.geeksforgeeks.org/operating-systems/' },
      { id: 3, title: 'React JS Full Tutorial', source: 'YouTube', type: 'videos', channel: 'Traversy Media', views: '3.2M', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
      { id: 4, title: 'Computer Networks', source: 'GeeksforGeeks', type: 'documents', rating: 4.6, url: 'https://www.geeksforgeeks.org/computer-network-tutorials/' },
      { id: 5, title: 'React Documentation', source: 'React.dev', type: 'documents', rating: 4.9, url: 'https://react.dev/learn' },
    ],
    5: [
      { id: 1, title: 'Android Development Guide', source: 'Android Docs', type: 'documents', rating: 4.8, url: 'https://developer.android.com/guide' },
      { id: 2, title: 'AI & Machine Learning', source: 'GeeksforGeeks', type: 'documents', rating: 4.9, url: 'https://www.geeksforgeeks.org/machine-learning/' },
      { id: 3, title: 'Flutter Mobile Development', source: 'YouTube', type: 'videos', channel: 'The Net Ninja', views: '1.8M', url: 'https://www.youtube.com/watch?v=1ukSR1GRtMU' },
      { id: 4, title: 'Machine Learning Course', source: 'Coursera', type: 'research', citations: 234, url: 'https://www.coursera.org/learn/machine-learning' },
      { id: 5, title: 'Flutter Documentation', source: 'Flutter.dev', type: 'documents', rating: 4.7, url: 'https://docs.flutter.dev/' },
    ],
    7: [
      { id: 1, title: 'AWS Cloud Essentials', source: 'AWS Docs', type: 'documents', rating: 4.7, url: 'https://aws.amazon.com/getting-started/' },
      { id: 2, title: 'DevOps Full Course', source: 'YouTube', type: 'videos', channel: 'TechWorld with Nana', views: '2.1M', url: 'https://www.youtube.com/watch?v=j5Zsa_eOXeY' },
      { id: 3, title: 'System Design Primer', source: 'GitHub', type: 'research', citations: 312, url: 'https://github.com/donnemartin/system-design-primer' },
      { id: 4, title: 'Microservices Architecture', source: 'Microsoft Docs', type: 'documents', rating: 4.6, url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices' },
    ],
    8: [
      { id: 1, title: 'Capstone Project Ideas', source: 'GitHub', type: 'documents', rating: 4.9, url: 'https://github.com/florinpop17/app-ideas' },
      { id: 2, title: 'System Design Interview', source: 'YouTube', type: 'videos', channel: 'Gaurav Sen', views: '1.5M', url: 'https://www.youtube.com/watch?v=xpDnVSmNFX0' },
      { id: 3, title: 'Agile Methodology Guide', source: 'Atlassian', type: 'research', citations: 189, url: 'https://www.atlassian.com/agile' },
    ],
    9: [
      { id: 1, title: 'Technical Writing Guide', source: 'Google Developers', type: 'documents', rating: 4.8, url: 'https://developers.google.com/tech-writing' },
      { id: 2, title: 'Technical Interview Prep', source: 'YouTube', type: 'videos', channel: 'MIT OpenCourseWare', views: '890K', url: 'https://www.youtube.com/watch?v=N0TyNNXLzQ0' },
      { id: 3, title: 'Coding Interview University', source: 'GitHub', type: 'research', citations: 145, url: 'https://github.com/jwasham/coding-interview-university' },
    ],
  },
  mm: {
    1: [
      { id: 1, title: 'Digital Art Fundamentals', source: 'Skillshare', type: 'documents', rating: 4.7, url: 'https://www.adobe.com/creativecloud/illustration/discover/digital-art.html' },
      { id: 2, title: 'Photoshop for Beginners', source: 'YouTube', type: 'videos', channel: 'Envato Tuts+', views: '5.2M', url: 'https://www.youtube.com/watch?v=IyR_uYsRdPs' },
      { id: 3, title: 'Color Theory Guide', source: 'Canva', type: 'documents', rating: 4.6, url: 'https://www.canva.com/colors/color-wheel/' },
    ],
    2: [
      { id: 1, title: '2D Animation Guide', source: 'Adobe', type: 'documents', rating: 4.8, url: 'https://helpx.adobe.com/animate/tutorials.html' },
      { id: 2, title: 'After Effects Tutorial', source: 'YouTube', type: 'videos', channel: 'School of Motion', views: '3.8M', url: 'https://www.youtube.com/watch?v=hIjDKqYTvqk' },
    ],
    3: [
      { id: 1, title: 'Blender Documentation', source: 'Blender', type: 'documents', rating: 4.9, url: 'https://docs.blender.org/manual/en/latest/' },
      { id: 2, title: 'Blender Complete Course', source: 'YouTube', type: 'videos', channel: 'Blender Guru', views: '12M', url: 'https://www.youtube.com/watch?v=nIoXOplUvAw' },
    ],
    4: [
      { id: 1, title: 'Video Production Guide', source: 'Adobe', type: 'documents', rating: 4.6, url: 'https://helpx.adobe.com/premiere-pro/tutorials.html' },
      { id: 2, title: 'Premiere Pro Tutorial', source: 'YouTube', type: 'videos', channel: 'Justin Odisho', views: '4.5M', url: 'https://www.youtube.com/watch?v=Hls3Tp7JS8E' },
    ],
    5: [
      { id: 1, title: 'Game Design Document Template', source: 'GitHub', type: 'documents', rating: 4.8, url: 'https://github.com/game-development/game-design-document' },
      { id: 2, title: 'Unity Game Development', source: 'YouTube', type: 'videos', channel: 'Brackeys', views: '8.9M', url: 'https://www.youtube.com/watch?v=IlKaB1etrik' },
      { id: 3, title: 'Unity Learn', source: 'Unity', type: 'documents', rating: 4.9, url: 'https://learn.unity.com/' },
    ],
    7: [
      { id: 1, title: 'UX/UI Design Guide', source: 'Google', type: 'documents', rating: 4.7, url: 'https://design.google/' },
      { id: 2, title: 'Figma UI Design', source: 'YouTube', type: 'videos', channel: 'DesignCourse', views: '2.3M', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8' },
      { id: 3, title: 'Figma Learn', source: 'Figma', type: 'documents', rating: 4.8, url: 'https://help.figma.com/hc/en-us' },
    ],
    8: [
      { id: 1, title: 'Portfolio Website Templates', source: 'GitHub', type: 'documents', rating: 4.9, url: 'https://github.com/topics/portfolio-template' },
    ],
    9: [
      { id: 1, title: 'Portfolio Development Guide', source: 'Behance', type: 'documents', rating: 4.8, url: 'https://www.behance.net/galleries/graphic-design' },
    ],
  },
  cn: {
    1: [
      { id: 1, title: 'HSK 1 Vocabulary List', source: 'HSK Academy', type: 'documents', rating: 4.8, url: 'https://www.hsk.academy/en/hsk-1' },
      { id: 2, title: 'Mandarin Chinese Basics', source: 'YouTube', type: 'videos', channel: 'ChineseClass101', views: '3.2M', url: 'https://www.youtube.com/watch?v=p9Qn5Vc0F7U' },
      { id: 3, title: 'Chinese Learning Resources', source: 'HelloChinese', type: 'documents', rating: 4.7, url: 'https://www.hellochinese.cc/' },
    ],
    2: [
      { id: 1, title: 'HSK 2 Study Guide', source: 'HSK Academy', type: 'documents', rating: 4.7, url: 'https://www.hsk.academy/en/hsk-2' },
      { id: 2, title: 'Chinese Grammar Explained', source: 'YouTube', type: 'videos', channel: 'Yoyo Chinese', views: '1.8M', url: 'https://www.youtube.com/watch?v=g5m7xeFXDAU' },
      { id: 3, title: 'Chinese Grammar Wiki', source: 'AllSet Learning', type: 'documents', rating: 4.8, url: 'https://resources.allsetlearning.com/chinese/grammar/' },
    ],
    3: [
      { id: 1, title: 'Chinese Culture Introduction', source: 'China Highlights', type: 'documents', rating: 4.6, url: 'https://www.chinahighlights.com/travelguide/culture/' },
      { id: 2, title: 'Chinese History Overview', source: 'Khan Academy', type: 'research', citations: 156, url: 'https://www.khanacademy.org/humanities/world-history/ancient-medieval/early-china' },
    ],
    4: [
      { id: 1, title: 'HSK 3 Business Chinese', source: 'HSK Academy', type: 'documents', rating: 4.8, url: 'https://www.hsk.academy/en/hsk-3' },
      { id: 2, title: 'Chinese for Business', source: 'YouTube', type: 'videos', channel: 'Mandarin Corner', views: '890K', url: 'https://www.youtube.com/watch?v=QwR4x4m0EQc' },
    ],
    5: [
      { id: 1, title: 'HSK 4 Advanced Chinese', source: 'HSK Academy', type: 'documents', rating: 4.9, url: 'https://www.hsk.academy/en/hsk-4' },
      { id: 2, title: 'Advanced Chinese Reading', source: 'Du Chinese', type: 'documents', rating: 4.7, url: 'https://www.duchinese.net/' },
    ],
    7: [
      { id: 1, title: 'Translation Techniques', source: 'TranslationDirectory', type: 'documents', rating: 4.7, url: 'https://www.translationdirectory.com/articles.php' },
    ],
    8: [
      { id: 1, title: 'Interpretation Practice', source: 'YouTube', type: 'videos', channel: 'Interpreter Training', views: '450K', url: 'https://www.youtube.com/results?search_query=chinese+interpretation+practice' },
    ],
    9: [
      { id: 1, title: 'Academic Writing in Chinese', source: 'Purdue OWL', type: 'documents', rating: 4.9, url: 'https://owl.purdue.edu/owl/research_and_citation/using_research/writing_about_research.html' },
    ],
  },
  mk: {
    1: [
      { id: 1, title: 'Marketing Fundamentals', source: 'HubSpot Academy', type: 'documents', rating: 4.7, url: 'https://academy.hubspot.com/courses/inbound-marketing' },
      { id: 2, title: 'Introduction to Marketing', source: 'YouTube', type: 'videos', channel: 'HubSpot Marketing', views: '2.1M', url: 'https://www.youtube.com/watch?v=O_7Fpq6lq0E' },
      { id: 3, title: 'Marketing 101', source: 'Coursera', type: 'documents', rating: 4.8, url: 'https://www.coursera.org/learn/wharton-marketing' },
    ],
    2: [
      { id: 1, title: 'Consumer Behavior Guide', source: 'HubSpot', type: 'documents', rating: 4.8, url: 'https://blog.hubspot.com/marketing/consumer-behavior' },
      { id: 2, title: 'Psychology of Marketing', source: 'Coursera', type: 'research', citations: 234, url: 'https://www.coursera.org/learn/consumer-behavior' },
    ],
    3: [
      { id: 1, title: 'Digital Marketing Course', source: 'Google Digital Garage', type: 'documents', rating: 4.9, url: 'https://learndigital.withgoogle.com/digitalgarage' },
      { id: 2, title: 'Google Ads Full Course', source: 'YouTube', type: 'videos', channel: 'Surfside PPC', views: '1.5M', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg' },
      { id: 3, title: 'SEO Starter Guide', source: 'Google', type: 'documents', rating: 4.8, url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
    ],
    4: [
      { id: 1, title: 'Brand Strategy Guide', source: 'HubSpot', type: 'documents', rating: 4.6, url: 'https://blog.hubspot.com/marketing/branding' },
      { id: 2, title: 'Social Media Marketing', source: 'YouTube', type: 'videos', channel: 'Neil Patel', views: '3.4M', url: 'https://www.youtube.com/watch?v=Rx_dLfxjkA0' },
      { id: 3, title: 'Meta Blueprint', source: 'Meta', type: 'documents', rating: 4.7, url: 'https://www.facebookblueprint.com/' },
    ],
    5: [
      { id: 1, title: 'Marketing Research Methods', source: 'Qualtrics', type: 'documents', rating: 4.8, url: 'https://www.qualtrics.com/experience-management/research/market-research/' },
      { id: 2, title: 'Google Analytics Academy', source: 'Google', type: 'documents', rating: 4.9, url: 'https://analytics.google.com/analytics/academy/' },
    ],
    7: [
      { id: 1, title: 'Integrated Marketing Guide', source: 'HubSpot', type: 'documents', rating: 4.7, url: 'https://blog.hubspot.com/marketing/integrated-marketing-communications' },
    ],
    8: [
      { id: 1, title: 'Marketing Case Studies', source: 'Harvard Business Review', type: 'documents', rating: 4.9, url: 'https://hbr.org/topic/subject/marketing' },
    ],
    9: [
      { id: 1, title: 'Marketing Career Guide', source: 'Indeed', type: 'documents', rating: 4.8, url: 'https://www.indeed.com/career-advice/careers/what-does-a-marketing-manager-do' },
    ],
  },
};

const internshipResources: CourseResource[] = [
  { id: 1, title: 'FPT Internship Guidelines 2024', source: 'FPT University', type: 'internship', url: 'https://daihoc.fpt.edu.vn/thuc-tap-doanh-nghiep/' },
  { id: 2, title: 'Internship Report Template', source: 'FPT Template', type: 'internship', url: 'https://daihoc.fpt.edu.vn/bieu-mau-sinh-vien/' },
  { id: 3, title: 'How to Write an Internship Report', source: 'YouTube', type: 'videos', channel: 'Career Guide', views: '450K', url: 'https://www.youtube.com/watch?v=eJyVvA8_VDE' },
  { id: 4, title: 'Interview Preparation Tips', source: 'YouTube', type: 'videos', channel: 'Indeed', views: '2.8M', url: 'https://www.youtube.com/watch?v=1mHjMNZZvFo' },
  { id: 5, title: 'Resume Writing Guide', source: 'Indeed', type: 'documents', rating: 4.8, url: 'https://www.indeed.com/career-advice/resumes-cover-letters/how-to-write-a-resume' },
  { id: 6, title: 'Professional Skills Development', source: 'LinkedIn Learning', type: 'research', citations: 189, url: 'https://www.linkedin.com/learning/topics/professional-development' },
];

interface CourseResource {
  id: number;
  title: string;
  source: string;
  type: 'documents' | 'research' | 'videos' | 'internship';
  rating?: number;
  downloads?: number;
  citations?: number;
  channel?: string;
  views?: string;
  duration?: string;
  url: string;
}

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

  // Get resources for current semester and major
  const getCurrentResources = (): CourseResource[] => {
    if (!selectedSemester || !majorId) return [];
    if (currentSemester?.type === 'internship') return internshipResources;
    return courseData[majorId]?.[selectedSemester] || [];
  };

  const currentResources = getCurrentResources();
  const filteredResources = currentResources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const documentResources = filteredResources.filter(r => r.type === 'documents');
  const researchResources = filteredResources.filter(r => r.type === 'research');
  const videoResources = filteredResources.filter(r => r.type === 'videos');

  const openResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderResourceCard = (resource: CourseResource) => {
    const itemId = `${resource.type}-${resource.id}`;
    const isBookmarked = bookmarkedItems.has(itemId);

    return (
      <motion.div
        key={resource.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => openResource(resource.url)}
        className="bg-card rounded-xl border border-border p-5 hover:shadow-soft transition-all duration-300 group cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            resource.type === 'documents' ? 'bg-blue-100 text-blue-600' :
            resource.type === 'research' ? 'bg-purple-100 text-purple-600' :
            resource.type === 'videos' ? 'bg-red-100 text-red-600' :
            'bg-orange-100 text-orange-600'
          }`}>
            {resource.type === 'documents' && <FileText className="w-5 h-5" />}
            {resource.type === 'research' && <BookOpen className="w-5 h-5" />}
            {resource.type === 'videos' && <Youtube className="w-5 h-5" />}
            {resource.type === 'internship' && <Briefcase className="w-5 h-5" />}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(itemId);
            }}
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
          <span>{resource.source || resource.channel}</span>
          {resource.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span>{resource.rating}</span>
            </div>
          )}
          {resource.views && <span>{resource.views} views</span>}
          {resource.citations && <span>{resource.citations} citations</span>}
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-4 h-4" />
          <span>Mở tài liệu</span>
        </div>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map(resource => renderResourceCard(resource))}
              </div>
            ) : (
              /* Regular Semester Tabs */
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted p-1 rounded-xl">
                  <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Tài liệu ({documentResources.length})
                  </TabsTrigger>
                  <TabsTrigger value="research" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Nghiên cứu ({researchResources.length})
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Youtube className="w-4 h-4 mr-2" />
                    Video ({videoResources.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="documents">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documentResources.length > 0 ? (
                      documentResources.map(doc => renderResourceCard(doc))
                    ) : (
                      <p className="text-muted-foreground col-span-3 text-center py-8">Không có tài liệu nào cho học kỳ này</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="research">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {researchResources.length > 0 ? (
                      researchResources.map(paper => renderResourceCard(paper))
                    ) : (
                      <p className="text-muted-foreground col-span-3 text-center py-8">Không có bài nghiên cứu nào cho học kỳ này</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="videos">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoResources.length > 0 ? (
                      videoResources.map(video => renderResourceCard(video))
                    ) : (
                      <p className="text-muted-foreground col-span-3 text-center py-8">Không có video nào cho học kỳ này</p>
                    )}
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
