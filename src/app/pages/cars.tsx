import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { Plus, Edit, Trash2, Car as CarIcon, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useElection } from '../context/election-context';
import type { Car, Mandub } from '../context/election-context';
import { toast } from 'sonner';

interface CarFormProps {
  formData: Omit<Car, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Car, 'id'>>>;
  onSubmit: () => void;
  onCancel: () => void;
  submitText: string;
  mandubs: Mandub[];
  carMandubs: Mandub[];
}

function CarForm({ formData, setFormData, onSubmit, onCancel, submitText, mandubs, carMandubs }: CarFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="type">نوع السيارة</Label>
          <Input
            id="type"
            placeholder="أدخل نوع السيارة (مثال: تويوتا كامري)"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="plateNumber">رقم اللوحة</Label>
          <Input
            id="plateNumber"
            placeholder="أدخل رقم اللوحة"
            value={formData.plateNumber}
            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div>
          <Label htmlFor="owner">المالك</Label>
          <Select 
            value={formData.owner.toString()} 
            onValueChange={(value) => setFormData({ ...formData, owner: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المالك من المندوبين" />
            </SelectTrigger>
            <SelectContent>
              {mandubs.map((mandub) => (
                <SelectItem key={mandub.id} value={mandub.id.toString()}>
                  {mandub.name}
                </SelectItem>
              ))}
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
          <Label htmlFor="numberOfTours">عدد الجولات</Label>
          <Input
            id="numberOfTours"
            type="number"
            min="0"
            placeholder="أدخل عدد الجولات"
            value={formData.numberOfTours || ''}
            onChange={(e) => setFormData({ ...formData, numberOfTours: parseInt(e.target.value) || 0 })}
            autoComplete="off"
          />
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div>
              <Label htmlFor="isAvailable" className="cursor-pointer">حالة السيارة</Label>
              <p className="text-sm text-muted-foreground">
                {formData.isAvailable ? 'السيارة متاحة للعمل' : 'السيارة قيد العمل حالياً'}
              </p>
            </div>
            <Switch
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
            />
          </div>
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

export function Cars() {
  const { cars, addCar, updateCar, deleteCar, mandubs } = useElection();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  
  const [formData, setFormData] = useState<Omit<Car, 'id'>>({
    type: '',
    owner: 0,
    plateNumber: '',
    representative: '',
    isAvailable: true,
    block: '1',
    numberOfTours: 0,
  });

  // Filter mandubs to only show "مندوب جوال سيارة"
  const carMandubs = mandubs.filter(m => m.mandubType === 'مندوب جوال سيارة');

  const handleAdd = () => {
    if (formData.type && formData.owner && formData.plateNumber && formData.representative && formData.block) {
      addCar(formData);
      setFormData({
        type: '',
        owner: 0,
        plateNumber: '',
        representative: '',
        isAvailable: true,
        block: '1',
        numberOfTours: 0,
      });
      setIsAddDialogOpen(false);
      toast.success('تم إضافة السيارة بنجاح');
    } else {
      toast.error('الرجاء تعبئة جميع الحقول المطلوبة');
    }
  };

  const handleEdit = () => {
    if (editingCar && formData.type && formData.owner && formData.plateNumber && formData.representative && formData.block) {
      updateCar(editingCar.id, formData);
      setIsEditDialogOpen(false);
      setEditingCar(null);
      setFormData({
        type: '',
        owner: 0,
        plateNumber: '',
        representative: '',
        isAvailable: true,
        block: '1',
        numberOfTours: 0,
      });
      toast.success('تم تحديث بيانات السيارة بنجاح');
    } else {
      toast.error('الرجاء تعبئة جميع الحقول المطلوبة');
    }
  };

  const openEditDialog = (car: Car) => {
    setEditingCar(car);
    setFormData({
      type: car.type,
      owner: car.owner,
      plateNumber: car.plateNumber,
      representative: car.representative,
      isAvailable: car.isAvailable,
      block: car.block,
      numberOfTours: car.numberOfTours,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه السيارة؟')) {
      deleteCar(id);
      toast.success('تم حذف السيارة بنجاح');
    }
  };

  // Get mandub name by ID
  const getMandubName = (mandubId: number) => {
    const mandub = mandubs.find(m => m.id === mandubId);
    return mandub ? mandub.name : '-';
  };

  // Get statistics
  const getCarStats = () => {
    return {
      total: cars.length,
      available: cars.filter(c => c.isAvailable).length,
      inUse: cars.filter(c => !c.isAvailable).length,
      totalTours: cars.reduce((sum, c) => sum + c.numberOfTours, 0),
    };
  };

  const stats = getCarStats();

  // Handlers for incrementing/decrementing tours
  const handleIncrementTours = (car: Car) => {
    updateCar(car.id, { ...car, numberOfTours: car.numberOfTours + 1 });
    toast.success('تم زيادة عدد الجولات');
  };

  const handleDecrementTours = (car: Car) => {
    if (car.numberOfTours > 0) {
      updateCar(car.id, { ...car, numberOfTours: car.numberOfTours - 1 });
      toast.success('تم تخفيض عدد الجولات');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">إدارة السيارات</h1>
          <p className="text-muted-foreground">إضافة وتعديل وحذف السيارات</p>
        </div>

        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة سيارة
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إضافة سيارة جديدة</DialogTitle>
            <DialogDescription>أدخل بيانات السيارة الجديدة</DialogDescription>
          </DialogHeader>
          <CarForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAdd} 
            onCancel={() => setIsAddDialogOpen(false)} 
            submitText="إضافة" 
            mandubs={mandubs}
            carMandubs={carMandubs}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات السيارة</DialogTitle>
            <DialogDescription>قم بتعديل بيانات السيارة المحددة</DialogDescription>
          </DialogHeader>
          <CarForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEdit} 
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingCar(null);
            }} 
            submitText="تحديث" 
            mandubs={mandubs}
            carMandubs={carMandubs}
          />
        </DialogContent>
      </Dialog>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CarIcon className="w-4 h-4 text-blue-600" />
              إجمالي السيارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats.total.toLocaleString('ar')}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              سيارات متاحة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats.available.toLocaleString('ar')}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <X className="w-4 h-4 text-orange-600" />
              سيارات قيد العمل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats.inUse.toLocaleString('ar')}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CarIcon className="w-4 h-4 text-purple-600" />
              إجمالي الجولات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats.totalTours.toLocaleString('ar')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Cars List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CarIcon className="w-5 h-5" />
            قائمة السيارات ({cars.length.toLocaleString('ar')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">نوع السيارة</th>
                  <th className="text-right py-3 px-4">رقم اللوحة</th>
                  <th className="text-right py-3 px-4">المالك</th>
                  <th className="text-right py-3 px-4">المندوب</th>
                  <th className="text-right py-3 px-4">المنطقة</th>
                  <th className="text-right py-3 px-4">عدد الجولات</th>
                  <th className="text-right py-3 px-4">الحالة</th>
                  <th className="text-right py-3 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {cars.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      لا يوجد سيارات حالياً
                    </td>
                  </tr>
                ) : (
                  cars
                    .slice()
                    .sort((a, b) => {
                      const aRep = parseInt(a.representative) || 999;
                      const bRep = parseInt(b.representative) || 999;
                      return aRep - bRep;
                    })
                    .map((car) => (
                      <tr key={car.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">{car.type}</td>
                        <td className="py-3 px-4 font-mono" dir="ltr">{car.plateNumber}</td>
                        <td className="py-3 px-4">{getMandubName(car.owner)}</td>
                        <td className="py-3 px-4">{car.representative}</td>
                        <td className="py-3 px-4">
                          {car.block === '1' ? 'المنية' : car.block === '2' ? 'الضنية' : 'طرابلس'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleIncrementTours(car)}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <p className="mx-2">{car.numberOfTours.toLocaleString('ar')}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDecrementTours(car)}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant={car.isAvailable ? "default" : "secondary"}
                            className={car.isAvailable ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
                            onClick={() => updateCar(car.id, { ...car, isAvailable: !car.isAvailable })}
                          >
                            {car.isAvailable ? 'متاحة' : 'قيد العمل'}
                          </Button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(car)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(car.id)}
                            >
                              <Trash2 className="w-4 h-4" />
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
      </Card>
    </div>
  );
}