import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  BookOpen, 
  Plus, 
  Pencil, 
  Trash2, 
  Video, 
  FileText, 
  Search, 
  UploadCloud,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { courseData, majorNames, semesterData } from '@/data/courseData';
import { toast } from 'sonner';

interface Resource {
  id?: string;
  major: string;
  semester: number;
  type: 'documents' | 'research' | 'videos' | 'internship';
  title: string;
  url: string;
  source?: string;
  rating?: number;
  views?: string;
  channel?: string;
  citations?: number;
}

const CurriculumManagement = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredMajor, setFilteredMajor] = useState<string>('all');
  const [filteredSem, setFilteredSem] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<Partial<Resource>>({
    major: 'se',
    semester: 1,
    type: 'documents',
    title: '',
    url: '',
    source: ''
  });
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('curriculum_resources')
        .select('*')
        .order('major', { ascending: true })
        .order('semester', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      toast.error('Không thể tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentResource.title || !currentResource.url) {
      toast.error('Vui lòng điền đầy đủ tiêu đề và đường dẫn');
      return;
    }

    try {
      setLoading(true);
      if (currentResource.id) {
        const { error } = await (supabase as any)
          .from('curriculum_resources')
          .update(currentResource)
          .eq('id', currentResource.id);
        if (error) throw error;
        toast.success('Cập nhật tài liệu thành công');
      } else {
        const { error } = await (supabase as any)
          .from('curriculum_resources')
          .insert([currentResource]);
        if (error) throw error;
        toast.success('Thêm tài liệu mới thành công');
      }
      setIsDialogOpen(false);
      fetchResources();
    } catch (err) {
      console.error('Error saving resource:', err);
      toast.error('Lỗi khi lưu tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;

    try {
      setLoading(true);
      const { error } = await (supabase as any)
        .from('curriculum_resources')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Xóa tài liệu thành công');
      fetchResources();
    } catch (err) {
      console.error('Error deleting resource:', err);
      toast.error('Không thể xóa tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    if (!window.confirm('Bạn muốn nạp toàn bộ tài liệu mẫu vào Database?')) return;
    
    setIsSeeding(true);
    try {
      const allResources: any[] = [];
      Object.entries(courseData).forEach(([major, semesters]) => {
        Object.entries(semesters).forEach(([sem, courses]) => {
          courses.forEach((c: any) => {
            allResources.push({
              major,
              semester: parseInt(sem),
              type: c.type,
              title: c.title,
              url: c.url,
              source: c.source || '',
              rating: c.rating || 4.5,
              views: c.views || '',
              channel: c.channel || '',
              citations: c.citations || 0
            });
          });
        });
      });

      const { error } = await (supabase as any)
        .from('curriculum_resources')
        .insert(allResources);

      if (error) throw error;
      toast.success('Nạp dữ liệu mẫu thành công!');
      fetchResources();
    } catch (err) {
      console.error('Error seeding data:', err);
      toast.error('Lỗi khi nạp dữ liệu');
    } finally {
      setIsSeeding(false);
    }
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredResources.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredResources.map(r => r.id!));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} tài liệu đã chọn?`)) return;

    try {
      setLoading(true);
      const { error } = await (supabase as any)
        .from('curriculum_resources')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;
      toast.success(`Đã xóa ${selectedIds.length} tài liệu thành công`);
      setSelectedIds([]);
      fetchResources();
    } catch (err) {
      console.error('Bulk delete error:', err);
      toast.error('Không thể xóa hàng loạt');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(r => {
    const majorId = r.major.toLowerCase();
    const majorMatch = filteredMajor === 'all' || majorId === filteredMajor;
    const semMatch = filteredSem === 'all' || r.semester.toString() === filteredSem;
    return majorMatch && semMatch;
  });

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-xl overflow-hidden">
      <CardHeader className="border-b border-border/20 bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
        <div>
          <CardTitle className="text-2xl font-black italic flex items-center gap-2 text-primary">
            <BookOpen className="w-6 h-6" /> QUẢN LÝ HỌC THUẬT
          </CardTitle>
          <CardDescription>Cập nhật tài liệu, video và bài nghiên cứu cho các học kỳ</CardDescription>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleBulkDelete}
              className="rounded-xl font-bold shadow-lg shadow-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" /> XÓA {selectedIds.length} MỤC
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={seedData} 
            disabled={isSeeding}
            className="rounded-xl font-bold border-primary/20 hover:bg-primary/10 text-primary"
          >
            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
            Nạp mẫu
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setCurrentResource({ major: 'se', semester: 1, type: 'documents', title: '', url: '', source: '' });
                  setIsDialogOpen(true);
                }}
                className="rounded-xl font-black bg-primary shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4 mr-2" /> THÊM MỚI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-primary/20 bg-card">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black italic tracking-tighter">
                  {currentResource.id ? 'CẬP NHẬT TÀI LIỆU' : 'THÊM TÀI LIỆU MỚI'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground ml-1">Ngành học</Label>
                    <Select value={currentResource.major} onValueChange={(v) => setCurrentResource({...currentResource, major: v})}>
                      <SelectTrigger className="rounded-xl h-11 border-border/50">
                        <SelectValue placeholder="Ngành" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(majorNames).map(([id, name]) => (
                          <SelectItem key={id} value={id}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground ml-1">Học kỳ</Label>
                    <Select value={currentResource.semester?.toString()} onValueChange={(v) => setCurrentResource({...currentResource, semester: parseInt(v)})}>
                      <SelectTrigger className="rounded-xl h-11 border-border/50">
                        <SelectValue placeholder="Kỳ" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesterData.map((sem) => (
                          <SelectItem key={sem.id} value={sem.id.toString()}>{sem.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground ml-1">Loại tài liệu</Label>
                  <Select value={currentResource.type} onValueChange={(v: any) => setCurrentResource({...currentResource, type: v})}>
                    <SelectTrigger className="rounded-xl h-11 border-border/50">
                      <SelectValue placeholder="Loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documents">Tài liệu (PDF/Slides)</SelectItem>
                      <SelectItem value="videos">Video bài giảng</SelectItem>
                      <SelectItem value="research">Bài nghiên cứu</SelectItem>
                      <SelectItem value="internship">Thực tập (OJT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground ml-1">Tiêu đề tài liệu</Label>
                  <Input 
                    value={currentResource.title} 
                    onChange={(e) => setCurrentResource({...currentResource, title: e.target.value})}
                    placeholder="VD: CSI104 - Nhập môn Computing" 
                    className="rounded-xl h-11 border-border/50 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Đường dẫn (URL) hoặc Tải file</Label>
                    <div className="relative">
                      <input 
                        type="file" 
                        id="file-upload" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setLoading(true);
                          try {
                            const fileExt = file.name.split('.').pop();
                            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                            const filePath = `${currentResource.major}/${currentResource.semester}/${fileName}`;

                            const { error: uploadError } = await (supabase as any).storage
                              .from('curriculum')
                              .upload(filePath, file);

                            if (uploadError) throw uploadError;

                            const { data: { publicUrl } } = (supabase as any).storage
                              .from('curriculum')
                              .getPublicUrl(filePath);

                            setCurrentResource({ ...currentResource, url: publicUrl });
                            toast.success('Tải file lên thành công!');
                          } catch (err: any) {
                            console.error('Upload error:', err);
                            toast.error(`Lỗi tải file: ${err.message || 'Không xác định'}`);
                          } finally {
                            setLoading(false);
                          }
                        }}
                      />
                      <Label 
                        htmlFor="file-upload" 
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <UploadCloud className="w-3 h-3" /> Tải từ máy
                      </Label>
                    </div>
                  </div>
                  <Input 
                    value={currentResource.url} 
                    onChange={(e) => setCurrentResource({...currentResource, url: e.target.value})}
                    placeholder="https://..." 
                    className="rounded-xl h-11 border-border/50 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground ml-1">Nguồn (Source)</Label>
                  <Input 
                    value={currentResource.source} 
                    onChange={(e) => setCurrentResource({...currentResource, source: e.target.value})}
                    placeholder="VD: YouTube, Coursera, Harvard..." 
                    className="rounded-xl h-11 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold">Hủy</Button>
                <Button onClick={handleSave} className="rounded-xl font-black px-8">LƯU THAY ĐỔI</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-6 border-b border-border/10 bg-muted/10 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm tài liệu..." className="pl-10 h-11 rounded-xl border-border/50 bg-background/50" />
             </div>
          </div>
          <div className="flex gap-2">
            <Select value={filteredMajor} onValueChange={setFilteredMajor}>
              <SelectTrigger className="w-[180px] h-11 rounded-xl border-border/50">
                <SelectValue placeholder="Tất cả ngành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ngành</SelectItem>
                {Object.entries(majorNames).map(([id, name]) => (
                  <SelectItem key={id} value={id}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filteredSem} onValueChange={setFilteredSem}>
              <SelectTrigger className="w-[150px] h-11 rounded-xl border-border/50">
                <SelectValue placeholder="Tất cả kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kỳ</SelectItem>
                {semesterData.map((sem) => (
                  <SelectItem key={sem.id} value={sem.id.toString()}>{sem.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && !isSeeding ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="font-bold">Đang kết nối Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[40px]">
                    <input 
                      type="checkbox" 
                      className="rounded accent-primary"
                      checked={selectedIds.length === filteredResources.length && filteredResources.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[100px] text-[10px] font-black uppercase text-muted-foreground">Kỳ - Ngành</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground">Loại</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground">Tiêu đề & Nguồn</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id} className="group hover:bg-primary/5 transition-all">
                    <TableCell>
                      <input 
                        type="checkbox" 
                        className="rounded accent-primary"
                        checked={selectedIds.includes(resource.id!)}
                        onChange={() => toggleSelect(resource.id!)}
                      />
                    </TableCell>
                    <TableCell className="font-bold">
                       <div className="flex flex-col">
                         <span className="text-primary">Kỳ {resource.semester}</span>
                         <span className="text-[10px] uppercase opacity-50">{resource.major}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      {resource.type === 'videos' ? (
                        <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase">
                          <Video className="w-4 h-4" /> Video
                        </div>
                      ) : resource.type === 'research' ? (
                        <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase">
                          <BookOpen className="w-4 h-4" /> NC
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase">
                          <FileText className="w-4 h-4" /> Doc
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold group-hover:text-primary transition-colors">{resource.title}</span>
                        <span className="text-xs text-muted-foreground">{resource.source || 'Nguồn không xác định'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-lg hover:bg-primary/20 hover:text-primary"
                          onClick={() => {
                            setCurrentResource(resource);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-lg hover:bg-red-500/20 hover:text-red-500"
                          onClick={() => handleDelete(resource.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredResources.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-medium italic">
                      Chưa có tài liệu nào phù hợp với bộ lọc của sếp!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurriculumManagement;
