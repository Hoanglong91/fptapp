import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code, Palette, Globe2, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Chatbot from '@/components/Chatbot';
import CommunityChat from '@/components/CommunityChat';

const majors = [
  {
    id: 'se',
    name: 'Software Engineering',
    shortName: 'SE',
    icon: Code,
    color: 'from-blue-500 to-cyan-400',
    description: 'Build the future with code. Master programming, algorithms, and software development.',
    subjects: ['Programming', 'Databases', 'Web Dev', 'Mobile'],
  },
  {
    id: 'mm',
    name: 'Multimedia',
    shortName: 'MM',
    icon: Palette,
    color: 'from-purple-500 to-pink-400',
    description: 'Create stunning digital experiences. Learn design, animation, and multimedia production.',
    subjects: ['Design', 'Video', '3D', 'UX/UI'],
  },
  {
    id: 'cn',
    name: 'Chinese Language',
    shortName: 'CN',
    icon: Globe2,
    color: 'from-red-500 to-orange-400',
    description: 'Connect with the world. Master Chinese language and culture for global opportunities.',
    subjects: ['Language', 'Business', 'Translation', 'Culture'],
  },
  {
    id: 'mk',
    name: 'Marketing',
    shortName: 'MK',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-400',
    description: 'Drive business growth. Learn digital marketing, branding, and consumer psychology.',
    subjects: ['Digital', 'Branding', 'Research', 'Analytics'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
  }
};

export default function MajorSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelectMajor = (majorId: string) => {
    navigate(`/semesters/${majorId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6 sm:py-8 md:py-12 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Chọn <span className="text-gradient">Chuyên Ngành</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Chọn lĩnh vực học tập để truy cập tài liệu chuyên ngành và 
            kết nối với sinh viên cùng chương trình.
          </p>
        </motion.div>

        {/* Major Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {majors.map((major) => (
            <motion.div
              key={major.id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="relative bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-lifted transition-all duration-300">
                {/* Gradient Header */}
                <div className={`h-20 sm:h-24 md:h-32 bg-gradient-to-r ${major.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10" />
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium">
                      {major.shortName}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-card to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6 -mt-6 sm:-mt-8 relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${major.color} flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    <major.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground mb-1.5 sm:mb-2">
                    {major.name}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                    {major.description}
                  </p>

                  {/* Subjects Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {major.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-muted text-muted-foreground rounded-md sm:rounded-lg text-xs sm:text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="default"
                    className="w-full h-10 sm:h-11 text-sm sm:text-base group-hover:shadow-md"
                    onClick={() => handleSelectMajor(major.id)}
                  >
                    Chọn ngành
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Help Text */}
        <motion.p
          className="text-center text-muted-foreground text-sm sm:text-base mt-6 sm:mt-8 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Chưa biết chọn ngành nào? Hỏi trợ lý AI của chúng tôi để được tư vấn.
        </motion.p>
      </main>

      <CommunityChat />
      {/* General chat for all majors */}
      <Chatbot />
    </div>
  );
}
