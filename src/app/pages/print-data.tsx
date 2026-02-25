import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Printer, FileText } from 'lucide-react';
import { useElection } from '../context/election-context';

type DataType = 'green-list' | 'mandubin' | 'voters' | 'cars';

export function PrintData() {
  const { voters, mandubs, cars, pollingBoxes, partyLists } = useElection();
  
  const [selectedDataType, setSelectedDataType] = useState<DataType>('green-list');
  
  // Filters for Green List
  const [greenListBlock, setGreenListBlock] = useState<string>('all');
  const [greenListReligion, setGreenListReligion] = useState<string>('all');
  
  // Filters for Mandubin
  const [mandubinBlock, setMandubinBlock] = useState<string>('all');
  const [mandubinDistrict, setMandubinDistrict] = useState<string>('all');
  const [mandubinType, setMandubinType] = useState<string>('all');
  
  // Filters for Voters
  const [votersBlock, setVotersBlock] = useState<string>('all');
  const [votersDistrict, setVotersDistrict] = useState<string>('all');
  const [votersStatus, setVotersStatus] = useState<string>('all');
  
  // Filters for Cars
  const [carsBlock, setCarsBlock] = useState<string>('all');
  const [carsDistrict, setCarsDistrict] = useState<string>('all');

  const handlePrint = () => {
    window.print();
  };

  // Filter Green List (voters with status 'green') with safe defaults
  const filteredGreenList = (voters || []).filter(voter => {
    // Only show voters with green status
    if (voter.status !== 'green') return false;
    if (greenListBlock !== 'all' && voter.block !== greenListBlock) return false;
    // Note: voters don't have religion field, skipping religion filter
    return true;
  });

  // Filter Mandubin with safe defaults
  const filteredMandubs = (mandubs || []).filter(mandub => {
    if (mandubinBlock !== 'all' && mandub.block !== mandubinBlock) return false;
    if (mandubinDistrict !== 'all' && mandub.district !== mandubinDistrict) return false;
    if (mandubinType !== 'all' && mandub.mandubType !== mandubinType) return false;
    return true;
  });

  // Filter Voters with safe defaults
  const filteredVoters = (voters || []).filter(voter => {
    if (votersBlock !== 'all' && voter.block !== votersBlock) return false;
    if (votersDistrict !== 'all' && voter.district !== votersDistrict) return false;
    if (votersStatus === 'voted' && !voter.elected) return false;
    if (votersStatus === 'not-voted' && voter.elected) return false;
    return true;
  });

  // Filter Cars with safe defaults
  const filteredCars = (cars || []).filter(car => {
    if (carsBlock !== 'all' && car.block !== carsBlock) return false;
    // Cars don't have district in the interface, we'll skip district filter
    return true;
  });

  // Get owner name from mandub ID
  const getOwnerName = (ownerId: number) => {
    const owner = mandubs?.find(m => m.id === ownerId);
    return owner ? owner.name : '-';
  };

  // Get unique districts based on selected block with safe defaults
  const getDistrictsForBlock = (block: string) => {
    if (block === 'all' || !pollingBoxes) return [];
    return Array.from(new Set(pollingBoxes.filter(pb => pb.block.toString() === block).map(pb => pb.district)));
  };

  return (
    <div className="p-8">
      {/* Non-printable section */}
      <div className="no-print mb-8">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">طباعة البيانات</h1>
          <p className="text-muted-foreground">اختر نوع البيانات والفلاتر المطلوبة ثم اضغط طباعة</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              إعدادات الطباع��
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Select Data Type */}
              <div>
                <Label htmlFor="dataType">نوع البيانات</Label>
                <Select value={selectedDataType} onValueChange={(value: DataType) => setSelectedDataType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green-list">القائمة الخضراء</SelectItem>
                    <SelectItem value="mandubin">المندوبين</SelectItem>
                    <SelectItem value="voters">الناخبين</SelectItem>
                    <SelectItem value="cars">السيارات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filters for Green List */}
              {selectedDataType === 'green-list' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>المنطقة</Label>
                    <Select value={greenListBlock} onValueChange={setGreenListBlock}>
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
                    <Label>المذهب</Label>
                    <Select value={greenListReligion} onValueChange={setGreenListReligion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
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
                </div>
              )}

              {/* Filters for Mandubin */}
              {selectedDataType === 'mandubin' && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>المنطقة</Label>
                    <Select value={mandubinBlock} onValueChange={(value) => {
                      setMandubinBlock(value);
                      setMandubinDistrict('all');
                    }}>
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
                  {mandubinBlock !== 'all' && (
                    <div>
                      <Label>المحلة</Label>
                      <Select value={mandubinDistrict} onValueChange={setMandubinDistrict}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">الكل</SelectItem>
                          {getDistrictsForBlock(mandubinBlock).map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label>نوع المندوب</Label>
                    <Select value={mandubinType} onValueChange={setMandubinType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="مندوب ثابت">مندوب ثابت</SelectItem>
                        <SelectItem value="مندوب جوال">مندوب جوال</SelectItem>
                        <SelectItem value="مندوب جوال سيارة">مندوب جوال سيارة</SelectItem>
                        <SelectItem value="رئيس مركز">رئيس مركز</SelectItem>
                        <SelectItem value="رئيس نفوس">رئيس نفوس</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Filters for Voters */}
              {selectedDataType === 'voters' && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>المنطقة</Label>
                    <Select value={votersBlock} onValueChange={(value) => {
                      setVotersBlock(value);
                      setVotersDistrict('all');
                    }}>
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
                  {votersBlock !== 'all' && (
                    <div>
                      <Label>المحلة</Label>
                      <Select value={votersDistrict} onValueChange={setVotersDistrict}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">الكل</SelectItem>
                          {getDistrictsForBlock(votersBlock).map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label>حالة التصويت</Label>
                    <Select value={votersStatus} onValueChange={setVotersStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="voted">صوّت</SelectItem>
                        <SelectItem value="not-voted">لم يصوّت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Filters for Cars */}
              {selectedDataType === 'cars' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>المنطقة</Label>
                    <Select value={carsBlock} onValueChange={(value) => {
                      setCarsBlock(value);
                      setCarsDistrict('all');
                    }}>
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
                  {carsBlock !== 'all' && (
                    <div>
                      <Label>المحلة</Label>
                      <Select value={carsDistrict} onValueChange={setCarsDistrict}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">الكل</SelectItem>
                          {getDistrictsForBlock(carsBlock).map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Print Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handlePrint} size="lg" className="gap-2">
                  <Printer className="w-5 h-5" />
                  طباعة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printable section */}
      <div className="print-only">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {selectedDataType === 'green-list' && 'القائمة الخضراء'}
            {selectedDataType === 'mandubin' && 'قائمة المندوبين'}
            {selectedDataType === 'voters' && 'قائمة الناخبين'}
            {selectedDataType === 'cars' && 'قائمة السيارات'}
          </h1>
          <p className="text-muted-foreground">
            تاريخ الطباعة: {new Date().toLocaleDateString('ar-LB', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        {/* Green List Table */}
        {selectedDataType === 'green-list' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 py-2 px-4 text-right">#</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">الإسم</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">إسم الأم</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">المنطقة</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">المحلة</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">رقم القيد</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">الجنس</th>
                </tr>
              </thead>
              <tbody>
                {filteredGreenList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="border border-gray-300 py-4 text-center text-muted-foreground">
                      لا توجد بيانات
                    </td>
                  </tr>
                ) : (
                  filteredGreenList.map((voter, index) => (
                    <tr key={voter.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 py-2 px-4">{(index + 1).toLocaleString('ar')}</td>
                      <td className="border border-gray-300 py-2 px-4">{voter.name}</td>
                      <td className="border border-gray-300 py-2 px-4">{voter.motherName}</td>
                      <td className="border border-gray-300 py-2 px-4">
                        {voter.block === '1' ? 'المنية' : voter.block === '2' ? 'الضنية' : 'طرابلس'}
                      </td>
                      <td className="border border-gray-300 py-2 px-4">{voter.district}</td>
                      <td className="border border-gray-300 py-2 px-4">{voter.recordNumber.toLocaleString('ar')}</td>
                      <td className="border border-gray-300 py-2 px-4">{voter.sex}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={6} className="border border-gray-300 py-2 px-4 text-right">الإجمالي</td>
                  <td className="border border-gray-300 py-2 px-4">{filteredGreenList.length.toLocaleString('ar')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Mandubin Table */}
        {selectedDataType === 'mandubin' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 py-2 px-4 text-right">#</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">الإسم</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">المحلة</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">رقم القيد</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">المذهب</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">رقم الهاتف</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">نوع الشريحة</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">اسم المعرف</th>
                </tr>
              </thead>
              <tbody>
                {filteredMandubs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border border-gray-300 py-4 text-center text-muted-foreground">
                      لا توجد بيانات
                    </td>
                  </tr>
                ) : (
                  filteredMandubs.map((mandub, index) => (
                    <tr key={mandub.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 py-2 px-4">{(index + 1).toLocaleString('ar')}</td>
                      <td className="border border-gray-300 py-2 px-4">{mandub.name}</td>
                      <td className="border border-gray-300 py-2 px-4">{mandub.district}</td>
                      <td className="border border-gray-300 py-2 px-4">{mandub.recordNumber.toLocaleString('ar')}</td>
                      <td className="border border-gray-300 py-2 px-4">{mandub.religion}</td>
                      <td className="border border-gray-300 py-2 px-4 font-mono" dir="ltr">{mandub.phoneNumber}</td>
                      <td className="border border-gray-300 py-2 px-4">{mandub.phoneCardType === 'alfa' ? 'alfa' : 'mtc touch'}</td>
                      <td className="border border-gray-300 py-2 px-4">{mandub.representative}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={7} className="border border-gray-300 py-2 px-4 text-right">الإجمالي</td>
                  <td className="border border-gray-300 py-2 px-4">{filteredMandubs.length.toLocaleString('ar')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Voters Table */}
        {selectedDataType === 'voters' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 py-2 px-4 text-right">#</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">الإسم</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">إسم الأم</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">المنطقة</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">المحلة</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">رقم القيد</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">الجنس</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">حالة التصويت</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border border-gray-300 py-4 text-center text-muted-foreground">
                      لا توجد بيانات
                    </td>
                  </tr>
                ) : (
                  filteredVoters.map((voter, index) => (
                    <tr key={voter.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 py-2 px-4">{(index + 1).toLocaleString('ar')}</td>
                      <td className="border border-gray-300 py-2 px-4">{voter.name}</td>
                      <td className="border border-gray-300 py-2 px-4">{voter.motherName}</td>
                      <td className="border border-gray-300 py-2 px-4">
                        {voter.block === '1' ? 'المنية' : voter.block === '2' ? 'الضنية' : 'طرابلس'}
                      </td>
                      <td className="border border-gray-300 py-2 px-4">{voter.district}</td>
                      <td className="border border-gray-300 py-2 px-4">{voter.recordNumber.toLocaleString('ar')}</td>
                      <td className="border border-gray-300 py-2 px-4">{voter.sex}</td>
                      <td className="border border-gray-300 py-2 px-4">
                        {voter.elected ? 'صوّت' : 'لم يصوّت'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={7} className="border border-gray-300 py-2 px-4 text-right">الإجمالي</td>
                  <td className="border border-gray-300 py-2 px-4">{filteredVoters.length.toLocaleString('ar')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Cars Table */}
        {selectedDataType === 'cars' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 py-2 px-4 text-right">#</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">نوع السيارة</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">اسم المالك</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">رقم اللوحة</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">المنطقة</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">اسم المعرف</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">عدد الجولات</th>
                  <th className="border border-gray-300 py-2 px-4 text-right">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border border-gray-300 py-4 text-center text-muted-foreground">
                      لا توجد بيانات
                    </td>
                  </tr>
                ) : (
                  filteredCars.map((car, index) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 py-2 px-4">{(index + 1).toLocaleString('ar')}</td>
                      <td className="border border-gray-300 py-2 px-4">{car.type}</td>
                      <td className="border border-gray-300 py-2 px-4">{getOwnerName(car.owner)}</td>
                      <td className="border border-gray-300 py-2 px-4 font-mono" dir="ltr">{car.plateNumber}</td>
                      <td className="border border-gray-300 py-2 px-4">
                        {car.block === '1' ? 'المنية' : car.block === '2' ? 'الضنية' : 'طرابلس'}
                      </td>
                      <td className="border border-gray-300 py-2 px-4">{car.representative}</td>
                      <td className="border border-gray-300 py-2 px-4">{car.numberOfTours.toLocaleString('ar')}</td>
                      <td className="border border-gray-300 py-2 px-4">
                        {car.isAvailable ? 'متاحة' : 'غير متاحة'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={7} className="border border-gray-300 py-2 px-4 text-right">الإجمالي</td>
                  <td className="border border-gray-300 py-2 px-4">{filteredCars.length.toLocaleString('ar')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          /* Hide sidebar and other layout elements */
          aside {
            display: none !important;
          }
          
          /* Page setup */
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          
          body {
            padding: 0;
            margin: 0;
            background: white !important;
          }
          
          /* Main content adjustments */
          main {
            width: 100% !important;
            max-width: 100% !important;
            background: white !important;
          }
          
          /* White background for all elements */
          * {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Table styling */
          table {
            page-break-inside: auto;
            width: 100%;
            background: white !important;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
            background: white !important;
          }
          
          td, th {
            background: white !important;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
          
          /* Ensure proper font sizes for printing */
          body {
            font-size: 10pt;
          }
          
          h1 {
            font-size: 18pt;
            color: black !important;
          }
          
          p {
            color: black !important;
          }
        }
        
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}