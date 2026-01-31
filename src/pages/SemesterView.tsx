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
      { id: 1, title: 'Programming Fundamentals (PRF192)', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/programming-fundamental/prf192-pe-a-no-ans/87091920' },
      { id: 2, title: 'Mathematics for Engineering (MAE101)', source: 'Studocu', type: 'documents', rating: 4.6, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/mathematics-for-engineering/mae101-calculus-midterm-exam/55204018' },
      { id: 3, title: 'C Programming Tutorial', source: 'YouTube', type: 'videos', channel: 'FPT Software', views: '125K', url: 'https://www.youtube.com/watch?v=KJgsSFOSQv0' },
      { id: 4, title: 'Academic Skills for University Success', source: 'ResearchGate', type: 'research', citations: 89, url: 'https://www.researchgate.net/publication/228668953_Academic_Skills_for_University_Success' },
    ],
    2: [
      { id: 1, title: 'Object-Oriented Programming (PRO192)', source: 'Studocu', type: 'documents', rating: 4.7, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/object-oriented-programming/pro192-java-oop-complete-notes/82938475' },
      { id: 2, title: 'Data Structures & Algorithms (CSD201)', source: 'Studocu', type: 'documents', rating: 4.9, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/data-structures-and-algorithms/csd201-data-structure-algorithm/76543210' },
      { id: 3, title: 'Java OOP Full Course', source: 'YouTube', type: 'videos', channel: 'Programming with Mosh', views: '2.5M', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34' },
      { id: 4, title: 'Discrete Mathematics (MAD101)', source: 'Studocu', type: 'documents', rating: 4.5, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/discrete-mathematics/mad101-discrete-math-summary/65432109' },
    ],
    3: [
      { id: 1, title: 'Database Management (DBI202)', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/database-systems/dbi202-database-complete-guide/87654321' },
      { id: 2, title: 'Web Development (WEB201)', source: 'Studocu', type: 'documents', rating: 4.6, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/web-development/web201-html-css-javascript/76543219' },
      { id: 3, title: 'SQL Tutorial Full Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '8.7M', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { id: 4, title: 'Software Requirements Engineering', source: 'ResearchGate', type: 'research', citations: 156, url: 'https://www.researchgate.net/publication/220017787_Software_Requirements_Engineering' },
    ],
    4: [
      { id: 1, title: 'Software Engineering (SWE201c)', source: 'Studocu', type: 'documents', rating: 4.7, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/software-engineering/swe201c-software-engineering-notes/98765432' },
      { id: 2, title: 'Operating Systems (OSG202)', source: 'Studocu', type: 'documents', rating: 4.5, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/operating-systems/osg202-os-complete-guide/87654329' },
      { id: 3, title: 'React JS Full Tutorial', source: 'YouTube', type: 'videos', channel: 'Traversy Media', views: '3.2M', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
      { id: 4, title: 'Computer Networking (NWC203c)', source: 'Studocu', type: 'documents', rating: 4.6, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/computer-networking/nwc203c-networking-fundamentals/76543298' },
    ],
    5: [
      { id: 1, title: 'Mobile Programming (PRM392)', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/mobile-programming/prm392-android-development/98765421' },
      { id: 2, title: 'Artificial Intelligence (AIL302m)', source: 'Studocu', type: 'documents', rating: 4.9, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/artificial-intelligence/ail302m-ai-fundamentals/87654318' },
      { id: 3, title: 'Flutter Mobile Development', source: 'YouTube', type: 'videos', channel: 'The Net Ninja', views: '1.8M', url: 'https://www.youtube.com/watch?v=1ukSR1GRtMU' },
      { id: 4, title: 'Machine Learning Applications', source: 'ResearchGate', type: 'research', citations: 234, url: 'https://www.researchgate.net/publication/321418332_Machine_Learning_Applications' },
    ],
    7: [
      { id: 1, title: 'Cloud Computing (CLO201)', source: 'Studocu', type: 'documents', rating: 4.7, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/cloud-computing/clo201-aws-azure-guide/98765410' },
      { id: 2, title: 'DevOps Practices', source: 'YouTube', type: 'videos', channel: 'TechWorld with Nana', views: '2.1M', url: 'https://www.youtube.com/watch?v=j5Zsa_eOXeY' },
      { id: 3, title: 'Software Architecture Patterns', source: 'ResearchGate', type: 'research', citations: 312, url: 'https://www.researchgate.net/publication/303889226_Software_Architecture_Patterns' },
      { id: 4, title: 'Microservices Design', source: 'Studocu', type: 'documents', rating: 4.6, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/software-architecture/microservices-patterns/87654307' },
    ],
    8: [
      { id: 1, title: 'Capstone Project Guidelines', source: 'Studocu', type: 'documents', rating: 4.9, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/capstone-project/capstone-guidelines-2024/98765401' },
      { id: 2, title: 'System Design Interview', source: 'YouTube', type: 'videos', channel: 'Gaurav Sen', views: '1.5M', url: 'https://www.youtube.com/watch?v=xpDnVSmNFX0' },
      { id: 3, title: 'Agile Project Management', source: 'ResearchGate', type: 'research', citations: 189, url: 'https://www.researchgate.net/publication/328955407_Agile_Project_Management' },
    ],
    9: [
      { id: 1, title: 'Graduation Thesis Template', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/document/truong-dai-hoc-fpt/graduation-thesis/thesis-template-guide/98765400' },
      { id: 2, title: 'Technical Writing for Engineers', source: 'YouTube', type: 'videos', channel: 'MIT OpenCourseWare', views: '890K', url: 'https://www.youtube.com/watch?v=N0TyNNXLzQ0' },
      { id: 3, title: 'Career Preparation for IT Graduates', source: 'ResearchGate', type: 'research', citations: 145, url: 'https://www.researchgate.net/publication/332567890_Career_Preparation_IT' },
    ],
  },
  mm: {
    1: [
      { id: 1, title: 'Digital Art Fundamentals', source: 'Studocu', type: 'documents', rating: 4.7, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/digital-art-fundamentals/5982938' },
      { id: 2, title: 'Photoshop for Beginners', source: 'YouTube', type: 'videos', channel: 'Envato Tuts+', views: '5.2M', url: 'https://www.youtube.com/watch?v=IyR_uYsRdPs' },
      { id: 3, title: 'Color Theory in Design', source: 'ResearchGate', type: 'research', citations: 78, url: 'https://www.researchgate.net/publication/279865432_Color_Theory_Digital_Design' },
    ],
    2: [
      { id: 1, title: '2D Animation Techniques', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/2d-animation/5982940' },
      { id: 2, title: 'After Effects Tutorial', source: 'YouTube', type: 'videos', channel: 'School of Motion', views: '3.8M', url: 'https://www.youtube.com/watch?v=hIjDKqYTvqk' },
    ],
    3: [
      { id: 1, title: '3D Modeling with Blender', source: 'Studocu', type: 'documents', rating: 4.9, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/3d-modeling/5982941' },
      { id: 2, title: 'Blender Complete Course', source: 'YouTube', type: 'videos', channel: 'Blender Guru', views: '12M', url: 'https://www.youtube.com/watch?v=nIoXOplUvAw' },
    ],
    4: [
      { id: 1, title: 'Video Production Essentials', source: 'Studocu', type: 'documents', rating: 4.6, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/video-production/5982942' },
      { id: 2, title: 'Premiere Pro Tutorial', source: 'YouTube', type: 'videos', channel: 'Justin Odisho', views: '4.5M', url: 'https://www.youtube.com/watch?v=Hls3Tp7JS8E' },
    ],
    5: [
      { id: 1, title: 'Game Design Principles', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/game-design/5982943' },
      { id: 2, title: 'Unity Game Development', source: 'YouTube', type: 'videos', channel: 'Brackeys', views: '8.9M', url: 'https://www.youtube.com/watch?v=IlKaB1etrik' },
    ],
    7: [
      { id: 1, title: 'UX/UI Design Portfolio', source: 'Studocu', type: 'documents', rating: 4.7, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/ux-ui-design/5982944' },
      { id: 2, title: 'Figma UI Design', source: 'YouTube', type: 'videos', channel: 'DesignCourse', views: '2.3M', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8' },
    ],
    8: [
      { id: 1, title: 'Multimedia Capstone Project', source: 'Studocu', type: 'documents', rating: 4.9, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/capstone-multimedia/5982945' },
    ],
    9: [
      { id: 1, title: 'Portfolio Development', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/portfolio-development/5982946' },
    ],
  },
  cn: {
    1: [
      { id: 1, title: 'Chinese for Beginners (HSK1)', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/chinese-hsk1/5982950' },
      { id: 2, title: 'Mandarin Chinese Basics', source: 'YouTube', type: 'videos', channel: 'ChineseClass101', views: '3.2M', url: 'https://www.youtube.com/watch?v=p9Qn5Vc0F7U' },
    ],
    2: [
      { id: 1, title: 'Intermediate Chinese (HSK2)', source: 'Studocu', type: 'documents', rating: 4.7, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/chinese-hsk2/5982951' },
      { id: 2, title: 'Chinese Grammar Explained', source: 'YouTube', type: 'videos', channel: 'Yoyo Chinese', views: '1.8M', url: 'https://www.youtube.com/watch?v=g5m7xeFXDAU' },
    ],
    3: [
      { id: 1, title: 'Chinese Culture & Literature', source: 'Studocu', type: 'documents', rating: 4.6, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/chinese-culture/5982952' },
      { id: 2, title: 'Chinese History Overview', source: 'ResearchGate', type: 'research', citations: 156, url: 'https://www.researchgate.net/publication/298765432_Chinese_History_Overview' },
    ],
    4: [
      { id: 1, title: 'Business Chinese (HSK3)', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/business-chinese/5982953' },
      { id: 2, title: 'Chinese for Business', source: 'YouTube', type: 'videos', channel: 'Mandarin Corner', views: '890K', url: 'https://www.youtube.com/watch?v=QwR4x4m0EQc' },
    ],
    5: [
      { id: 1, title: 'Advanced Chinese (HSK4)', source: 'Studocu', type: 'documents', rating: 4.9, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/advanced-chinese/5982954' },
    ],
    7: [
      { id: 1, title: 'Translation Studies', source: 'Studocu', type: 'documents', rating: 4.7, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/translation-studies/5982955' },
    ],
    8: [
      { id: 1, title: 'Interpretation Skills', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/interpretation/5982956' },
    ],
    9: [
      { id: 1, title: 'Chinese Language Thesis', source: 'Studocu', type: 'documents', rating: 4.9, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/thesis-chinese/5982957' },
    ],
  },
  mk: {
    1: [
      { id: 1, title: 'Marketing Fundamentals', source: 'Studocu', type: 'documents', rating: 4.7, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/marketing-fundamentals/5982960' },
      { id: 2, title: 'Introduction to Marketing', source: 'YouTube', type: 'videos', channel: 'HubSpot Marketing', views: '2.1M', url: 'https://www.youtube.com/watch?v=O_7Fpq6lq0E' },
    ],
    2: [
      { id: 1, title: 'Consumer Behavior Analysis', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/consumer-behavior/5982961' },
      { id: 2, title: 'Psychology of Marketing', source: 'ResearchGate', type: 'research', citations: 234, url: 'https://www.researchgate.net/publication/312345678_Consumer_Psychology' },
    ],
    3: [
      { id: 1, title: 'Digital Marketing Strategy', source: 'Studocu', type: 'documents', rating: 4.9, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/digital-marketing/5982962' },
      { id: 2, title: 'Google Ads Full Course', source: 'YouTube', type: 'videos', channel: 'Surfside PPC', views: '1.5M', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg' },
    ],
    4: [
      { id: 1, title: 'Brand Management', source: 'Studocu', type: 'documents', rating: 4.6, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/brand-management/5982963' },
      { id: 2, title: 'Social Media Marketing', source: 'YouTube', type: 'videos', channel: 'Neil Patel', views: '3.4M', url: 'https://www.youtube.com/watch?v=Rx_dLfxjkA0' },
    ],
    5: [
      { id: 1, title: 'Marketing Research Methods', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/marketing-research/5982964' },
    ],
    7: [
      { id: 1, title: 'Integrated Marketing Communications', source: 'Studocu', type: 'documents', rating: 4.7, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/imc/5982965' },
    ],
    8: [
      { id: 1, title: 'Marketing Capstone Project', source: 'Studocu', type: 'documents', rating: 4.9, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/capstone-marketing/5982966' },
    ],
    9: [
      { id: 1, title: 'Marketing Graduation Thesis', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/course/truong-dai-hoc-fpt/thesis-marketing/5982967' },
    ],
  },
};

const internshipResources: CourseResource[] = [
  { id: 1, title: 'FPT Internship Guidelines 2024', source: 'FPT University', type: 'internship', url: 'https://daihoc.fpt.edu.vn/thuc-tap-doanh-nghiep/' },
  { id: 2, title: 'Internship Report Template', source: 'FPT Template', type: 'internship', url: 'https://daihoc.fpt.edu.vn/bieu-mau-sinh-vien/' },
  { id: 3, title: 'How to Write an Internship Report', source: 'YouTube', type: 'videos', channel: 'Career Guide', views: '450K', url: 'https://www.youtube.com/watch?v=eJyVvA8_VDE' },
  { id: 4, title: 'Interview Preparation Tips', source: 'YouTube', type: 'videos', channel: 'Indeed', views: '2.8M', url: 'https://www.youtube.com/watch?v=1mHjMNZZvFo' },
  { id: 5, title: 'Resume Writing for Students', source: 'Studocu', type: 'documents', rating: 4.8, url: 'https://www.studocu.com/vn/document/resume-guide-students/98765432' },
  { id: 6, title: 'Professional Skills Development', source: 'ResearchGate', type: 'research', citations: 189, url: 'https://www.researchgate.net/publication/Professional_Skills_Development' },
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
