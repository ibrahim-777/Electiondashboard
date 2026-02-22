import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Edit, Trash2, Users, Building2, Check, X, Send, Eye, EyeOff } from 'lucide-react';
import { useElection } from '../context/election-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
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

export function MandubinTracking() {
  const { 
    mandubs, 
    updateMandub, 
    deleteMandub, 
    pollingBoxes, 
    centerAssignments, 
    assignMandubToRoom, 
    unassignMandubFromRoom 
  } = useElection();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMandub, setEditingMandub] = useState<Mandub | null>(null);
  const [showMandubsList, setShowMandubsList] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Mandub, 'id'>>({
    name: '',
    block: '1',
    district: '',
    recordNumber: 0,
    religion: '',
    phoneNumber: '',
    phoneCardType: 'alfa',
    mandubType: 'مندوب ثابت',
    representative: '',
  });

  // Filter states
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('all');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');
  const [selectedCenterFilter, setSelectedCenterFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const handleEdit = () => {
    if (editingMandub && formData.name && formData.block && formData.district && formData.recordNumber && formData.religion && formData.phoneNumber && formData.representative) {
      updateMandub(editingMandub.id, formData);
      setIsEditDialogOpen(false);
      setEditingMandub(null);
      setFormData({
        name: '',
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

  const handleSendPassword = (phoneNumber: string) => {
    toast.success(`تم إرسال كلمة المرور إلى ${phoneNumber}`);
  };

  // Get unique blocks, districts, and centers
  const blocks = Array.from(new Set(pollingBoxes.map(pb => pb.block)));
  const districtsForBlock = selectedBlockFilter !== 'all' 
    ? Array.from(new Set(pollingBoxes.filter(pb => pb.block.toString() === selectedBlockFilter).map(pb => pb.district)))
    : [];
  const centersForBlockAndDistrict = selectedBlockFilter !== 'all' && selectedDistrictFilter !== 'all'
    ? Array.from(new Set(pollingBoxes.filter(pb => 
        pb.block.toString() === selectedBlockFilter && pb.district === selectedDistrictFilter
      ).map(pb => pb.center)))
    : [];

  // Get center statistics
  const centerStats = {
    totalCenters: pollingBoxes.length,
    fullCenters: pollingBoxes.filter(box => centerAssignments.some(a => a.roomId === box.id)).length,
    emptyCenters: pollingBoxes.filter(box => !centerAssignments.some(a => a.roomId === box.id)).length,
  };

  // Filter polling boxes
  const filteredPollingBoxes = pollingBoxes.filter(box => {
    if (selectedBlockFilter !== 'all' && box.block.toString() !== selectedBlockFilter) return false;
    if (selectedDistrictFilter !== 'all' && box.district !== selectedDistrictFilter) return false;
    if (selectedCenterFilter !== 'all' && box.center !== selectedCenterFilter) return false;
    
    if (searchFilter) {
      const assignment = centerAssignments.find(a => a.roomId === box.id);
      const assignedMandub = assignment ? mandubs.find(m => m.id === assignment.mandubId) : null;
      if (!assignedMandub || !assignedMandub.name.includes(searchFilter)) return false;
    }
    return true;
  });

  const handleAssignMandub = (roomId: number, mandubId: number) => {
    assignMandubToRoom(roomId, mandubId);
    toast.success('تم تعيين المندوب إلى الغرفة بنجاح');
  };

  const handleUnassignMandub = (roomId: number) => {
    unassignMandubFromRoom(roomId);
    toast.success('تم إزالة المندوب من الغرفة');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">متابعة المندوبين</h1>
        <p className="text-muted-foreground">إدارة المراكز وتعيين المندوبين ومتابعتهم</p>
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

      {/* Center Management Section */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">إدارة المراكز</h2>
        
        {/* Center Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                إجمالي المراكز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{centerStats.totalCenters.toLocaleString('ar')}</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                مراكز مكتملة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{centerStats.fullCenters.toLocaleString('ar')}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <X className="w-4 h-4 text-orange-600" />
                مراكز فارغة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{centerStats.emptyCenters.toLocaleString('ar')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Centers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              تعيين المندوبين إلى المراكز والغرف
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div key="block-filter">
                <Label htmlFor="blockFilter">المنطقة</Label>
                <Select value={selectedBlockFilter} onValueChange={setSelectedBlockFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع المناطق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المناطق</SelectItem>
                    {blocks.map((block) => (
                      <SelectItem key={block} value={block.toString()}>
                        {block === 1 ? 'المنية' : block === 2 ? 'الضنية' : 'طرابلس'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBlockFilter !== 'all' && (
                <div key="district-filter">
                  <Label htmlFor="districtFilter">المحلة</Label>
                  <Select value={selectedDistrictFilter} onValueChange={setSelectedDistrictFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المحلات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المحلات</SelectItem>
                      {districtsForBlock.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedBlockFilter !== 'all' && selectedDistrictFilter !== 'all' && (
                <div key="center-filter">
                  <Label htmlFor="centerFilter">المركز</Label>
                  <Select value={selectedCenterFilter} onValueChange={setSelectedCenterFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المراكز" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المراكز</SelectItem>
                      {centersForBlockAndDistrict.map((center) => (
                        <SelectItem key={center} value={center}>
                          {center}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div key="search-filter">
                <Label htmlFor="searchFilter">بحث بالإسم</Label>
                <Input
                  id="searchFilter"
                  placeholder="ابحث عن مندوب..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">المنطقة</th>
                    <th className="text-right py-3 px-4">المركز</th>
                    <th className="text-right py-3 px-4">الغرفة</th>
                    <th className="text-right py-3 px-4">اسم المندوب</th>
                    <th className="text-right py-3 px-4">رقم الهاتف</th>
                    <th className="text-right py-3 px-4">كلمة المرور</th>
                    <th className="text-right py-3 px-4">اإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPollingBoxes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        لا توجد نتائج
                      </td>
                    </tr>
                  ) : (
                    filteredPollingBoxes.map((box) => {
                      const assignment = centerAssignments.find(a => a.roomId === box.id);
                      const assignedMandub = assignment ? mandubs.find(m => m.id === assignment.mandubId) : null;

                      return (
                        <tr key={box.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">{box.blockName}</td>
                          <td className="py-3 px-4">{box.center}</td>
                          <td className="py-3 px-4">{box.room}</td>
                          <td className="py-3 px-4">
                            {assignedMandub ? (
                              <span className="font-medium">{assignedMandub.name}</span>
                            ) : (
                              <span className="text-muted-foreground">غير معين</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono" dir="ltr">
                            {assignedMandub ? assignedMandub.phoneNumber : '-'}
                          </td>
                          <td className="py-3 px-4 font-mono" dir="ltr">
                            {assignedMandub ? '123456' : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {assignedMandub ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleUnassignMandub(box.id)}
                              >
                                <X className="w-4 h-4 ml-1" />
                                إزالة
                              </Button>
                            ) : (
                              <Select
                                onValueChange={(value) => handleAssignMandub(box.id, parseInt(value))}
                              >
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue placeholder="اختر مندوب" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mandubs
                                    .filter(m => m.block === box.block.toString())
                                    .map((mandub) => (
                                      <SelectItem key={mandub.id} value={mandub.id.toString()}>
                                        {mandub.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mandubs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              قائمة المندوبين ({mandubs.length.toLocaleString('ar')})
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMandubsList(!showMandubsList)}
            >
              {showMandubsList ? (
                <>
                  <EyeOff className="w-4 h-4 ml-2" />
                  إخفاء القائمة
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 ml-2" />
                  عرض القائمة
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {showMandubsList && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">الإسم</th>
                    <th className="text-right py-3 px-4">المنطقة</th>
                    <th className="text-right py-3 px-4">المحلة</th>
                    <th className="text-right py-3 px-4">اسم المعرف</th>
                    <th className="text-right py-3 px-4">رقم القيد</th>
                    <th className="text-right py-3 px-4">المذهب</th>
                    <th className="text-right py-3 px-4">رقم الهاتف</th>
                    <th className="text-right py-3 px-4">نوع الشريحة</th>
                    <th className="text-right py-3 px-4">نوع المندوب</th>
                    <th className="text-right py-3 px-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {mandubs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-8 text-muted-foreground">
                        لا يوجد مندوبين حالياً
                      </td>
                    </tr>
                  ) : (
                    mandubs
                      .slice()
                      .sort((a, b) => {
                        const aRep = parseInt(a.representative) || 999;
                        const bRep = parseInt(b.representative) || 999;
                        return aRep - bRep;
                      })
                      .map((mandub) => (
                        <tr key={mandub.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">{mandub.name}</td>
                          <td className="py-3 px-4">
                            {mandub.block === '1' ? 'المنية' : mandub.block === '2' ? 'الضنية' : 'طرابلس'}
                          </td>
                          <td className="py-3 px-4">{mandub.district}</td>
                          <td className="py-3 px-4">{mandub.representative}</td>
                          <td className="py-3 px-4">{mandub.recordNumber.toLocaleString('ar')}</td>
                          <td className="py-3 px-4">{mandub.religion}</td>
                          <td className="py-3 px-4 font-mono" dir="ltr">{mandub.phoneNumber}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              mandub.phoneCardType === 'alfa' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {mandub.phoneCardType === 'alfa' ? 'alfa' : 'mtc touch'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {mandub.mandubType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(mandub)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(mandub.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleSendPassword(mandub.phoneNumber)}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}