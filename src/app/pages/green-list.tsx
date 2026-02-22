import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { ListChecks, Check } from 'lucide-react';
import { useElection } from '../context/election-context';
import { toast } from 'sonner';

export function GreenList() {
  const { voters, updateVoterStatusColor, pollingBoxes } = useElection();

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [recordNumberFilter, setRecordNumberFilter] = useState<string>('');
  const [sexFilter, setSexFilter] = useState<string>('all');
  const [nameFilter, setNameFilter] = useState<string>('');

  // Get unique districts
  const districts = useMemo(() => {
    return Array.from(new Set(pollingBoxes.map(pb => pb.district))).sort();
  }, [pollingBoxes]);

  // Filter voters
  const filteredVoters = useMemo(() => {
    return voters.filter(voter => {
      // District filter
      if (selectedDistrict !== 'all' && voter.district !== selectedDistrict) {
        return false;
      }

      // Record number filter
      if (recordNumberFilter && !voter.recordNumber.includes(recordNumberFilter)) {
        return false;
      }

      // Sex filter
      if (sexFilter !== 'all' && voter.sex !== sexFilter) {
        return false;
      }

      // Name filter
      if (nameFilter && !voter.name.toLowerCase().includes(nameFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [voters, selectedDistrict, recordNumberFilter, sexFilter, nameFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredVoters.length;
    const green = filteredVoters.filter(v => v.status === 'green').length;
    const none = filteredVoters.filter(v => !v.status || v.status === 'none').length;
    
    return { total, green, none };
  }, [filteredVoters]);

  const handleMarkAsGreen = (voterId: number) => {
    updateVoterStatusColor(voterId, 'green');
    toast.success('تم تحديث حالة الناخب إلى الأخضر');
  };

  const handleMarkAsNone = (voterId: number) => {
    updateVoterStatusColor(voterId, 'none');
    toast.success('تم إزالة الحالة من الناخب');
  };

  const handleResetFilters = () => {
    setSelectedDistrict('all');
    setRecordNumberFilter('');
    setSexFilter('all');
    setNameFilter('');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">القائمة الخضراء</h1>
        <p className="text-muted-foreground">تحديث حالة الناخبين إلى الأخضر</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-blue-600" />
              إجمالي الناخبين
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
              ناخبين أخضر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats.green.toLocaleString('ar')}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-gray-600" />
              ناخبين بدون حالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats.none.toLocaleString('ar')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>تصفية الناخبين</CardTitle>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              إعادة تعيين
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="districtFilter">المحلة</Label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المحلات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المحلات</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recordNumberFilter">رقم القيد</Label>
              <Input
                id="recordNumberFilter"
                type="number"
                placeholder="ابحث برقم القيد..."
                value={recordNumberFilter}
                onChange={(e) => setRecordNumberFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="sexFilter">الجنس</Label>
              <Select value={sexFilter} onValueChange={setSexFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الجميع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الجميع</SelectItem>
                  <SelectItem value="ذكر">ذكر</SelectItem>
                  <SelectItem value="أنثى">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nameFilter">الإسم</Label>
              <Input
                id="nameFilter"
                placeholder="ابحث بالإسم..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voters Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            قائمة الناخبين ({filteredVoters.length.toLocaleString('ar')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">الإسم</th>
                  <th className="text-right py-3 px-4">اسم الأب</th>
                  <th className="text-right py-3 px-4">اسم الأم</th>
                  <th className="text-right py-3 px-4">رقم القيد</th>
                  <th className="text-right py-3 px-4">الجنس</th>
                  <th className="text-right py-3 px-4">المحلة</th>
                  <th className="text-right py-3 px-4">المنطقة</th>
                  <th className="text-right py-3 px-4">الحالة</th>
                  <th className="text-right py-3 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-muted-foreground">
                      لا توجد نتائج
                    </td>
                  </tr>
                ) : (
                  filteredVoters.map((voter) => (
                    <tr key={voter.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{voter.name}</td>
                      <td className="py-3 px-4">{voter.fatherName}</td>
                      <td className="py-3 px-4">{voter.motherName}</td>
                      <td className="py-3 px-4">{voter.recordNumber}</td>
                      <td className="py-3 px-4">{voter.sex}</td>
                      <td className="py-3 px-4">{voter.district}</td>
                      <td className="py-3 px-4">
                        {voter.block === '1' ? 'المنية' : voter.block === '2' ? 'الضنية' : 'طرابلس'}
                      </td>
                      <td className="py-3 px-4">
                        {voter.status === 'green' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            أخضر
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            بدون حالة
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {voter.status === 'green' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-gray-600 hover:text-gray-700"
                            onClick={() => handleMarkAsNone(voter.id)}
                          >
                            إزالة
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleMarkAsGreen(voter.id)}
                          >
                            <Check className="w-4 h-4 ml-1" />
                            تحديد كأخضر
                          </Button>
                        )}
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