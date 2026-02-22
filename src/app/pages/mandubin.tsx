import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Plus, Edit, Trash2, Users, UserCheck, UserCog, Building2, UserCircle, Send, X, Check } from 'lucide-react';
import { useElection } from '../context/election-context';
import type { Mandub } from '../context/election-context';
import { toast } from 'sonner';

interface MandubFormProps {
  formData: Omit<Mandub, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Mandub, 'id'>>>;
  onSubmit: () => void;
  onCancel: () => void;
  submitText: string;
}

function MandubForm({ formData, setFormData, onSubmit, onCancel, submitText }: MandubFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">الإسم</Label>
          <Input
            id="name"
            placeholder="أدخل الإسم"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div>
          <Label htmlFor="sex">الجنس</Label>
          <Select value={formData.sex} onValueChange={(value: 'ذكر' | 'أنثى') => setFormData({ ...formData, sex: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ذكر">ذكر</SelectItem>
              <SelectItem value="أنثى">أنثى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="block">المنطقة</Label>
          <Select value={formData.block} onValueChange={(value) => setFormData({ ...formData, block: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">المنية</SelectItem>
              <SelectItem value="2">الضنية</SelectItem>
              <SelectItem value="3">طرابلس</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="district">المحلة</Label>
          <Select value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value })}>
            <SelectTrigger>
              <SelectValue placeholder="اختر المحلة" />
            </SelectTrigger>
            <SelectContent>
              {/* Block 1 - المنية */}
              <SelectItem value="المنية">المنية</SelectItem>
              
              {/* Block 2 - الضنية */}
              <SelectItem value="الضنية">الضنية</SelectItem>
              
              {/* Block 3 - طرابلس */}
              <SelectItem value="باب الرمل">باب الرمل</SelectItem>
              <SelectItem value="التل">التل</SelectItem>
              <SelectItem value="الميناء">الميناء</SelectItem>
              <SelectItem value="جبل محسن">جبل محسن</SelectItem>
              <SelectItem value="القبة">القبة</SelectItem>
              <SelectItem value="الزاهرية">الزاهرية</SelectItem>
              <SelectItem value="أبو سمرا">أبو سمرا</SelectItem>
              <SelectItem value="الحدادين">الحدادين</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="recordNumber">رقم القيد</Label>
          <Input
            id="recordNumber"
            type="number"
            placeholder="أدخل رقم القيد"
            value={formData.recordNumber || ''}
            onChange={(e) => setFormData({ ...formData, recordNumber: parseInt(e.target.value) || 0 })}
            autoComplete="off"
          />
        </div>

        <div>
          <Label htmlFor="religion">المذهب</Label>
          <Select value={formData.religion} onValueChange={(value) => setFormData({ ...formData, religion: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="سني">سني</SelectItem>
              <SelectItem value="شيعي">شيعي</SelectItem>
              <SelectItem value="علوي">علوي</SelectItem>
              <SelectItem value="ماروني">ماروني</SelectItem>
              <SelectItem value="روم أرثوذكس">روم أرثوذكس</SelectItem>
              <SelectItem value="روم كاثوليك">روم كاثوليك</SelectItem>
              <SelectItem value="درزي">درزي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="phoneNumber">رقم الهاتف</Label>
          <Input
            id="phoneNumber"
            placeholder="أدخل رقم الهاتف"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div>
          <Label htmlFor="phoneCardType">نوع الشريحة</Label>
          <Select value={formData.phoneCardType} onValueChange={(value: 'alfa' | 'touch') => setFormData({ ...formData, phoneCardType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alfa">alfa</SelectItem>
              <SelectItem value="touch">mtc touch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mandubType">نوع المندوب</Label>
          <Select 
            value={formData.mandubType} 
            onValueChange={(value: 'مندوب ثابت' | 'مندوب جوال' | 'مندوب جوال سيارة' | 'رئيس مركز' | 'رئيس نفوس') => setFormData({ ...formData, mandubType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="مندوب ثابت">مندوب ثابت</SelectItem>
              <SelectItem value="مندوب جوال">مندوب جوال</SelectItem>
              <SelectItem value="مندوب جوال سيارة">مندوب جوال سيارة</SelectItem>
              <SelectItem value="رئيس مركز">رئيس مركز</SelectItem>
              <SelectItem value="رئيس نفوس">رئيس نفوس</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="representative">اسم المعرف</Label>
          <Select 
            value={formData.representative} 
            onValueChange={(value) => setFormData({ ...formData, representative: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر رقم المعرف" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button onClick={onSubmit}>
          {submitText}
        </Button>
      </div>
    </div>
  );
}

export function Mandubin() {
  const { mandubs, addMandub, updateMandub, deleteMandub } = useElection();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMandub, setEditingMandub] = useState<Mandub | null>(null);
  
  const [formData, setFormData] = useState<Omit<Mandub, 'id'>>({
    name: '',
    sex: 'ذكر',
    block: '1',
    district: '',
    recordNumber: 0,
    religion: '',
    phoneNumber: '',
    phoneCardType: 'alfa',
    mandubType: 'مندوب ثابت',
    representative: '',
  });

  const handleAdd = () => {
    if (formData.name && formData.block && formData.district && formData.recordNumber && formData.religion && formData.phoneNumber && formData.representative) {
      addMandub(formData);
      setFormData({
        name: '',
        sex: 'ذكر',
        block: '1',
        district: '',
        recordNumber: 0,
        religion: '',
        phoneNumber: '',
        phoneCardType: 'alfa',
        mandubType: 'مندوب ثابت',
        representative: '',
      });
      setIsAddDialogOpen(false);
      toast.success('تم إضافة المندوب بنجاح');
    } else {
      toast.error('الرجاء تعبئة جميع الحقول المطلوبة');
    }
  };

  const handleEdit = () => {
    if (editingMandub && formData.name && formData.block && formData.district && formData.recordNumber && formData.religion && formData.phoneNumber && formData.representative) {
      updateMandub(editingMandub.id, formData);
      setIsEditDialogOpen(false);
      setEditingMandub(null);
      setFormData({
        name: '',
        sex: 'ذكر',
        block: '1',
        district: '',
        recordNumber: 0,
        religion: '',
        phoneNumber: '',
        phoneCardType: 'alfa',
        mandubType: 'مندوب ثابت',
        representative: '',
      });
      toast.success('تم تحديث بيانات المندوب بنجاح');
    } else {
      toast.error('الرجاء تعبئة جميع الحقول المطلوبة');
    }
  };

  const openEditDialog = (mandub: Mandub) => {
    setEditingMandub(mandub);
    setFormData({
      name: mandub.name,
      sex: mandub.sex,
      block: mandub.block,
      district: mandub.district,
      recordNumber: mandub.recordNumber,
      religion: mandub.religion,
      phoneNumber: mandub.phoneNumber,
      phoneCardType: mandub.phoneCardType,
      mandubType: mandub.mandubType,
      representative: mandub.representative,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المندوب؟')) {
      deleteMandub(id);
      toast.success('تم حذف المندوب بنجاح');
    }
  };

  const handleSendToSaraya = (mandub: Mandub) => {
    toast.success(`تم إرسال طلب المندوب ${mandub.name} إلى السرايا`);
  };

  // Calculate statistics for each mandub type
  const getMandubStats = () => {
    const stats = {
      'مندوب ثابت': mandubs.filter(m => m.mandubType === 'مندوب ثابت').length,
      'مندوب جوال': mandubs.filter(m => m.mandubType === 'مندوب جوال').length,
      'مندوب جوال سيارة': mandubs.filter(m => m.mandubType === 'مندوب جوال سيارة').length,
      'رئيس مركز': mandubs.filter(m => m.mandubType === 'رئيس مركز').length,
      'رئيس نفوس': mandubs.filter(m => m.mandubType === 'رئيس نفوس').length,
    };
    return stats;
  };

  const stats = getMandubStats();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">إدارة المندوبين</h1>
          <p className="text-muted-foreground">إضافة وتعديل وحذف المندوبين</p>
        </div>

        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة مندوب
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>إضافة مندوب جديد</DialogTitle>
          </DialogHeader>
          <MandubForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAdd} 
            onCancel={() => setIsAddDialogOpen(false)} 
            submitText="إضافة" 
          />
        </DialogContent>
      </Dialog>

      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              مندوب ثابت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats['مندوب ثابت'].toLocaleString('ar')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCog className="w-4 h-4 text-green-600" />
              مندوب جوال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats['مندوب جوال'].toLocaleString('ar')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-purple-600" />
              مندوب جوال سيارة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats['مندوب جوال سيارة'].toLocaleString('ar')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-600" />
              رئيس مركز
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats['رئيس مركز'].toLocaleString('ar')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-red-600" />
              رئيس نفوس
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats['رئيس نفوس'].toLocaleString('ar')}</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>تعديل المندوب</DialogTitle>
          </DialogHeader>
          <MandubForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEdit} 
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingMandub(null);
            }} 
            submitText="حفظ التعديلات" 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}