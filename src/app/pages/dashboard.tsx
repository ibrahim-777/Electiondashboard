import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Vote, Calculator, Clock, Award, Eye, EyeOff } from 'lucide-react';
import { useElection } from '../context/election-context';
import type { PartyList as PartyListType } from '../context/election-context';

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

const NUMBER_OF_SEATS = 11;

function calculateSeatAllocation(lists: PartyListType[], totalVotes: number, unacceptedVotes: number, blankPapers: number, numberOfSeats: number) {
  const winningNumber1 = (totalVotes - unacceptedVotes) / numberOfSeats;
  const qualifiedLists = lists.filter(list => list.votes > winningNumber1);
  const totalQualifiedVotes = qualifiedLists.reduce((sum, list) => sum + list.votes, 0);
  const winningNumber2 = (totalQualifiedVotes + blankPapers) / numberOfSeats;
  
  const allocations = qualifiedLists.map(list => {
    const exactSeats = list.votes / winningNumber2;
    const initialSeats = Math.floor(exactSeats);
    const remainder = exactSeats - initialSeats;
    
    const rankedCandidates = [...list.candidates].sort((a, b) => b.personalVotes - a.personalVotes);
    rankedCandidates.forEach((candidate, index) => {
      candidate.rank = index + 1;
    });
    
    return {
      ...list,
      candidates: rankedCandidates,
      exactSeats,
      initialSeats,
      remainder,
      finalSeats: initialSeats,
    };
  });
  
  const allocatedSeats = allocations.reduce((sum, alloc) => sum + alloc.initialSeats, 0);
  const remainingSeats = numberOfSeats - allocatedSeats;
  const sortedByRemainder = [...allocations].sort((a, b) => b.remainder - a.remainder);
  
  for (let i = 0; i < remainingSeats; i++) {
    if (sortedByRemainder[i]) {
      sortedByRemainder[i].finalSeats += 1;
    }
  }
  
  sortedByRemainder.forEach(alloc => {
    alloc.candidates.forEach((candidate, index) => {
      candidate.wonSeat = index < alloc.finalSeats;
    });
  });
  
  return {
    winningNumber1,
    winningNumber2,
    qualifiedLists,
    allocations: sortedByRemainder,
  };
}

export function Dashboard() {
  const { partyLists, getBlockStatistics, boxVotes } = useElection();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedListFilter, setSelectedListFilter] = useState<string>('all');
  const [showCandidateRankings, setShowCandidateRankings] = useState(true);

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

  // Calculate real rejected and blank votes from boxVotes
  const totalRejectedVotes = boxVotes.reduce((sum, box) => sum + (box.rejectedVotes || 0), 0);
  const totalBlankVotes = boxVotes.reduce((sum, box) => sum + (box.blankVotes || 0), 0);
  const totalRoomVotes = boxVotes.reduce((sum, box) => sum + (box.totalVotes || 0), 0);

  const totalVotes = partyLists.reduce((sum, list) => sum + list.votes, 0);
  const unacceptedVotes = totalRejectedVotes || Math.floor(totalVotes * 0.015); // Use real data or fallback to 1.5%
  const blankPapers = totalBlankVotes || Math.floor(totalVotes * 0.035); // Use real data or fallback to 3.5%
  const validVotes = totalVotes - unacceptedVotes;

  const seatCalculation = calculateSeatAllocation(
    partyLists,
    totalVotes,
    unacceptedVotes,
    blankPapers,
    NUMBER_OF_SEATS
  );

  const chartData = seatCalculation.allocations.map(alloc => ({
    name: alloc.shortName,
    votes: alloc.votes,
    seats: alloc.finalSeats,
    percentage: ((alloc.votes / totalVotes) * 100).toFixed(1),
  })).sort((a, b) => b.votes - a.votes); // Sort by votes descending

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl mb-2">الانتخابات البرلمانية 2026</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
              <Clock className="w-4 h-4" />
              <span>آخر تحديث: {lastUpdate.toLocaleTimeString('ar')}</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Vote className="w-5 h-5 ml-2 inline" />
            {votesCounted.toFixed(1)}% تم الفرز
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">مجموع الأصوات</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{totalVotes.toLocaleString('ar')}</div>
              <p className="text-xs text-muted-foreground">أصوات القوائم</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">الأصوات الصحيحة</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{validVotes.toLocaleString('ar')}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">{unacceptedVotes.toLocaleString('ar')}</span> مرفوض
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">أوراق بيضاء</CardTitle>
              <Vote className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{blankPapers.toLocaleString('ar')}</div>
              <p className="text-xs text-muted-foreground">
                {((blankPapers / totalVotes) * 100).toFixed(2)}% من المجموع
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">المقاعد الإجمالية</CardTitle>
              <Award className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{NUMBER_OF_SEATS}</div>
              <p className="text-xs text-muted-foreground">
                {seatCalculation.qualifiedLists.length} قائمة مؤهلة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Winning Numbers */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              طريقة الحساب الانتخابي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg mb-2">الرقم الانتخابي الأول (العتبة)</h3>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-2">
                    (مجموع الأصوات - الأصوات المرفوضة) ÷ عدد المقاعد
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    ({totalVotes.toLocaleString('ar')} - {unacceptedVotes.toLocaleString('ar')}) ÷ {NUMBER_OF_SEATS}
                  </div>
                  <div className="text-2xl text-blue-600">
                    = {seatCalculation.winningNumber1.toLocaleString('ar', { maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    يجب على القوائم تجاوز هذا الرقم للتأهل
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg mb-2">الرقم الانتخابي الثاني (المقسوم)</h3>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-2">
                    (مجموع أصوات القوائم المؤهلة + الأوراق البيضاء) ÷ عدد المقاعد
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    ({seatCalculation.qualifiedLists.reduce((sum, l) => sum + l.votes, 0).toLocaleString('ar')} + {blankPapers.toLocaleString('ar')}) ÷ {NUMBER_OF_SEATS}
                  </div>
                  <div className="text-2xl text-green-600">
                    = {seatCalculation.winningNumber2.toLocaleString('ar', { maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    يتم قسمة أصوات كل قائمة على هذا الرقم
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LISTS AND CANDIDATES SECTION */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-2">نتائج القوائم والمرشحين</h2>
            <p className="text-purple-100">توزيع المقاعد والأصوات حسب القوائم الانتخابية والمرشحين</p>
          </div>

          {/* Seat Allocation Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>تفصيل توزيع المقاعد</CardTitle>
              <p className="text-sm text-muted-foreground">
                الحساب التفصيلي لكيفية توزيع المقاعد حسب النظام النسبي
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4">القائمة</th>
                      <th className="text-right py-3 px-4">الأصوات</th>
                      <th className="text-right py-3 px-4">المقاعد الدقيقة</th>
                      <th className="text-right py-3 px-4">المقاعد الأولية</th>
                      <th className="text-right py-3 px-4">الباقي</th>
                      <th className="text-right py-3 px-4">المقاعد النهائية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seatCalculation.allocations.map((alloc) => {
                      const gotExtraSeat = alloc.finalSeats > alloc.initialSeats;
                      return (
                        <tr key={alloc.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: alloc.color }}
                              />
                              <div>
                                <div>{alloc.name}</div>
                                <div className="text-xs text-muted-foreground">{alloc.shortName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">
                            {alloc.votes.toLocaleString('ar')}
                          </td>
                          <td className="text-right py-3 px-4">
                            <Badge variant="outline">
                              {alloc.exactSeats.toFixed(3)}
                            </Badge>
                          </td>
                          <td className="text-right py-3 px-4">
                            {alloc.initialSeats}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className={gotExtraSeat ? 'text-green-600 font-semibold' : ''}>
                              {alloc.remainder.toFixed(3)}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="text-xl" style={{ color: alloc.color }}>
                              {alloc.finalSeats}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Rankings */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>ترتيب المرشحين والفائزين بالمقاعد</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    يختار الناخبون قائمة حزبية ومرشحًا محددًا. يتم ترتيب المرشحين حسب أصواتهم الشخصية
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCandidateRankings(!showCandidateRankings)}
                  className="gap-2"
                >
                  {showCandidateRankings ? (
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
            {showCandidateRankings && (
              <CardContent>
                {(() => {
                  // Flatten all candidates from all lists with their list info
                  const allCandidatesWithList = seatCalculation.allocations.flatMap((alloc) =>
                    alloc.candidates.map((candidate) => ({
                      ...candidate,
                      listId: alloc.id,
                      listName: alloc.name,
                      listShortName: alloc.shortName,
                      listColor: alloc.color,
                    }))
                  );

                  // Filter candidates based on selected list
                  const filteredCandidates = selectedListFilter === 'all' 
                    ? allCandidatesWithList
                    : allCandidatesWithList.filter(c => c.listId.toString() === selectedListFilter);

                  // Sort: winners first (by wonSeat), then by personalVotes descending
                  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
                    if (a.wonSeat && !b.wonSeat) return -1;
                    if (!a.wonSeat && b.wonSeat) return 1;
                    return b.personalVotes - a.personalVotes;
                  });

                  return (
                    <>
                      {/* Filter Dropdown */}
                      <div className="mb-6">
                        <Label htmlFor="listFilter">تصفية حسب القائمة</Label>
                        <Select value={selectedListFilter} onValueChange={setSelectedListFilter}>
                          <SelectTrigger className="max-w-md">
                            <SelectValue placeholder="اختر قائمة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع القوائم</SelectItem>
                            {seatCalculation.allocations.map((alloc) => (
                              <SelectItem key={alloc.id} value={alloc.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: alloc.color }}
                                  />
                                  {alloc.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Summary Stats for Selected Filter */}
                      {selectedListFilter !== 'all' && (() => {
                        const selectedList = seatCalculation.allocations.find(a => a.id.toString() === selectedListFilter);
                        if (selectedList) {
                          return (
                            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-6 h-6 rounded-full" 
                                    style={{ backgroundColor: selectedList.color }}
                                  />
                                  <div>
                                    <h3 className="text-lg">{selectedList.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      مجموع أصوات القائمة: {selectedList.votes.toLocaleString('ar')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl" style={{ color: selectedList.color }}>
                                    {selectedList.finalSeats} مقاعد
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Candidates Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-right py-3 px-4">القائمة</th>
                              <th className="text-right py-3 px-4">اسم المرشح</th>
                              <th className="text-right py-3 px-4">الدائرة</th>
                              <th className="text-right py-3 px-4">الديانة</th>
                              <th className="text-right py-3 px-4">الأصوات الشخصية</th>
                              <th className="text-right py-3 px-4">الحالة</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedCandidates.map((candidate) => (
                              <tr 
                                key={`${candidate.listId}-${candidate.id}`}
                                className={candidate.wonSeat ? 'bg-green-50 font-semibold' : ''}
                              >
                                <td className="text-right py-3 px-4">
                                  <div className="flex items-center gap-2 justify-end">
                                    <span className="text-xs">{candidate.listShortName}</span>
                                    <div 
                                      className="w-3 h-3 rounded-full flex-shrink-0" 
                                      style={{ backgroundColor: candidate.listColor }}
                                    />
                                  </div>
                                </td>
                                <td className="text-right py-3 px-4">{candidate.name}</td>
                                <td className="text-right py-3 px-4">الدائرة {candidate.block}</td>
                                <td className="text-right py-3 px-4">{candidate.religion}</td>
                                <td className="text-right py-3 px-4">
                                  {candidate.personalVotes.toLocaleString('ar')}
                                </td>
                                <td className="text-right py-3 px-4">
                                  {candidate.wonSeat ? (
                                    <Badge className="bg-green-600">فائز</Badge>
                                  ) : (
                                    <Badge variant="outline">غير فائز</Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Total Count */}
                      <div className="mt-4 text-sm text-muted-foreground">
                        عرض {sortedCandidates.length} مرشح 
                        {sortedCandidates.filter(c => c.wonSeat).length > 0 && (
                          <span className="mr-2">
                            ({sortedCandidates.filter(c => c.wonSeat).length} فائز)
                          </span>
                        )}
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="votes" className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
            <TabsTrigger value="votes">توزيع الأصوات</TabsTrigger>
            <TabsTrigger value="seats">توزيع المقاعد</TabsTrigger>
          </TabsList>

          <TabsContent value="votes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الأصوات حسب القائمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => value.toLocaleString('ar')} />
                      <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => {
                          const list = partyLists.find(l => l.shortName === entry.name);
                          return <Cell key={`cell-${index}`} fill={list?.color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>نسب الأصوات</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="votes"
                      >
                        {chartData.map((entry, index) => {
                          const list = partyLists.find(l => l.shortName === entry.name);
                          return <Cell key={`cell-${index}`} fill={list?.color} />;
                        })}
                      </Pie>
                      <Tooltip formatter={(value: number) => value.toLocaleString('ar')} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seats">
            <Card>
              <CardHeader>
                <CardTitle>المقاعد المكتسبة حسب القائمة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="seats" name="المقاعد" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => {
                        const list = partyLists.find(l => l.shortName === entry.name);
                        return <Cell key={`cell-${index}`} fill={list?.color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}