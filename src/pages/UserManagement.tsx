import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, UserCog, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserProfile {
  user_id: string;
  display_name: string | null;
  student_id: string | null;
  role: string | null;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch profiles
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('user_id, display_name, student_id');
      
      if (pError) throw pError;

      // Fetch roles
      const { data: roles, error: rError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rError) throw rError;

      // Map profiles with their roles
      const mappedUsers = profiles.map(p => {
        const userRole = roles.find(r => r.user_id === p.user_id);
        return {
          ...p,
          role: userRole?.role || 'student'
        };
      });

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      if (userId === currentUser?.id) {
        toast.error('Bạn không thể tự đổi quyền của mình');
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole as any })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Cập nhật quyền thành công');
      // Update local state
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Cập nhật quyền thất bại');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive font-bold">Bạn không có quyền truy cập trang này</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin')} 
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <UserCog className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          </div>
          <p className="text-muted-foreground mt-1">Xem danh sách sinh viên và điều chỉnh phân quyền hệ thống.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px]">Sinh viên</TableHead>
                <TableHead>Mã số sinh viên</TableHead>
                <TableHead className="w-[200px]">Phân quyền</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Không tìm thấy người dùng nào.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((profile) => (
                  <TableRow key={profile.user_id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserRound className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">{profile.display_name || 'Họ tên chưa cập nhật'}</span>
                          <span className="text-xs text-muted-foreground">{profile.user_id.substring(0, 8)}...</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{profile.student_id || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <Select 
                        disabled={profile.user_id === currentUser?.id}
                        value={profile.role || 'student'} 
                        onValueChange={(val) => handleRoleChange(profile.user_id, val)}
                      >
                        <SelectTrigger className="w-[140px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${profile.user_id}`)} disabled>
                        Xem profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
