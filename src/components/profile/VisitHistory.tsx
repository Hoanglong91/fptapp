import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useVisitHistory } from '@/hooks/useVisitHistory';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function VisitHistory() {
  const { visits, loading } = useVisitHistory();

  const formatVisitDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Hôm nay';
    if (isYesterday(date)) return 'Hôm qua';
    return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
  };

  const formatTime = (dateStr: string) => {
    return format(parseISO(dateStr), 'HH:mm', { locale: vi });
  };

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Lịch sử truy cập
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Chưa có lịch sử truy cập
            </p>
          ) : (
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-2">
                {visits.map((visit, index) => (
                  <motion.div
                    key={visit.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">
                        {formatVisitDate(visit.visit_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">{formatTime(visit.created_at)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
