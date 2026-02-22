import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Search, Filter, Users, CheckCircle2, XCircle } from 'lucide-react';
import { useElection } from '../context/election-context';
import type { Voter } from '../context/election-context';

export function VoterTracking() {
  const { voters, updateVoterStatus, pollingBoxes, getVotingStatistics } = useElection();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');

  // Get unique values for filters
  const blocks = Array.from(
    new Map(pollingBoxes.map(box => [box.block, { id: box.block, name: box.blockName }])).values()
  ).sort((a, b) => a.id - b.id);
  
  const centers = selectedBlock !== 'all'
    ? Array.from(new Set(pollingBoxes.filter(box => box.block.toString() === selectedBlock).map(box => box.center)))
    : [];
  
  const rooms = selectedBlock !== 'all' && selectedCenter !== 'all'
    ? Array.from(new Set(pollingBoxes.filter(box => box.block.toString() === selectedBlock && box.center === selectedCenter).map(box => box.room)))
    : [];

  // Filter voters
  const filteredVoters = useMemo(() => {
    return voters.filter(voter => {
      // Search by voter number
      if (searchQuery && !voter.voterNumber.toString().includes(searchQuery)) {
        return false;
      }
      
      // Filter by block
      if (selectedBlock !== 'all' && voter.block !== selectedBlock) {
        return false;
      }
      
      // Filter by center
      if (selectedCenter !== 'all' && voter.center !== selectedCenter) {
        return false;
      }
      
      // Filter by room
      if (selectedRoom !== 'all' && voter.room !== selectedRoom) {
        return false;
      }
      
      return true;
    });
  }, [voters, searchQuery, selectedBlock, selectedCenter, selectedRoom]);

  const votingStats = getVotingStatistics();

  const handleToggleVoteStatus = (voterId: number, currentStatus: boolean) => {
    updateVoterStatus(voterId, !currentStatus);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">متابعة الإقتراع</h1>
        <p className="text-muted-foreground">متابعة حالة التصويت للناخبين وإحصائيات المشاركة</p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {votingStats.map((stat, idx) => (
            <Card key={stat.block} className={idx === 0 ? 'border-green-200 bg-green-50/50' : idx === 1 ? 'border-purple-200 bg-purple-50/50' : 'border-blue-200 bg-blue-50/50'}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{stat.blockName}</span>
                  <Badge variant="outline">الدائرة {stat.block}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl mb-1">{stat.totalVoters.toLocaleString('ar')}</div>
                    <p className="text-sm text-muted-foreground">إجمالي الناخبين</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-1 text-green-600">{stat.votedCount.toLocaleString('ar')}</div>
                    <p className="text-sm text-muted-foreground">انتخبوا</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">نسبة المشاركة</span>
                    <span className="text-xl font-bold" style={{ color: idx === 0 ? '#16a34a' : idx === 1 ? '#9333ea' : '#2563eb' }}>
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={stat.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              البحث والتصفية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search by Voter Number */}
              <div>
                <Label htmlFor="voterSearch">البحث عبر رقم الناخب</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="voterSearch"
                    placeholder="ابحث برقم الناخب"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* Block Filter */}
              <div>
                <Label htmlFor="blockFilter">المنطقة</Label>
                <Select value={selectedBlock} onValueChange={(value) => {
                  setSelectedBlock(value);
                  setSelectedCenter('all');
                  setSelectedRoom('all');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع المناطق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المناطق</SelectItem>
                    {blocks.map((block) => (
                      <SelectItem key={block.id} value={block.id.toString()}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Center Filter */}
              <div>
                <Label htmlFor="centerFilter">المركز</Label>
                <Select 
                  value={selectedCenter} 
                  onValueChange={(value) => {
                    setSelectedCenter(value);
                    setSelectedRoom('all');
                  }}
                  disabled={selectedBlock === 'all'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="جميع المراكز" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المراكز</SelectItem>
                    {centers.map((center) => (
                      <SelectItem key={center} value={center}>
                        {center}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Room Filter */}
              <div>
                <Label htmlFor="roomFilter">الغرفة</Label>
                <Select 
                  value={selectedRoom} 
                  onValueChange={setSelectedRoom}
                  disabled={selectedCenter === 'all'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الغرف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الغرف</SelectItem>
                    {rooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>عرض {filteredVoters.length.toLocaleString('ar')} ناخب من أصل {voters.length.toLocaleString('ar')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Voters Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الناخبين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">رقم الناخب</th>
                    <th className="text-right py-3 px-4">الإسم</th>
                    <th className="text-right py-3 px-4">إسم الأم</th>
                    <th className="text-right py-3 px-4">المذهب</th>
                    <th className="text-right py-3 px-4">المحلة</th>
                    <th className="text-right py-3 px-4">رقم القيد</th>
                    <th className="text-right py-3 px-4">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVoters.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        لا توجد نتائج مطابقة للبحث
                      </td>
                    </tr>
                  ) : (
                    filteredVoters.map((voter) => (
                      <tr 
                        key={voter.id} 
                        className={`border-b hover:bg-muted/50 transition-colors ${voter.elected ? 'bg-green-50' : ''}`}
                      >
                        <td className="py-3 px-4 font-medium">{voter.voterNumber}</td>
                        <td className="py-3 px-4">{voter.name}</td>
                        <td className="py-3 px-4">{voter.motherName}</td>
                        <td className="py-3 px-4">{voter.religion}</td>
                        <td className="py-3 px-4">{voter.district}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{voter.recordNumber}</td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant={voter.elected ? "default" : "outline"}
                            className={voter.elected ? "bg-green-600 hover:bg-green-700" : ""}
                            onClick={() => handleToggleVoteStatus(voter.id, voter.elected)}
                          >
                            {voter.elected ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 ml-2" />
                                انتخب
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 ml-2" />
                                لم ينتخب
                              </>
                            )}
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
    </div>
  );
}