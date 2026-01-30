import Navbar from '@/components/layout/Navbar';
import GPACalculator from '@/components/GPACalculator';
import Chatbot from '@/components/Chatbot';
import { motion } from 'framer-motion';

export default function GPAPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            GPA <span className="text-gradient">Calculator</span>
          </h1>
          <p className="text-muted-foreground">
            Track your academic performance and plan for success
          </p>
        </motion.div>

        <GPACalculator />
      </main>

      <Chatbot />
    </div>
  );
}
