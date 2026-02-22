import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { UserPlus, Edit, Trash2, Shield, Key, User } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import type { UserAccount } from '../context/auth-context';
import { toast } from 'sonner';

export function Accounts() {
  const { accounts, addAccount, updateAccount, deleteAccount, availablePages, currentUser } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: '',
    permissions: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      role: '',
      permissions: [],
    });
  };

  const handleAddAccount = () => {
    if (!formData.username || !formData.password || !formData.name || !formData.role) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Check if username already exists
    if (accounts.find(acc => acc.username === formData.username)) {
      toast.error('اسم المستخدم موجود بالفعل');
      return;
    }

    addAccount(formData);
    toast.success('تم إضافة الحساب بنجاح');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditAccount = () => {
    if (!selectedAccount) return;

    if (!formData.username || !formData.name || !formData.role) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Check if username already exists (excluding current account)
    if (accounts.find(acc => acc.username === formData.username && acc.id !== selectedAccount.id)) {
      toast.error('اسم المستخدم موجود بالفعل');
      return;
    }

    const updateData: Partial<UserAccount> = {
      username: formData.username,
      name: formData.name,
      role: formData.role,
      permissions: formData.permissions,
    };

    // Only update password if it's provided
    if (formData.password) {
      updateData.password = formData.password;
    }

    updateAccount(selectedAccount.id, updateData);
    toast.success('تم تحديث الحساب بنجاح');
    setIsEditDialogOpen(false);
    setSelectedAccount(null);
    resetForm();
  };

  const handleDeleteAccount = (id: string, username: string) => {
    if (id === '1') {
      toast.error('لا يمكن حذف حساب المسؤول الرئيسي');
      return;
    }

    if (id === currentUser?.id) {
      toast.error('لا يمكنك حذف حسابك الحالي');
      return;
    }

    if (confirm(`هل أنت متأكد من حذف حساب "${username}"؟`)) {
      deleteAccount(id);
      toast.success('تم حذف الحساب بنجاح');
    }
  };

  const openEditDialog = (account: UserAccount) => {
    setSelectedAccount(account);
    setFormData({
      username: account.username,
      password: '', // Don't pre-fill password
      name: account.name,
      role: account.role,
      permissions: account.permissions,
    });
    setIsEditDialogOpen(true);
  };

  const togglePermission = (pageId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(pageId)
        ? prev.permissions.filter(p => p !== pageId)
        : [...prev.permissions, pageId],
    }));
  };

  const selectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: availablePages.map(p => p.id),
    }));
  };

  const deselectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: [],
    }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl mb-2">إدارة الحسابات</h1>
            <p className="text-muted-foreground">
              إدارة حسابات المستخدمين وصلاحيات الوصول للصفحات
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <UserPlus className="w-5 h-5 ml-2" />
                إضافة حساب جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة حساب جديد</DialogTitle>
                <DialogDescription>
                  قم بإنشاء حساب مستخدم جديد وتحديد صلاحيات الوصول
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-username">اسم المستخدم *</Label>
                    <Input
                      id="add-username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="اسم المستخدم للدخول"
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-password">كلمة المرور *</Label>
                    <Input
                      id="add-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="كلمة المرور"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-name">الاسم الكامل *</Label>
                    <Input
                      id="add-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="اسم المستخدم الكامل"
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-role">الدور الوظيفي *</Label>
                    <Input
                      id="add-role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="مثال: مشرف، مدخل بيانات"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>صلاحيات الوصول للصفحات</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllPermissions}
                      >
                        تحديد الكل
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={deselectAllPermissions}
                      >
                        إلغاء الكل
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                    {availablePages.map((page) => (
                      <div key={page.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`add-perm-${page.id}`}
                          checked={formData.permissions.includes(page.id)}
                          onCheckedChange={() => togglePermission(page.id)}
                        />
                        <Label htmlFor={`add-perm-${page.id}`} className="cursor-pointer flex-1">
                          {page.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddAccount}>
                  إضافة الحساب
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Accounts List */}
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>قائمة الحسابات</CardTitle>
            <p className="text-sm text-muted-foreground">
              مجموع الحسابات: {accounts.length}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{account.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Key className="w-3 h-3" />
                            <span>{account.username}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="gap-1">
                          <Shield className="w-3 h-3" />
                          {account.role}
                        </Badge>
                        {account.id === currentUser?.id && (
                          <Badge className="bg-green-600">الحساب الحالي</Badge>
                        )}
                        {account.id === '1' && (
                          <Badge className="bg-amber-600">مسؤول رئيسي</Badge>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          الصلاحيات ({account.permissions.length} من {availablePages.length}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {availablePages.map((page) => (
                            <Badge
                              key={page.id}
                              variant={account.permissions.includes(page.id) ? 'default' : 'outline'}
                              className={account.permissions.includes(page.id) ? 'bg-green-600' : 'opacity-30'}
                            >
                              {page.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3">
                        تاريخ الإنشاء: {new Date(account.createdAt).toLocaleDateString('ar')}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(account)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {account.id !== '1' && account.id !== currentUser?.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAccount(account.id, account.name)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل حساب المستخدم</DialogTitle>
            <DialogDescription>
              تحديث معلومات الحساب وصلاحيات الوصول
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-username">اسم المستخدم *</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="اسم المستخدم للدخول"
                />
              </div>
              <div>
                <Label htmlFor="edit-password">كلمة المرور الجديدة</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="اتركه فارغاً لعدم التغيير"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">الاسم الكامل *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="اسم المستخدم الكامل"
                />
              </div>
              <div>
                <Label htmlFor="edit-role">الدور الوظيفي *</Label>
                <Input
                  id="edit-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="مثال: مشرف، مدخل بيانات"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>صلاحيات الوصول للصفحات</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllPermissions}
                  >
                    تحديد الكل
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={deselectAllPermissions}
                  >
                    إلغاء الكل
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                {availablePages.map((page) => (
                  <div key={page.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-perm-${page.id}`}
                      checked={formData.permissions.includes(page.id)}
                      onCheckedChange={() => togglePermission(page.id)}
                    />
                    <Label htmlFor={`edit-perm-${page.id}`} className="cursor-pointer flex-1">
                      {page.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditAccount}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
