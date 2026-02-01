import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, GraduationCap, IdCard, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ProfileFormProps {
  profile: {
    display_name: string | null;
    phone: string | null;
    student_id: string | null;
    major: string | null;
  } | null;
  onUpdate: (updates: {
    display_name?: string;
    phone?: string;
    student_id?: string;
    major?: string;
  }) => Promise<{ error: Error | null }>;
}

const majors = [
  { value: 'se', label: 'Kỹ thuật phần mềm (SE)' },
  { value: 'mm', label: 'Thiết kế đa phương tiện (MM)' },
  { value: 'cn', label: 'Ngôn ngữ Trung Quốc (CN)' },
  { value: 'mk', label: 'Marketing (MK)' },
];

export default function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    phone: profile?.phone || '',
    student_id: profile?.student_id || '',
    major: profile?.major || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await onUpdate(formData);
    
    if (error) {
      toast.error('Không thể cập nhật thông tin. Vui lòng thử lại.');
    } else {
      toast.success('Đã cập nhật thông tin thành công!');
    }
    
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription className="text-sm">
            Cập nhật thông tin hồ sơ của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name" className="text-sm">Tên hiển thị</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Nhập tên của bạn"
                  icon={<User className="w-4 h-4" />}
                  className="h-10 sm:h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="0912 345 678"
                  icon={<Phone className="w-4 h-4" />}
                  className="h-10 sm:h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_id" className="text-sm">Mã số sinh viên</Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                  placeholder="SE171234"
                  icon={<IdCard className="w-4 h-4" />}
                  className="h-10 sm:h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="major" className="text-sm">Chuyên ngành</Label>
                <Select 
                  value={formData.major} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, major: value }))}
                >
                  <SelectTrigger className="h-10 sm:h-12">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="Chọn chuyên ngành" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map((major) => (
                      <SelectItem key={major.value} value={major.value}>
                        {major.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full sm:w-auto h-10 sm:h-11"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
