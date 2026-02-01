import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2, TrendingUp, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface Subject {
  id: string;
  name: string;
  credits: number;
  score: number;
}

const gradePoints: Record<string, number> = {
  A: 4.0,
  'B+': 3.5,
  B: 3.0,
  'C+': 2.5,
  C: 2.0,
  'D+': 1.5,
  D: 1.0,
  F: 0,
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
    case 'A': return 'text-green-500 bg-green-100';
    case 'B+': case 'B': return 'text-blue-500 bg-blue-100';
    case 'C+': case 'C': return 'text-yellow-500 bg-yellow-100';
    case 'D+': case 'D': return 'text-orange-500 bg-orange-100';
    default: return 'text-red-500 bg-red-100';
  }
}

export default function GPACalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Programming Fundamentals', credits: 3, score: 8.5 },
    { id: '2', name: 'Mathematics', credits: 3, score: 7.0 },
    { id: '3', name: 'English', credits: 2, score: 8.0 },
  ]);
  const [isExpanded, setIsExpanded] = useState(true);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: Date.now().toString(), name: '', credits: 3, score: 0 }
    ]);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateGPA = () => {
    if (subjects.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      if (subject.credits > 0) {
        const grade = getGradeFromScore(subject.score);
        const points = gradePoints[grade];
        totalPoints += points * subject.credits;
        totalCredits += subject.credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const gpa = parseFloat(calculateGPA() as string);
  const gpaPercentage = (gpa / 4) * 100;

  const getGPAStatus = () => {
    if (gpa >= 3.6) return { text: 'Xuất sắc', color: 'text-green-500' };
    if (gpa >= 3.2) return { text: 'Giỏi', color: 'text-blue-500' };
    if (gpa >= 2.5) return { text: 'Khá', color: 'text-yellow-500' };
    if (gpa >= 2.0) return { text: 'Trung bình', color: 'text-orange-500' };
    return { text: 'Cần cải thiện', color: 'text-red-500' };
  };

  const status = getGPAStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 sm:mt-12 bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-6 flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Tính GPA</h2>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Theo dõi kết quả học tập</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{calculateGPA()}</p>
            <p className={`text-xs sm:text-sm font-medium ${status.color}`}>{status.text}</p>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* GPA Progress */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                <div className="flex-1 w-full">
                  <div className="flex justify-between mb-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground">Tiến độ GPA</span>
                    <span className="font-medium">{gpa} / 4.0</span>
                  </div>
                  <Progress value={gpaPercentage} className="h-2 sm:h-3" />
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-muted rounded-lg sm:rounded-xl">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                  <span className="text-sm sm:text-base font-medium">{subjects.reduce((acc, s) => acc + s.credits, 0)} tín chỉ</span>
                </div>
              </div>

              {/* Subjects List - Mobile Cards */}
              <div className="space-y-3 sm:hidden">
                <AnimatePresence>
                  {subjects.map((subject) => {
                    const grade = getGradeFromScore(subject.score);
                    return (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-muted/50 rounded-lg p-3 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <Input
                            value={subject.name}
                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                            placeholder="Tên môn học"
                            className="h-9 text-sm flex-1 mr-2"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSubject(subject.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground">Tín chỉ</label>
                            <Input
                              type="number"
                              min="1"
                              max="6"
                              value={subject.credits}
                              onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 0)}
                              className="h-9 text-sm text-center"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground">Điểm</label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={subject.score}
                              onChange={(e) => updateSubject(subject.id, 'score', parseFloat(e.target.value) || 0)}
                              className="h-9 text-sm text-center"
                            />
                          </div>
                          <div className="text-center">
                            <label className="text-xs text-muted-foreground">Xếp loại</label>
                            <div className="mt-1">
                              <span className={`px-2 py-1 rounded-md font-semibold text-xs ${getGradeColor(grade)}`}>
                                {grade}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Subjects List - Desktop Table */}
              <div className="hidden sm:block space-y-3">
                <div className="grid grid-cols-12 gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-muted-foreground px-2">
                  <div className="col-span-5">Môn học</div>
                  <div className="col-span-2 text-center">Tín chỉ</div>
                  <div className="col-span-2 text-center">Điểm</div>
                  <div className="col-span-2 text-center">Xếp loại</div>
                  <div className="col-span-1"></div>
                </div>

                <AnimatePresence>
                  {subjects.map((subject) => {
                    const grade = getGradeFromScore(subject.score);
                    return (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-12 gap-2 sm:gap-3 items-center"
                      >
                        <div className="col-span-5">
                          <Input
                            value={subject.name}
                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                            placeholder="Tên môn học"
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="1"
                            max="6"
                            value={subject.credits}
                            onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 0)}
                            className="h-9 sm:h-10 text-sm text-center"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={subject.score}
                            onChange={(e) => updateSubject(subject.id, 'score', parseFloat(e.target.value) || 0)}
                            className="h-9 sm:h-10 text-sm text-center"
                          />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm ${getGradeColor(grade)}`}>
                            {grade}
                          </span>
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSubject(subject.id)}
                            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Add Subject Button */}
              <Button
                variant="outline"
                onClick={addSubject}
                className="w-full border-dashed h-10 text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm môn học
              </Button>

              {/* Tips */}
              <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-primary/5 rounded-lg sm:rounded-xl">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <p className="font-medium text-foreground mb-0.5 sm:mb-1">Mẹo cải thiện GPA</p>
                  <p className="text-muted-foreground">
                    Tập trung vào các môn có nhiều tín chỉ vì chúng ảnh hưởng lớn đến GPA. 
                    Đạt GPA từ 3.2 trở lên để được xét học bổng.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
