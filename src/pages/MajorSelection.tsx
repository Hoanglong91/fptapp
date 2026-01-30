import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code, Palette, Globe2, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';

const majors = [
  {
    id: 'se',
    name: 'Software Engineering',
    shortName: 'SE',
    icon: Code,
    color: 'from-blue-500 to-cyan-400',
    description: 'Build the future with code. Master programming, algorithms, and software development.',
    subjects: ['Programming', 'Databases', 'Web Development', 'Mobile Apps'],
  },
  {
    id: 'mm',
    name: 'Multimedia',
    shortName: 'MM',
    icon: Palette,
    color: 'from-purple-500 to-pink-400',
    description: 'Create stunning digital experiences. Learn design, animation, and multimedia production.',
    subjects: ['Graphic Design', 'Video Editing', '3D Modeling', 'UX/UI'],
  },
  {
    id: 'cn',
    name: 'Chinese Language',
    shortName: 'CN',
    icon: Globe2,
    color: 'from-red-500 to-orange-400',
    description: 'Connect with the world. Master Chinese language and culture for global opportunities.',
    subjects: ['Chinese Language', 'Business Chinese', 'Translation', 'Culture'],
  },
  {
    id: 'mk',
    name: 'Marketing',
    shortName: 'MK',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-400',
    description: 'Drive business growth. Learn digital marketing, branding, and consumer psychology.',
    subjects: ['Digital Marketing', 'Branding', 'Market Research', 'Analytics'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
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
      
      <main className="container py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Major</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your field of study to access specialized learning materials, 
            resources, and connect with students in your program.
          </p>
        </motion.div>

        {/* Major Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {majors.map((major) => (
            <motion.div
              key={major.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="relative bg-card rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-lifted transition-all duration-300">
                {/* Gradient Header */}
                <div className={`h-32 bg-gradient-to-r ${major.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      {major.shortName}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 -mt-8 relative">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${major.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <major.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-card-foreground mb-2">
                    {major.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {major.description}
                  </p>

                  {/* Subjects Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {major.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-lg text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="default"
                    className="w-full group-hover:shadow-md"
                    onClick={() => handleSelectMajor(major.id)}
                  >
                    Select Major
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Help Text */}
        <motion.p
          className="text-center text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Not sure which major to choose? Talk to our AI assistant for guidance.
        </motion.p>
      </main>
    </div>
  );
}
