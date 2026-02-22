import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Trash2, Edit, Users, UserPlus } from 'lucide-react';
import { useElection } from '../context/election-context';
import { toast } from 'sonner';

export function ManageLists() {
  const { partyLists, addPartyList, deletePartyList, addCandidate, deleteCandidate } = useElection();
  
  // Form states for new list
  const [newListName, setNewListName] = useState('');
  const [newListShortName, setNewListShortName] = useState('');
  const [newListColor, setNewListColor] = useState('#2563eb');

  // Form states for new candidate
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateBlock, setNewCandidateBlock] = useState<'1' | '2' | '3'>('3');
  const [newCandidateReligion, setNewCandidateReligion] = useState('');

  const handleAddList = () => {
    if (!newListName || !newListShortName) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    addPartyList({
      name: newListName,
      shortName: newListShortName,
      color: newListColor,
      votes: 0,
      candidates: [],
    });

    // Reset form
    setNewListName('');
    setNewListShortName('');
    setNewListColor('#2563eb');
    
    toast.success('تم إضافة القائمة بنجاح');
  };

  const handleDeleteList = (id: number, name: string) => {
    if (confirm(`هل أنت متأكد من حذف القائمة "${name}"؟`)) {
      deletePartyList(id);
      toast.success('تم حذف القائمة');
    }
  };

  const handleAddCandidate = () => {
    if (!selectedListId || !newCandidateName || !newCandidateReligion) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    addCandidate(selectedListId, {
      name: newCandidateName,
      personalVotes: 0,
      block: parseInt(newCandidateBlock) as 1 | 2 | 3,
      religion: newCandidateReligion,
    });

    // Reset form
    setNewCandidateName('');
    setNewCandidateBlock('3');
    setNewCandidateReligion('');
    
    toast.success('تم إضافة المرشح بنجاح');
  };

  const handleDeleteCandidate = (listId: number, candidateId: number, candidateName: string) => {
    if (confirm(`هل أنت متأكد من حذف المرشح "${candidateName}"؟`)) {
      deleteCandidate(listId, candidateId);
      toast.success('تم حذف المرشح');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">إدارة القوائم والمرشحين</h1>
        <p className="text-muted-foreground">إضافة وتعديل القوائم الحزبية والمرشحين</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="lists" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="lists">
            <Users className="w-4 h-4 ml-2" />
            القوائم الحزبية
          </TabsTrigger>
          <TabsTrigger value="candidates">
            <UserPlus className="w-4 h-4 ml-2" />
            المرشحون
          </TabsTrigger>
        </TabsList>

        {/* Lists Tab */}
        <TabsContent value="lists" className="space-y-6">
          {/* Add New List Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                إضافة قائمة جديدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="listName">اسم القائمة</Label>
                  <Input
                    id="listName"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="مثال: التحالف التقدمي"
                  />
                </div>
                <div>
                  <Label htmlFor="listShortName">الاسم المختصر</Label>
                  <Input
                    id="listShortName"
                    value={newListShortName}
                    onChange={(e) => setNewListShortName(e.target.value)}
                    placeholder="مثال: ت.ت"
                  />
                </div>
                <div>
                  <Label htmlFor="listColor">اللون</Label>
                  <div className="flex gap-2">
                    <Input
                      id="listColor"
                      type="color"
                      value={newListColor}
                      onChange={(e) => setNewListColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={newListColor}
                      onChange={(e) => setNewListColor(e.target.value)}
                      placeholder="#2563eb"
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleAddList} className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                إضافة القائمة
              </Button>
            </CardContent>
          </Card>

          {/* Existing Lists */}
          <Card>
            <CardHeader>
              <CardTitle>القوائم الحالية ({partyLists.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partyLists.map((list) => (
                  <div key={list.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        className="w-10 h-10 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: list.color }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{list.name}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>الاسم المختصر: {list.shortName}</span>
                          <span>الأصوات: {list.votes.toLocaleString('ar')}</span>
                          <span>المرشحون: {list.candidates.length}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteList(list.id, list.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {partyLists.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد قوائم حزبية بعد. أضف القائمة الأولى!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-6">
          {/* Add New Candidate Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                إضافة مرشح جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="selectList">اختر القائمة</Label>
                  <Select 
                    value={selectedListId?.toString()} 
                    onValueChange={(value) => setSelectedListId(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر قائمة حزبية" />
                    </SelectTrigger>
                    <SelectContent>
                      {partyLists.map((list) => (
                        <SelectItem key={list.id} value={list.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: list.color }}
                            />
                            {list.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="candidateName">اسم المرشح</Label>
                  <Input
                    id="candidateName"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    placeholder="مثال: أحمد محمد"
                  />
                </div>

                <div>
                  <Label htmlFor="candidateBlock">الدائرة</Label>
                  <Select value={newCandidateBlock} onValueChange={(value: any) => setNewCandidateBlock(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">الدائرة 1 (1 مقعد)</SelectItem>
                      <SelectItem value="2">الدائرة 2 (2 مقعد)</SelectItem>
                      <SelectItem value="3">الدائرة 3 (8 مقاعد)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="candidateReligion">الديانة</Label>
                  <Select value={newCandidateReligion} onValueChange={setNewCandidateReligion}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الديانة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مسيحي">مسيحي</SelectItem>
                      <SelectItem value="مسلم">مسلم</SelectItem>
                      <SelectItem value="درزي">درزي</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={handleAddCandidate} 
                className="mt-4 gap-2"
                disabled={!selectedListId}
              >
                <Plus className="w-4 h-4" />
                إضافة المرشح
              </Button>
            </CardContent>
          </Card>

          {/* Existing Candidates by List */}
          {partyLists.map((list) => (
            <Card key={list.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: list.color }}
                  />
                  {list.name} - المرشحون ({list.candidates.length}/11)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {list.candidates.map((candidate) => (
                    <div key={candidate.id} className="border rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="mb-1">{candidate.name}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                          <span>الأصوات: {candidate.personalVotes.toLocaleString('ar')}</span>
                          <Badge variant="outline">الدائرة {candidate.block}</Badge>
                          <Badge variant="outline">{candidate.religion}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCandidate(list.id, candidate.id, candidate.name)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {list.candidates.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      لا يوجد مرشحون ف هذه القائمة بعد
                    </div>
                  )}
                  {list.candidates.length < 11 && (
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      تحتاج هذه القائمة إلى {11 - list.candidates.length} مرشح إضافي للوصول إلى 11 مرشحًا
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {partyLists.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                الرجاء إضافة قائمة حزبية أولاً قبل إضافة المرشحين
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}