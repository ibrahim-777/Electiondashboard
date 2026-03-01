import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trophy, Medal, Award, TrendingUp, Calculator, AlertCircle } from 'lucide-react';
import { useElection } from '../context/election-context';
import { Alert, AlertDescription } from './ui/alert';

// تعريف توزيع المقاعد
const SEAT_DISTRIBUTION = {
  1: { // طرابلس
    total: 8,
    seats: {
      'سني': 5,
      'علوي': 1,
      'ماروني': 1,
      'روم أورثوذكس': 1,
    }
  },
  2: { // الضنية
    total: 2,
    seats: {
      'سني': 2,
    }
  },
  3: { // المنية
    total: 1,
    seats: {
      'سني': 1,
    }
  }
};

const BLOCK_NAMES = {
  1: 'طرابلس',
  2: 'الضنية',
  3: 'المنية',
};

interface WinningCandidate {
  candidateId: number;
  candidateName: string;
  listId: number;
  listName: string;
  listColor: string;
  votes: number;
  block: 1 | 2 | 3;
  blockName: string;
  religion: string;
  rank: number;
  reason: string;
}

interface ListWithSeats {
  listId: number;
  listName: string;
  listColor: string;
  totalVotes: number;
  seatsWon: number;
  passedFirstQuotient: boolean;
}

export function AdvancedResultsTab() {
  const { partyLists, boxVotes } = useElection();
  const [showCalculations, setShowCalculations] = useState(true);

  // حساب مجموع الأصوات لكل لائحة ومرشح
  const calculatedData = useMemo(() => {
    // حساب الأصوات الكلية والصحيحة
    let totalValidVotes = 0;
    let totalRejectedVotes = 0;
    let totalBlankVotes = 0;
    let totalVotes = 0;

    const listVoteTotals: { [listId: number]: number } = {};
    const candidateVoteTotals: { [candidateId: number]: number } = {};

    // جمع الأصوات من جميع الصناديق
    boxVotes.forEach(vote => {
      totalRejectedVotes += vote.rejectedVotes || 0;
      totalBlankVotes += vote.blankVotes || 0;
      totalVotes += vote.totalVotes || 0;

      Object.entries(vote.listVotes || {}).forEach(([listId, votes]) => {
        const id = parseInt(listId);
        listVoteTotals[id] = (listVoteTotals[id] || 0) + votes;
      });

      Object.entries(vote.candidateVotes || {}).forEach(([candidateId, votes]) => {
        const id = parseInt(candidateId);
        candidateVoteTotals[id] = (candidateVoteTotals[id] || 0) + votes;
      });
    });

    // حساب الأصوات الصحيحة = مجموع الأصوات - المرفوضة - البيضاء
    totalValidVotes = totalVotes - totalRejectedVotes - totalBlankVotes;

    // تحديث اللوائح والمرشحين بالأصوات المحسوبة
    const updatedLists = partyLists.map(list => ({
      ...list,
      votes: listVoteTotals[list.id] || 0,
      candidates: list.candidates.map(candidate => ({
        ...candidate,
        personalVotes: candidateVoteTotals[candidate.id] || 0,
      })),
    }));

    return {
      totalValidVotes,
      totalRejectedVotes,
      totalBlankVotes,
      totalVotes,
      updatedLists,
    };
  }, [partyLists, boxVotes]);

  // حساب الحاصل الأول والثاني
  const quotients = useMemo(() => {
    const totalSeats = 11;
    const firstQuotient = calculatedData.totalValidVotes / (totalSeats + 1);
    const secondQuotient = calculatedData.totalValidVotes / (totalSeats + 1); // نفس الحاصل الأول في البداية

    return { firstQuotient, secondQuotient };
  }, [calculatedData.totalValidVotes]);

  // تحديد اللوائح الفائزة وعدد مقاعد كل لائحة
  const winningLists = useMemo(() => {
    const lists: ListWithSeats[] = [];

    calculatedData.updatedLists.forEach(list => {
      const passedFirstQuotient = list.votes >= quotients.firstQuotient;
      
      if (passedFirstQuotient) {
        // حساب عدد المقاعد بناء على الحاصل الثاني
        let seatsWon = 0;
        let remainingVotes = list.votes;
        
        while (remainingVotes >= quotients.secondQuotient && seatsWon < 11) {
          seatsWon++;
          remainingVotes -= quotients.secondQuotient;
        }

        lists.push({
          listId: list.id,
          listName: list.name,
          listColor: list.color,
          totalVotes: list.votes,
          seatsWon,
          passedFirstQuotient,
        });
      }
    });

    return lists.sort((a, b) => b.totalVotes - a.totalVotes);
  }, [calculatedData.updatedLists, quotients]);

  // تحديد المرشحين الفائزين
  const winningCandidates = useMemo(() => {
    const winners: WinningCandidate[] = [];
    const listSeatsRemaining: { [listId: number]: number } = {};
    const blockReligionSeatsRemaining: { [key: string]: number } = {};

    // تهيئة المقاعد المتبقية لكل لائحة
    winningLists.forEach(list => {
      listSeatsRemaining[list.listId] = list.seatsWon;
    });

    // تهيئة المقاعد المتبقية لكل دائرة/طائفة
    Object.entries(SEAT_DISTRIBUTION).forEach(([blockNum, blockData]) => {
      Object.entries(blockData.seats).forEach(([religion, seats]) => {
        const key = `${blockNum}-${religion}`;
        blockReligionSeatsRemaining[key] = seats;
      });
    });

    // جمع جميع المرشحين من اللوائح الفائزة
    const allCandidates: Array<{
      candidateId: number;
      candidateName: string;
      listId: number;
      listName: string;
      listColor: string;
      votes: number;
      block: 1 | 2 | 3;
      religion: string;
    }> = [];

    winningLists.forEach(list => {
      const partyList = calculatedData.updatedLists.find(l => l.id === list.listId);
      if (partyList) {
        partyList.candidates.forEach(candidate => {
          allCandidates.push({
            candidateId: candidate.id,
            candidateName: candidate.name,
            listId: list.listId,
            listName: list.listName,
            listColor: list.listColor,
            votes: candidate.personalVotes,
            block: candidate.block,
            religion: candidate.religion,
          });
        });
      }
    });

    // ترتيب المرشحين حسب الأصوات من الأعلى للأدنى
    allCandidates.sort((a, b) => b.votes - a.votes);

    // اختيار المرشحين الفائزين
    let rank = 1;
    for (const candidate of allCandidates) {
      // التحقق من أن اللائحة لم تستنفذ مقاعدها
      if (listSeatsRemaining[candidate.listId] <= 0) {
        continue;
      }

      const blockReligionKey = `${candidate.block}-${candidate.religion}`;
      
      // التحقق من وجود مقاعد متبقية في الدائرة/الطائفة
      if (blockReligionSeatsRemaining[blockReligionKey] > 0) {
        // فوز مباشر - هناك مقعد متاح في الدائرة والطائفة
        winners.push({
          ...candidate,
          blockName: BLOCK_NAMES[candidate.block],
          rank,
          reason: `مقعد ${candidate.religion} - ${BLOCK_NAMES[candidate.block]}`,
        });
        
        blockReligionSeatsRemaining[blockReligionKey]--;
        listSeatsRemaining[candidate.listId]--;
        rank++;
      } else {
        // البحث عن مقعد بديل
        let foundAlternateSeat = false;

        // أولاً: البحث في دوائر أخرى لنفس الطائفة
        for (const [key, seatsLeft] of Object.entries(blockReligionSeatsRemaining)) {
          const [blockNum, religion] = key.split('-');
          if (religion === candidate.religion && seatsLeft > 0) {
            winners.push({
              ...candidate,
              blockName: BLOCK_NAMES[candidate.block],
              rank,
              reason: `مقعد ${candidate.religion} بديل من ${BLOCK_NAMES[parseInt(blockNum) as 1 | 2 | 3]}`,
            });
            
            blockReligionSeatsRemaining[key]--;
            listSeatsRemaining[candidate.listId]--;
            rank++;
            foundAlternateSeat = true;
            break;
          }
        }

        // ثانياً: إذا لم يتم إيجاد مقعد في نفس الطائفة، البحث في طوائف أخرى
        if (!foundAlternateSeat) {
          // البحث عن المرشحين الآخرين من نفس الطائفة لمعرفة إذا كان هذا المرشح الأعلى في طائفته
          const sameReligionCandidates = allCandidates.filter(
            c => c.religion === candidate.religion && c.votes >= candidate.votes
          );
          const isTopInReligion = sameReligionCandidates.length === 1;

          if (isTopInReligion) {
            // البحث عن أي مقعد متاح في أي طائفة
            for (const [key, seatsLeft] of Object.entries(blockReligionSeatsRemaining)) {
              if (seatsLeft > 0) {
                const [blockNum, religion] = key.split('-');
                winners.push({
                  ...candidate,
                  blockName: BLOCK_NAMES[candidate.block],
                  rank,
                  reason: `مقعد ${religion} بديل من ${BLOCK_NAMES[parseInt(blockNum) as 1 | 2 | 3]} (الأعلى في ${candidate.religion})`,
                });
                
                blockReligionSeatsRemaining[key]--;
                listSeatsRemaining[candidate.listId]--;
                rank++;
                foundAlternateSeat = true;
                break;
              }
            }
          }
        }
      }

      // إذا تم توزيع جميع المقاعد
      if (winners.length >= 11) {
        break;
      }
    }

    return winners;
  }, [winningLists, calculatedData.updatedLists]);

  // حساب المقاعد المتبقية
  const remainingSeats = useMemo(() => {
    const remaining: { [key: string]: number } = {};
    
    Object.entries(SEAT_DISTRIBUTION).forEach(([blockNum, blockData]) => {
      Object.entries(blockData.seats).forEach(([religion, totalSeats]) => {
        const key = `${blockNum}-${religion}`;
        const won = winningCandidates.filter(
          c => c.block === parseInt(blockNum) && c.religion === religion
        ).length;
        remaining[key] = totalSeats - won;
      });
    });

    return remaining;
  }, [winningCandidates]);

  return (
    <div>
      {/* إحصائيات عامة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {calculatedData.totalValidVotes.toLocaleString('ar')}
              </div>
              <p className="text-sm text-muted-foreground mt-1">أصوات صحيحة</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {calculatedData.totalRejectedVotes.toLocaleString('ar')}
              </div>
              <p className="text-sm text-muted-foreground mt-1">أصوات مرفوضة</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {calculatedData.totalBlankVotes.toLocaleString('ar')}
              </div>
              <p className="text-sm text-muted-foreground mt-1">أوراق بيضاء</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {calculatedData.totalVotes.toLocaleString('ar')}
              </div>
              <p className="text-sm text-muted-foreground mt-1">المجموع الكلي</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الحاصل الانتخابي */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                الحاصل الانتخابي
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                الحاصل الأول والثاني المستخدم لتحديد اللوائح الفائزة وعدد مقاعدها
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalculations(!showCalculations)}
            >
              {showCalculations ? 'إخفاء' : 'إظهار'} الحسابات
            </Button>
          </div>
        </CardHeader>
        {showCalculations && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="text-lg font-semibold mb-3">الحاصل الأول</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    الحاصل الأول = مجموع الأصوات الصحيحة ÷ (عدد المقاعد + 1)
                  </p>
                  <p className="font-mono text-base">
                    = {calculatedData.totalValidVotes.toLocaleString('ar')} ÷ (11 + 1)
                  </p>
                  <p className="font-mono text-base">
                    = {calculatedData.totalValidVotes.toLocaleString('ar')} ÷ 12
                  </p>
                  <div className="text-2xl font-bold text-blue-600 mt-4">
                    = {Math.floor(quotients.firstQuotient).toLocaleString('ar')} صوت
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    اللوائح التي تتخطى هذا الحاصل تعتبر فائزة
                  </p>
                </div>
              </div>

              <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
                <h3 className="text-lg font-semibold mb-3">الحاصل الثاني</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    الحاصل الثاني = مجموع الأصوات ÷ (عدد المقاعد المتبقية + 1)
                  </p>
                  <p className="font-mono text-base">
                    = {calculatedData.totalValidVotes.toLocaleString('ar')} ÷ (11 + 1)
                  </p>
                  <p className="font-mono text-base">
                    = {calculatedData.totalValidVotes.toLocaleString('ar')} ÷ 12
                  </p>
                  <div className="text-2xl font-bold text-purple-600 mt-4">
                    = {Math.floor(quotients.secondQuotient).toLocaleString('ar')} صوت
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    يستخدم لحساب عدد المقاعد لكل لائحة فائزة
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* اللوائح الفائزة */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            اللوائح الفائزة
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            اللوائح التي تخطت الحاصل الأول وعدد المقاعد التي حصلت عليها
          </p>
        </CardHeader>
        <CardContent>
          {winningLists.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                لا توجد لوائح تخطت الحاصل الانتخابي الأول حتى الآن
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {winningLists.map((list, index) => (
                <div
                  key={list.listId}
                  className="p-6 rounded-lg border-2"
                  style={{
                    backgroundColor: `${list.listColor}10`,
                    borderColor: list.listColor,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: list.listColor }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{list.listName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {list.totalVotes.toLocaleString('ar')} صوت
                        </p>
                      </div>
                    </div>
                    <Badge className="text-lg px-4 py-2" style={{ backgroundColor: list.listColor }}>
                      {list.seatsWon} {list.seatsWon === 1 ? 'مقعد' : 'مقاعد'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">نسبة الأصوات:</span>
                      <span className="font-semibold mr-2">
                        {((list.totalVotes / calculatedData.totalValidVotes) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">تخطت الحاصل الأول:</span>
                      <Badge variant="outline" className="mr-2 bg-green-100 text-green-700 border-green-300">
                        نعم ✓
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* المرشحون الفائزون */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            المرشحون الفائزون - {winningCandidates.length} من أصل 11 مقعد
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            ترتيب المرشحين الفائزين حسب عدد الأصوات التفضيلية مع مراعاة الحصص الطائفية والدوائر
          </p>
        </CardHeader>
        <CardContent>
          {winningCandidates.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                لا يوجد فائزون حتى الآن. يرجى التأكد من وجود أصوات كافية ولوائح تخطت الحاصل الانتخابي.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">المرتبة</TableHead>
                    <TableHead>اسم المرشح</TableHead>
                    <TableHead>اللائحة</TableHead>
                    <TableHead className="text-center">الأصوات التفضيلية</TableHead>
                    <TableHead className="text-center">الدائرة</TableHead>
                    <TableHead className="text-center">الطائفة</TableHead>
                    <TableHead>سبب الفوز</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {winningCandidates.map((winner, index) => (
                    <TableRow key={winner.candidateId} className="hover:bg-muted/50">
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          {index === 0 ? (
                            <Trophy className="w-6 h-6 text-yellow-500" />
                          ) : index === 1 ? (
                            <Medal className="w-6 h-6 text-gray-400" />
                          ) : index === 2 ? (
                            <Award className="w-6 h-6 text-orange-600" />
                          ) : (
                            <span className="font-semibold text-lg">{winner.rank}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{winner.candidateName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: winner.listColor }}>
                          {winner.listName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {winner.votes.toLocaleString('ar')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{winner.blockName}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{winner.religion}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {winner.reason}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* المقاعد المتبقية */}
      <Card>
        <CardHeader>
          <CardTitle>المقاعد المتبقية حسب الدائرة والطائفة</CardTitle>
          <p className="text-sm text-muted-foreground">
            عرض المقاعد التي لم يتم توزيعها بعد
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(SEAT_DISTRIBUTION).map(([blockNum, blockData]) => {
              const blockName = BLOCK_NAMES[parseInt(blockNum) as 1 | 2 | 3];
              return (
                <div key={blockNum} className="p-6 bg-slate-50 rounded-lg border-2 border-slate-200">
                  <h3 className="text-lg font-semibold mb-4">{blockName}</h3>
                  <div className="space-y-3">
                    {Object.entries(blockData.seats).map(([religion, totalSeats]) => {
                      const key = `${blockNum}-${religion}`;
                      const remaining = remainingSeats[key] || 0;
                      const won = totalSeats - remaining;
                      
                      return (
                        <div key={religion} className="flex items-center justify-between">
                          <span className="text-sm">{religion}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={remaining === 0 ? "default" : "secondary"}>
                              {won} / {totalSeats}
                            </Badge>
                            {remaining === 0 && (
                              <span className="text-green-600 text-sm">✓ مكتمل</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
