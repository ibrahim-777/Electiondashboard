import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Clock, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { useElection } from '../context/election-context';

const blockData = [
  { 
    block: 'طرابلس', 
    blockNumber: 1,
    seats: 8, 
    seatDistribution: '5 سني، 1 علوي، 1 أرثوذكس، 1 ماروني',
    totalVotes: 934012, 
    unaccepted: 12345, 
    blank: 34567,
    totalBoxes: 450,
    openedBoxes: 387
  },
  { 
    block: 'الضنية', 
    blockNumber: 2,
    seats: 2, 
    seatDistribution: '2 سني',
    totalVotes: 456789, 
    unaccepted: 6234, 
    blank: 12345,
    totalBoxes: 210,
    openedBoxes: 189
  },
  { 
    block: 'المنية', 
    blockNumber: 3,
    seats: 1, 
    seatDistribution: '1 سني',
    totalVotes: 234567, 
    unaccepted: 3456, 
    blank: 8765,
    totalBoxes: 120,
    openedBoxes: 105
  },
];

export function CountingResults() {
  const { getBlockStatistics } = useElection();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showDetailsTable, setShowDetailsTable] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const blockStats = getBlockStatistics();
  const totalBoxes = blockStats.reduce((sum, b) => sum + b.totalBoxes, 0);
  const openedBoxes = blockStats.reduce((sum, b) => sum + b.openedBoxes, 0);
  const boxesWithVotes = blockStats.reduce((sum, b) => sum + b.boxesWithVotes, 0);
  const votesCounted = totalBoxes > 0 ? (boxesWithVotes / totalBoxes) * 100 : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl mb-2">نتائج الفرز</h1>
            <p className="text-muted-foreground">تفاصيل عن صناديق الاقتراع وحالة الفرز في كل دائرة</p>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
              <Clock className="w-4 h-4" />
              <span>آخر تحديث: {lastUpdate.toLocaleTimeString('ar')}</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <TrendingUp className="w-5 h-5 ml-2 inline" />
            {votesCounted.toFixed(1)}% تم الفرز
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* POLLING BOXES SECTION */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-2">إحصائيات صناديق الاقتراع</h2>
            <p className="text-green-100">تفاصيل عن صناديق الاقتراع وحالة الفرز في كل دائرة</p>
          </div>

          {/* Block Results */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>نسبة الفتح والفرز حسب الدائرة</CardTitle>
              <p className="text-sm text-muted-foreground">
                نسبة فتح الصناديق في كل دائرة انتخابية
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {blockStats.map((stat, idx) => {
                  const openPercentage = stat.totalBoxes > 0 ? (stat.openedBoxes / stat.totalBoxes) * 100 : 0;
                  const votesPercentage = stat.totalBoxes > 0 ? (stat.boxesWithVotes / stat.totalBoxes) * 100 : 0;
                  const closedBoxes = stat.totalBoxes - stat.openedBoxes;
                  const seats = stat.block === 3 ? 8 : stat.block === 2 ? 2 : 1;
                  const seatDistribution = stat.block === 3 ? '5 سني، 1 علوي، 1 أرثوذكس، 1 ماروني' : stat.block === 2 ? '2 سني' : '1 سني';
                  
                  return (
                    <div key={stat.block} className={`p-5 rounded-lg border-2 ${
                      idx === 0 ? 'bg-green-50 border-green-300' :
                      idx === 1 ? 'bg-purple-50 border-purple-300' :
                      'bg-blue-50 border-blue-300'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg">{stat.blockName}</h4>
                        <Badge className={
                          idx === 0 ? 'bg-green-600' :
                          idx === 1 ? 'bg-purple-600' :
                          'bg-blue-600'
                        }>
                          الدائرة {stat.block}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-3xl mb-1">{stat.openedBoxes.toLocaleString('ar')}</div>
                          <p className="text-sm text-muted-foreground">صندوق مفتوح</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">المجموع الكلي:</span>
                          <span className="font-semibold">{stat.totalBoxes.toLocaleString('ar')} صندوق</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">صناديق مغلقة:</span>
                          <span className="font-semibold text-red-600">{closedBoxes.toLocaleString('ar')}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">تم إدخال الأصوات:</span>
                          <span className="font-semibold text-green-600">{stat.boxesWithVotes.toLocaleString('ar')}</span>
                        </div>
                        
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">نسبة الفتح</span>
                            <span className="text-lg font-bold" style={{
                              color: idx === 0 ? '#16a34a' : idx === 1 ? '#9333ea' : '#2563eb'
                            }}>
                              {openPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={openPercentage} className="h-2" />
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">تقدم الفرز</span>
                            <span className="text-lg font-bold" style={{
                              color: idx === 0 ? '#16a34a' : idx === 1 ? '#9333ea' : '#2563eb'
                            }}>
                              {votesPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={votesPercentage} className="h-2" />
                        </div>
                        
                        <div className="text-xs text-muted-foreground border-t pt-2">
                          <div>{seats} {seats === 1 ? 'مقعد' : 'مقاعد'}</div>
                          <div className="mt-1">{seatDistribution}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Total Summary */}
              <div className="p-5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-300">
                <h4 className="text-lg mb-3">المجموع الإجمالي لجميع الدوائر</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl mb-1">
                      {totalBoxes.toLocaleString('ar')}
                    </div>
                    <p className="text-sm text-muted-foreground">مجموع الصناديق</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-1 text-green-600">
                      {openedBoxes.toLocaleString('ar')}
                    </div>
                    <p className="text-sm text-muted-foreground">صناديق مفتوحة</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-1 text-red-600">
                      {(totalBoxes - openedBoxes).toLocaleString('ar')}
                    </div>
                    <p className="text-sm text-muted-foreground">صناديق مغلقة</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-1 text-blue-600">
                      {votesCounted.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">نسبة الفرز الإجمالية</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>تفصيل الدوائر الانتخابية</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    الدولة مقسمة إلى 3 دوائر انتخابية بتوزيع مختلف للمقاعد حسب الطائفة
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailsTable(!showDetailsTable)}
                  className="gap-2"
                >
                  {showDetailsTable ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      إخفاء الجدول
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      إظهار الجدول
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {showDetailsTable && (
              <CardContent>
                <div className="space-y-4">
                  {blockData.map((block, idx) => (
                    <div key={idx} className={`p-5 rounded-lg border-2 ${
                      idx === 0 ? 'bg-blue-50 border-blue-200' :
                      idx === 1 ? 'bg-purple-50 border-purple-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl mb-1">{block.block}</h4>
                          <div className="text-3xl mb-2">{block.seats} {block.seats === 1 ? 'مقعد' : 'مقاعد'}</div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {block.seatDistribution}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-base px-3 py-1">
                          الدائرة {block.blockNumber}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
                        <div>
                          <div className="text-lg font-semibold">{block.totalVotes.toLocaleString('ar')}</div>
                          <p className="text-xs text-muted-foreground">مجموع الأصوات</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{block.unaccepted.toLocaleString('ar')}</div>
                          <p className="text-xs text-muted-foreground">أصوات مرفوضة</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{block.blank.toLocaleString('ar')}</div>
                          <p className="text-xs text-muted-foreground">أوراق بيضاء</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}