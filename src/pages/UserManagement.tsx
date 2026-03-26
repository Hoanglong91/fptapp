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
import { 
  ArrowLeft, 
  Loader2, 
  UserCog, 
  UserRound, 
  Edit2, 
  Trash2, 
  Eye 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  
  // Edit State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editStudentId, setEditStudentId] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Delete State
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActionPending, setIsActionPending] = useState(false);

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
        .upsert({ 
          user_id: userId, 
          role: newRole as any,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('Cập nhật quyền thành công');
      // Update local state
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Cập nhật quyền thất bại');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      setIsActionPending(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: editDisplayName,
          student_id: editStudentId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', editingUser.user_id);

      if (error) throw error;

      toast.success('Cập nhật thông tin thành công');
      setUsers(prev => prev.map(u => 
        u.user_id === editingUser.user_id 
          ? { ...u, display_name: editDisplayName, student_id: editStudentId } 
          : u
      ));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Cập nhật thông tin thất bại');
    } finally {
      setIsActionPending(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    try {
      setIsActionPending(true);
      
      // Delete user roles first
      await supabase.from('user_roles').delete().eq('user_id', deletingUser.user_id);
      
      // Delete profile (cascades to streaks, logs)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', deletingUser.user_id);

      if (error) throw error;

      toast.success('Xóa người dùng thành công');
      setUsers(prev => prev.filter(u => u.user_id !== deletingUser.user_id));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Xóa người dùng thất bại');
    } finally {
      setIsActionPending(false);
    }
  };

  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setEditDisplayName(user.display_name || '');
    setEditStudentId(user.student_id || '');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: UserProfile) => {
    if (user.user_id === currentUser?.id) {
      toast.error('Bạn không thể tự xóa chính mình');
      return;
    }
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
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
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => openEditDialog(profile)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => openDeleteDialog(profile)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 gap-1"
                          onClick={() => navigate(`/profile/${profile.user_id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          Xem
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="display_name">Họ và tên</Label>
              <Input
                id="display_name"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                placeholder="Nhập tên hiển thị"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student_id">Mã số sinh viên</Label>
              <Input
                id="student_id"
                value={editStudentId}
                onChange={(e) => setEditStudentId(e.target.value)}
                placeholder="Ví dụ: SE123456"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isActionPending}>
              Hủy
            </Button>
            <Button onClick={handleUpdateUser} disabled={isActionPending}>
              {isActionPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Xác nhận xóa tài khoản
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài khoản **{deletingUser?.display_name || 'này'}**? 
              Hành động này sẽ xóa vĩnh viễn dữ liệu hồ sơ, điểm số và chuỗi học tập của sinh viên này khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              className="bg-destructive hover:bg-destructive/90 transition-colors"
              disabled={isActionPending}
            >
              {isActionPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
