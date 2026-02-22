import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Users, Search, FileText, Printer } from 'lucide-react';
import { useElection } from '../context/election-context';
import { toast } from 'sonner';

export function Voters() {
  const { voters } = useElection();
  
  // Search and filter states
  const [searchName, setSearchName] = useState('');
  const [filterFatherName, setFilterFatherName] = useState('');
  const [filterMotherName, setFilterMotherName] = useState('');
  const [filterRecordNumber, setFilterRecordNumber] = useState('');
  const [filterBirthday, setFilterBirthday] = useState('');
  const [filterSex, setFilterSex] = useState<'all' | 'ذكر' | 'أنثى'>('all');
  const [filterBlock, setFilterBlock] = useState<'all' | '1' | '2' | '3'>('all');
  const [filterDistrict, setFilterDistrict] = useState('');

  // Filter voters based on search and filters
  const filteredVoters = useMemo(() => {
    return voters.filter(voter => {
      // Name search (primary search field)
      if (searchName && !voter.name.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }

      // Father name filter
      if (filterFatherName && !voter.fatherName.toLowerCase().includes(filterFatherName.toLowerCase())) {
        return false;
      }

      // Mother name filter
      if (filterMotherName && !voter.motherName.toLowerCase().includes(filterMotherName.toLowerCase())) {
        return false;
      }

      // Record number filter
      if (filterRecordNumber && !voter.recordNumber.includes(filterRecordNumber)) {
        return false;
      }

      // Birthday filter
      if (filterBirthday && !voter.birthday.includes(filterBirthday)) {
        return false;
      }

      // Sex filter
      if (filterSex !== 'all' && voter.sex !== filterSex) {
        return false;
      }

      // Block filter
      if (filterBlock !== 'all' && voter.block !== filterBlock) {
        return false;
      }

      // District filter
      if (filterDistrict && !voter.district.toLowerCase().includes(filterDistrict.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [voters, searchName, filterFatherName, filterMotherName, filterRecordNumber, filterBirthday, filterSex, filterBlock, filterDistrict]);

  // Get statistics
  const getVoterStats = () => {
    return {
      total: voters.length,
      male: voters.filter(v => v.sex === 'ذكر').length,
      female: voters.filter(v => v.sex === 'أنثى').length,
      filtered: filteredVoters.length,
    };
  };

  const stats = getVoterStats();

  // Reset all filters
  const resetFilters = () => {
    setSearchName('');
    setFilterFatherName('');
    setFilterMotherName('');
    setFilterRecordNumber('');
    setFilterBirthday('');
    setFilterSex('all');
    setFilterBlock('all');
    setFilterDistrict('');
  };

  // Print voter certificate (placeholder for backend call)
  const handlePrintCertificate = (voterId: number) => {
    // This would normally call a backend API to generate a PDF certificate
    // For now, we'll show a toast notification
    const voter = voters.find(v => v.id === voterId);
    if (voter) {
      toast.success(`جاري طباعة شهادة الناخب: ${voter.name}`);
      
      // Placeholder for backend API call
      // Example:
      // fetch(`/api/voters/${voterId}/certificate`, { method: 'POST' })
      //   .then(response => response.blob())
      //   .then(blob => {
      //     const url = window.URL.createObjectURL(blob);
      //     window.open(url, '_blank');
      //   });
      
      console.log('Print certificate for voter:', voter);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl mb-2">بيانات الناخبين</h1>
            <p className="text-muted-foreground">البحث والاستعلام عن بيانات الناخبين</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
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
                <Users className="w-4 h-4 text-green-600" />
                ذكور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{stats.male.toLocaleString('ar')}</p>
            </CardContent>
          </Card>

          <Card className="border-pink-200 bg-pink-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-600" />
                إناث
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{stats.female.toLocaleString('ar')}</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-600" />
                نتائج البحث
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{stats.filtered.toLocaleString('ar')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {/* Primary search by name */}
            <div className="col-span-4">
              <Label htmlFor="searchName">البحث بالاسم</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchName"
                  placeholder="ابحث عن ناخب بالاسم..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pr-10"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Additional filters */}
            <div>
              <Label htmlFor="filterFatherName">اسم الأب</Label>
              <Input
                id="filterFatherName"
                placeholder="تصفية حسب اسم الأب"
                value={filterFatherName}
                onChange={(e) => setFilterFatherName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div>
              <Label htmlFor="filterMotherName">اسم الأم</Label>
              <Input
                id="filterMotherName"
                placeholder="تصفية حسب اسم الأم"
                value={filterMotherName}
                onChange={(e) => setFilterMotherName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div>
              <Label htmlFor="filterRecordNumber">رقم السجل</Label>
              <Input
                id="filterRecordNumber"
                placeholder="تصفية حسب رقم السجل"
                value={filterRecordNumber}
                onChange={(e) => setFilterRecordNumber(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div>
              <Label htmlFor="filterBirthday">تاريخ الميلاد</Label>
              <Input
                id="filterBirthday"
                type="date"
                value={filterBirthday}
                onChange={(e) => setFilterBirthday(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div>
              <Label htmlFor="filterSex">الجنس</Label>
              <Select value={filterSex} onValueChange={(value: 'all' | 'ذكر' | 'أنثى') => setFilterSex(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="ذكر">ذكر</SelectItem>
                  <SelectItem value="أنثى">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filterBlock">المنطقة</Label>
              <Select value={filterBlock} onValueChange={(value: 'all' | '1' | '2' | '3') => setFilterBlock(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="1">المنية</SelectItem>
                  <SelectItem value="2">الضنية</SelectItem>
                  <SelectItem value="3">طرابلس</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filterDistrict">المحلة</Label>
              <Input
                id="filterDistrict"
                placeholder="تصفية حسب المحلة"
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="col-span-4 flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                إعادة تعيين الفلاتر
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voters Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            قائمة الناخبين ({filteredVoters.length.toLocaleString('ar')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">الاسم</th>
                  <th className="text-right py-3 px-4">اسم الأب</th>
                  <th className="text-right py-3 px-4">اسم الأم</th>
                  <th className="text-right py-3 px-4">رقم السجل</th>
                  <th className="text-right py-3 px-4">تاريخ الميلاد</th>
                  <th className="text-right py-3 px-4">الجنس</th>
                  <th className="text-right py-3 px-4">المنطقة</th>
                  <th className="text-right py-3 px-4">المحلة</th>
                  <th className="text-right py-3 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-muted-foreground">
                      {voters.length === 0 
                        ? 'لا يوجد ناخبين في النظام' 
                        : 'لا توجد نتائج تطابق البحث'}
                    </td>
                  </tr>
                ) : (
                  filteredVoters.map((voter) => (
                    <tr key={voter.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{voter.name}</td>
                      <td className="py-3 px-4">{voter.fatherName}</td>
                      <td className="py-3 px-4">{voter.motherName}</td>
                      <td className="py-3 px-4">{voter.recordNumber}</td>
                      <td className="py-3 px-4">{new Date(voter.birthday).toLocaleDateString('ar-LB')}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          voter.sex === 'ذكر' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-pink-100 text-pink-700'
                        }`}>
                          {voter.sex}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {voter.block === '1' ? 'المنية' : voter.block === '2' ? 'الضنية' : 'طرابلس'}
                      </td>
                      <td className="py-3 px-4">{voter.district}</td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handlePrintCertificate(voter.id)}
                        >
                          <Printer className="w-4 h-4" />
                          طباعة
                        </Button>
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
