import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Save, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const passwordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export default function PasswordForm() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = passwordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { newPassword?: string; confirmPassword?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as 'newPassword' | 'confirmPassword';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: formData.newPassword,
    });

    if (error) {
      toast.error('Không thể đổi mật khẩu. Vui lòng thử lại.');
    } else {
      toast.success('Đã đổi mật khẩu thành công!');
      setFormData({ newPassword: '', confirmPassword: '' });
    }

    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Đổi mật khẩu
          </CardTitle>
          <CardDescription className="text-sm">
            Cập nhật mật khẩu đăng nhập của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Nhập mật khẩu mới"
                  icon={<Lock className="w-4 h-4" />}
                  className={`h-10 sm:h-12 pr-10 ${errors.newPassword ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Nhập lại mật khẩu mới"
                  icon={<Lock className="w-4 h-4" />}
                  className={`h-10 sm:h-12 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button 
              type="submit" 
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-11"
              disabled={saving || !formData.newPassword || !formData.confirmPassword}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
