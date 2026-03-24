import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Settings, Database, ShieldCheck, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, role, isAdmin } = useAuth();
  const [totalUsers, setTotalUsers] = React.useState<number | string>('...');
  const [dbStatus, setDbStatus] = React.useState('Checking...');
  const [recentLogs, setRecentLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return;
      
      try {
        setLoading(true);
        // Fetch total users count
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        setTotalUsers(count || 0);
        setDbStatus('Healthy');

        // Fetch recent activities (visit logs)
        const { data: logs, error: lError } = await supabase
          .from('visit_logs')
          .select('*, profiles(display_name)')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!lError) {
          setRecentLogs(logs || []);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setTotalUsers('Error');
        setDbStatus('Error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  const stats = [
    { title: 'Tổng người dùng', value: totalUsers.toString(), icon: Users, color: 'text-blue-500' },
    { title: 'Trạng thái DB', value: dbStatus, icon: Database, color: 'text-green-500' },
    { title: 'Bảo mật hệ thống', value: 'Đang hoạt động', icon: ShieldCheck, color: 'text-purple-500' },
    { title: 'Cấu hình', value: 'Ổn định', icon: Settings, color: 'text-orange-500' },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
      <header className="mb-8 group">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground">
          Chào mừng trở lại, <span className="text-primary font-medium">{user?.email}</span>. 
          Quyền hạn của bạn: <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">{role}</span>
        </p>
      </header>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {loading && index === 0 ? (
                  <div className="h-8 w-12 bg-muted animate-pulse rounded" />
                ) : (
                  stat.value
                )}
              </div>
            </CardContent>
            <div className={`h-1 w-full bg-gradient-to-r from-transparent via-${stat.color.split('-')[1]}-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Quản lý người dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">Theo dõi thông tin sinh viên, điều chỉnh phân quyền và quản lý tài khoản hệ thống.</p>
            <button 
              className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
              onClick={() => navigate('/admin/users')}
            >
              Xem danh sách người dùng
            </button>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length > 0 ? (
              <div className="space-y-4">
                {recentLogs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b border-border/30 pb-2 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="font-medium">{log.profiles?.display_name || 'Người dùng mới'}</span>
                      <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-secondary/20 text-secondary-foreground font-medium">
                      Đã truy cập
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-sm text-muted-foreground">Chưa có hoạt động nào được ghi lại.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
