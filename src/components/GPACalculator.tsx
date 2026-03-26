import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2, TrendingUp, Award, ChevronDown, ChevronUp, History, Zap, Target, Sparkles, Rocket, GraduationCap, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Area,
  AreaChart,
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { courseData, majorNames, semesterData } from '@/data/courseData';

interface Subject {
  id: string;
  name: string;
  credits: number;
  score: number;
}

interface SemesterGPA {
  id: string;
  name: string;
  gpa: number;
}

const gradePoints: Record<string, number> = {
  A: 4.0, 'B+': 3.5, B: 3.0, 'C+': 2.5, C: 2.0, 'D+': 1.5, D: 1.0, F: 0,
};

function getGradeFromScore(score: number): string {
  if (score >= 9) return 'A';
  if (score >= 8) return 'B+';
  if (score >= 7) return 'B';
  if (score >= 6) return 'C+';
  if (score >= 5) return 'C';
  if (score >= 4) return 'D+';
  if (score >= 3) return 'D';
  return 'F';
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-green-400 bg-green-500/10 border-green-500/20';
    case 'B+': case 'B': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'C+': case 'C': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    case 'D+': case 'D': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    default: return 'text-red-400 bg-red-500/10 border-red-500/20';
  }
}

export default function GPACalculator() {
  const [selectedMajor, setSelectedMajor] = useState<string>('se');
  const [selectedSem, setSelectedSem] = useState<string>('1');

  // Persistence Logic: Load from LocalStorage
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('gpa_subjects');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Nhập môn Flexing', credits: 3, score: 9.0 },
      { id: '2', name: 'Kỹ năng Gánh Team', credits: 3, score: 8.5 },
    ];
  });

  const [semesterHistory, setSemesterHistory] = useState<SemesterGPA[]>(() => {
    const saved = localStorage.getItem('gpa_history');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 9 }, (_, i) => ({
      id: `s${i + 1}`,
      name: `Kỳ ${i + 1}`,
      gpa: 0
    }));
  });

  const [isExpanded, setIsExpanded] = useState(true);
  const [targetGPA, setTargetGPA] = useState(3.6);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('gpa_subjects', JSON.stringify(subjects));
    localStorage.setItem('gpa_history', JSON.stringify(semesterHistory));
  }, [subjects, semesterHistory]);

  const loadFromCurriculum = () => {
    const semIndex = parseInt(selectedSem);
    const majorCourses = courseData[selectedMajor]?.[semIndex];
    if (majorCourses) {
      const newSubjects: Subject[] = majorCourses.map(c => ({
        id: `c-${c.id}-${Date.now()}`,
        name: c.title.split(' – ')[0], // Extract code like CSI104
        credits: 3, // Standard FPT credits
        score: 0
      }));
      setSubjects(newSubjects);
    }
  };

  const calculateCurrentGPA = () => {
    if (subjects.length === 0) return 0;
    let totalPoints = 0, totalCredits = 0;
    subjects.forEach(s => {
      if (s.credits > 0) {
        totalPoints += gradePoints[getGradeFromScore(s.score)] * s.credits;
        totalCredits += s.credits;
      }
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const currentGPA = parseFloat(calculateCurrentGPA() as string);

  // Sync currentGPA to the selected semester in history automatically
  useEffect(() => {
    const semId = `s${selectedSem}`;
    const existingSem = semesterHistory.find(s => s.id === semId);
    if (existingSem && existingSem.gpa !== currentGPA) {
      setSemesterHistory(prev => prev.map(s => 
        s.id === semId ? { ...s, gpa: currentGPA } : s
      ));
    }
  }, [currentGPA, selectedSem]);

  const pastGpas = semesterHistory.filter(s => s.id !== `s${selectedSem}` && s.gpa > 0).map(s => s.gpa);
  const allGpas = [...pastGpas, currentGPA];
  const overallAvg = allGpas.length > 0 ? allGpas.reduce((a, b) => a + b, 0) / allGpas.length : 0;

  const addSubject = () => setSubjects([...subjects, { id: Date.now().toString(), name: '', credits: 3, score: 0 }]);
  const removeSubject = (id: string) => setSubjects(subjects.filter(s => s.id !== id));
  const updateSubject = (id: string, field: keyof Subject, value: any) => setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  const updateSemesterGPA = (id: string, value: number) => setSemesterHistory(semesterHistory.map(s => s.id === id ? { ...s, gpa: value } : s));

  const getMotivationalMessage = () => {
    if (currentGPA >= 3.6) return "Học bá thực thụ! Flexing thôi chờ gì nữa? 😎🏆";
    if (currentGPA >= 3.2) return "Đỉnh của chóp! Sắp đạt đỉnh cao rạng ngời rồi! 🔥";
    if (currentGPA >= 2.5) return "Ổn áp phết! Cố tí nữa là gánh team luôn sếp ơi! 💪";
    return "Ét ô ét! Tập trung cày rank thôi không là 'out trình' đó! 🆘";
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header: Flex Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-background to-secondary/20 border border-primary/20 shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles className="w-3 h-3" /> Gen Z Edition
             </div>
             <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-2">
               FLEX YOUR <span className="text-gradient">GPA</span>
             </h2>
             <p className="text-muted-foreground font-medium text-lg">{getMotivationalMessage()}</p>
          </div>

          <div className="flex gap-4">
            <div className="p-6 rounded-3xl bg-background/80 backdrop-blur-xl border border-border shadow-xl text-center min-w-[150px]">
               <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Học kỳ này</p>
               <p className="text-4xl font-black text-primary tabular-nums">{currentGPA}</p>
            </div>
            <div className="p-6 rounded-3xl bg-background/80 backdrop-blur-xl border border-border shadow-xl text-center min-w-[150px]">
               <p className="text-xs font-bold text-muted-foreground uppercase mb-1">GPA Toàn khóa</p>
               <p className="text-4xl font-black text-secondary tabular-nums">{overallAvg.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Curriculum Quick Select Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 backdrop-blur-md border border-border rounded-[2rem] p-6 sm:p-8 shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="flex-1 space-y-4 w-full">
             <h3 className="text-lg font-black flex items-center gap-2">
               <BookOpen className="text-primary w-5 h-5" /> CHỌN CHƯƠNG TRÌNH KHUNG
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Ngành học</label>
                  <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                    <SelectTrigger className="h-12 rounded-2xl bg-background border-border/50 font-bold">
                      <SelectValue placeholder="Chọn ngành" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(majorNames).map(([id, name]) => (
                        <SelectItem key={id} value={id}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Học kỳ</label>
                  <Select value={selectedSem} onValueChange={setSelectedSem}>
                    <SelectTrigger className="h-12 rounded-2xl bg-background border-border/50 font-bold">
                      <SelectValue placeholder="Chọn kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterData.map((sem) => (
                        <SelectItem key={sem.id} value={sem.id.toString()}>{sem.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
             </div>
           </div>
           <Button 
             onClick={loadFromCurriculum}
             className="w-full md:w-auto h-16 md:h-24 px-10 rounded-3xl bg-primary text-primary-foreground font-black text-xl flex flex-col gap-1 shadow-lg shadow-primary/20"
           >
              <Zap className="w-6 h-6 animate-pulse" />
              <span>NHẬP NHANH MÔN</span>
           </Button>
        </div>
      </motion.div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-[2rem] p-6 sm:p-8 relative">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black flex items-center gap-2">
               <TrendingUp className="text-primary w-5 h-5" /> HÀNH TRÌNH 9 HỌC KỲ
             </h3>
             <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
               <Rocket className="w-2.5 h-2.5 text-primary animate-bounce" /> Cất cánh
             </div>
           </div>

           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={[
                 ...semesterHistory.filter(s => s.gpa > 0), 
                 { name: 'Kỳ này', gpa: currentGPA }
               ]}>
                 <defs>
                   <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.05)" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10, fontWeight: 700 }} dy={10} />
                 <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12, fontWeight: 700 }} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#000', borderRadius: '20px', border: 'none', color: '#fff' }}
                   itemStyle={{ fontWeight: 800, color: 'hsl(var(--primary))' }}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="gpa" 
                   stroke="hsl(var(--primary))" 
                   strokeWidth={6} 
                   fill="url(#gpaGradient)"
                   dot={{ r: 5, fill: 'hsl(var(--primary))', stroke: '#fff', strokeWidth: 2 }}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Predictive Logic Card */}
        <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-[2rem] text-white flex flex-col justify-between shadow-2xl">
           <div>
             <div className="flex items-center gap-2 mb-4">
               <Target className="w-6 h-6" />
               <h3 className="text-xl font-black tracking-tighter uppercase">CHẠM ĐỈNH THỦ KHOA</h3>
             </div>
             <p className="text-white/80 text-sm font-medium mb-6">Mục tiêu {targetGPA >= 3.2 ? 'Học bổng' : 'An toàn'} đang ở rất gần! ✨</p>
             
             <div className="space-y-4">
               <div>
                 <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Sếp muốn GPA mấy?</label>
                 <Input 
                   type="number" 
                   step="0.1" 
                   value={targetGPA} 
                   onChange={(e) => setTargetGPA(parseFloat(e.target.value))}
                   className="bg-white/10 border-white/20 h-14 text-2xl font-black text-white rounded-2xl sm:min-w-0" 
                 />
               </div>
               
               <div className="p-4 rounded-2xl bg-black/20 backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase mb-1 opacity-70">Khoảng cách tới mục tiêu</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-black">{Math.abs(targetGPA - currentGPA).toFixed(2)}</p>
                    <p className="text-xs font-bold mb-1 opacity-70">{targetGPA > currentGPA ? 'Cần cày thêm' : 'Vượt KPI rồi!'}</p>
                  </div>
               </div>
             </div>
           </div>
           
           <Button className="w-full bg-white text-primary hover:bg-white/90 font-black h-12 rounded-2xl mt-6">
              <Zap className="w-4 h-4 mr-2" /> CHỐT ĐƠN HỌC BỔNG
           </Button>
        </div>
      </div>

      {/* Editor Section */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-border bg-muted/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/20 rounded-2xl">
                 <History className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Bảng Điều Khiển 9 Kỳ Học</h3>
                <p className="text-sm text-muted-foreground font-medium">Lập trình cuộc đời từ kỳ 1 đến kỳ 9</p>
              </div>
           </div>
           <Button 
             variant="outline" 
             className="rounded-2xl font-black text-xs h-9" 
             onClick={() => { localStorage.removeItem('gpa_history'); window.location.reload(); }}
           >
              LÀM MỚI 9 KỲ
           </Button>
        </div>

        <div className="p-8 space-y-10">
          {/* 9 Semesters Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {semesterHistory.map((sem) => (
              <div key={sem.id} className="p-3 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all text-center">
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">{sem.name}</label>
                <Input 
                  type="number" 
                  step="0.1"
                  value={sem.gpa === 0 ? '' : sem.gpa}
                  onChange={(e) => updateSemesterGPA(sem.id, parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                  className="bg-transparent border-none text-center text-lg font-black focus-visible:ring-0 p-0 h-auto"
                />
              </div>
            ))}
          </div>

          {/* Subject Edit */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Môn học kỳ này / Flexing list</h4>
            <div className="space-y-3">
              <AnimatePresence>
                {subjects.map((s) => (
                  <motion.div 
                    key={s.id} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-muted/20 border border-border/50 group"
                  >
                    <Input 
                      value={s.name} 
                      onChange={(e) => updateSubject(s.id, 'name', e.target.value)}
                      placeholder="Tên môn học (Nghệ thuật Flexing...)" 
                      className="flex-1 bg-background border-none rounded-2xl px-5 font-bold"
                    />
                    <div className="flex gap-3 items-center">
                       <div className="flex flex-col items-center">
                         <span className="text-[8px] font-black uppercase opacity-40 mb-1">Tín chỉ</span>
                         <Input 
                           type="number" 
                           value={s.credits} 
                           onChange={(e) => updateSubject(s.id, 'credits', parseInt(e.target.value) || 0)}
                           className="w-16 h-10 text-center font-black bg-background border-none rounded-xl"
                         />
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="text-[8px] font-black uppercase opacity-40 mb-1">Điểm</span>
                         <Input 
                           type="number" 
                           step="0.1"
                           value={s.score} 
                           onChange={(e) => updateSubject(s.id, 'score', parseFloat(e.target.value) || 0)}
                           className="w-16 h-10 text-center font-black bg-background border-none rounded-xl"
                         />
                       </div>
                       <div className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-xs border ${getGradeColor(getGradeFromScore(s.score))}`}>
                          {getGradeFromScore(s.score)}
                       </div>
                       <Button variant="ghost" size="icon" onClick={() => removeSubject(s.id)} className="text-muted-foreground hover:text-red-500 rounded-full">
                          <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <Button onClick={addSubject} className="w-full h-14 rounded-3xl border-2 border-dashed border-border bg-transparent text-muted-foreground hover:text-primary hover:border-primary font-black text-lg transition-all">
               <Plus className="w-6 h-6 mr-2" /> THÊM MÔN ĐỂ GÁNH TEAM
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
