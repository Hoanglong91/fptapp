import Navbar from '@/components/layout/Navbar';
import GPACalculator from '@/components/GPACalculator';
import Chatbot from '@/components/Chatbot';
import CommunityChat from '@/components/CommunityChat';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function GPAPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container py-8 sm:py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            {t.gpaPage.title} <span className="text-gradient">{t.gpaPage.titleHighlight}</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t.gpaPage.subtitle}
          </p>
        </motion.div>

        <GPACalculator />
      </main>

      <CommunityChat />
      <Chatbot />
    </div>
  );
}
