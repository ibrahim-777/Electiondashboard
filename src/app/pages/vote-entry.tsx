import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle2, Save, Edit, X, AlertCircle } from 'lucide-react';
import { useElection } from '../context/election-context';
import { toast } from 'sonner';

export function VoteEntry() {
  const { partyLists, pollingBoxes, addBoxVotes, getBoxVotes } = useElection();
  
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [listVotes, setListVotes] = useState<{ [listId: number]: number }>({});
  const [candidateVotes, setCandidateVotes] = useState<{ [candidateId: number]: number }>({});
  const [rejectedVotes, setRejectedVotes] = useState<number>(0);
  const [blankVotes, setBlankVotes] = useState<number>(0);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  const selectedBox = pollingBoxes.find(box => box.id === selectedBoxId);

  // Get unique blocks
  const blocks = Array.from(new Set(pollingBoxes.map(box => box.block))).sort();

  // Get districts for selected block
  const districts = selectedBlock 
    ? Array.from(new Set(pollingBoxes.filter(box => box.block === selectedBlock).map(box => box.district)))
    : [];

  // Get centers for selected block and district
  const centers = selectedBlock && selectedDistrict
    ? Array.from(new Set(pollingBoxes.filter(box => box.block === selectedBlock && box.district === selectedDistrict).map(box => box.center)))
    : [];

  // Get rooms for selected center
  const rooms = selectedBlock && selectedDistrict && selectedCenter
    ? pollingBoxes.filter(box => box.block === selectedBlock && box.district === selectedDistrict && box.center === selectedCenter)
    : [];

  const handleBlockSelect = (blockId: string) => {
    const block = parseInt(blockId) as 1 | 2 | 3;
    setSelectedBlock(block);
    setSelectedDistrict(null);
    setSelectedCenter(null);
    setSelectedBoxId(null);
    setListVotes({});
    setCandidateVotes({});
    setRejectedVotes(0);
    setBlankVotes(0);
    setTotalVotes(0);
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setSelectedCenter(null);
    setSelectedBoxId(null);
    setListVotes({});
    setCandidateVotes({});
    setRejectedVotes(0);
    setBlankVotes(0);
    setTotalVotes(0);
  };

  const handleCenterSelect = (center: string) => {
    setSelectedCenter(center);
    setSelectedBoxId(null);
    setListVotes({});
    setCandidateVotes({});
    setRejectedVotes(0);
    setBlankVotes(0);
    setTotalVotes(0);
  };

  const handleRoomSelect = (boxId: string) => {
    const id = parseInt(boxId);
    setSelectedBoxId(id);
    
    // Load existing votes if any
    const votes = getBoxVotes(id);
    if (votes) {
      setListVotes(votes.listVotes);
      setCandidateVotes(votes.candidateVotes);
      setRejectedVotes(votes.rejectedVotes);
      setBlankVotes(votes.blankVotes);
      setTotalVotes(votes.totalVotes);
      setHasExistingData(true);
      setIsEditMode(false); // Start in view-only mode
    } else {
      setListVotes({});
      setCandidateVotes({});
      setRejectedVotes(0);
      setBlankVotes(0);
      setTotalVotes(0);
      setHasExistingData(false);
      setIsEditMode(true); // Start in edit mode for new data
    }
  };

  const handleSaveVotes = () => {
    if (!selectedBoxId) {
      toast.error('الرجاء اختيار صندوق اقتراع');
      return;
    }

    addBoxVotes(selectedBoxId, listVotes, candidateVotes, rejectedVotes, blankVotes, totalVotes);
    toast.success(hasExistingData ? 'تم تحديث الأصوات بنجاح' : 'تم حفظ الأصوات بنجاح');
    setHasExistingData(true);
    setIsEditMode(false);
  };

  const handleEnableEdit = () => {
    setIsEditMode(true);
    toast.info('يمكنك الآن تعديل البيانات');
  };

  const handleCancelEdit = () => {
    // Reload original data
    if (selectedBoxId) {
      const votes = getBoxVotes(selectedBoxId);
      if (votes) {
        setListVotes(votes.listVotes);
        setCandidateVotes(votes.candidateVotes);
        setRejectedVotes(votes.rejectedVotes);
        setBlankVotes(votes.blankVotes);
        setTotalVotes(votes.totalVotes);
      }
    }
    setIsEditMode(false);
    toast.info('تم إلغاء التعديل');
  };

  const handleListVoteChange = (listId: number, value: string) => {
    const votes = parseInt(value) || 0;
    setListVotes({ ...listVotes, [listId]: votes });
    updateTotalVotes();
  };

  const handleCandidateVoteChange = (candidateId: number, value: string) => {
    const votes = parseInt(value) || 0;
    setCandidateVotes({ ...candidateVotes, [candidateId]: votes });
    updateTotalVotes();
  };

  const handleRejectedVotesChange = (value: string) => {
    const votes = parseInt(value) || 0;
    setRejectedVotes(votes);
    updateTotalVotes();
  };

  const handleBlankVotesChange = (value: string) => {
    const votes = parseInt(value) || 0;
    setBlankVotes(votes);
    updateTotalVotes();
  };

  const updateTotalVotes = () => {
    const total = Object.values(listVotes).reduce((acc, val) => acc + val, 0) +
                  Object.values(candidateVotes).reduce((acc, val) => acc + val, 0) +
                  rejectedVotes + blankVotes;
    setTotalVotes(total);
  };

  // Get the proper block name
  const getBlockName = (blockNumber: number) => {
    if (blockNumber === 1) return 'المنية';
    if (blockNumber === 2) return 'الضنية';
    return 'طرابلس';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">إدخال الأصوات</h1>
        <p className="text-muted-foreground">إدخال أصوات القوائم والمرشحين لكل صندوق اقتراع</p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Box Selection */}
        <Card>
          <CardHeader>
            <CardTitle>اختيار صندوق الاقتراع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="blockSelect">القضاء</Label>
                <Select 
                  value={selectedBlock?.toString()} 
                  onValueChange={handleBlockSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر قضاء" />
                  </SelectTrigger>
                  <SelectContent>
                    {blocks.map((block) => (
                      <SelectItem key={block} value={block.toString()}>
                        {getBlockName(block)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBlock && (
                <div>
                  <Label htmlFor="districtSelect">المحلة</Label>
                  <Select 
                    value={selectedDistrict} 
                    onValueChange={handleDistrictSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر محلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedDistrict && (
                <div>
                  <Label htmlFor="centerSelect">المركز</Label>
                  <Select 
                    value={selectedCenter} 
                    onValueChange={handleCenterSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مركز" />
                    </SelectTrigger>
                    <SelectContent>
                      {centers.map((center) => (
                        <SelectItem key={center} value={center}>
                          {center}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedCenter && (
                <div>
                  <Label htmlFor="roomSelect">الغرفة</Label>
                  <Select 
                    value={selectedBoxId?.toString()} 
                    onValueChange={handleRoomSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر غرفة" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((box) => (
                        <SelectItem key={box.id} value={box.id.toString()}>
                          {box.hasVotes && '✓ '}
                          {box.room} - {box.center}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedBox && (
                <div className="flex gap-2 text-sm">
                  <Badge variant="outline">{selectedBox.blockName}</Badge>
                  <Badge variant={selectedBox.isOpened ? "default" : "secondary"}>
                    {selectedBox.isOpened ? 'مفتوح' : 'مغلق'}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vote Entry Forms */}
        {selectedBoxId && (
          <>
            {/* Existing Data Alert */}
            {hasExistingData && !isEditMode && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-blue-900">
                    تم إدخال البيانات مسبقاً لهذا الصندوق. للتعديل، اضغط على زر "تعديل البيانات"
                  </span>
                  <Button onClick={handleEnableEdit} variant="outline" className="mr-4">
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل البيانات
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {partyLists.map((list) => (
              <Card key={list.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: list.color }}
                    />
                    {list.name} ({list.shortName})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* List Votes */}
                  <div>
                    <Label htmlFor={`list-${list.id}`}>أصوات القائمة</Label>
                    <Input
                      id={`list-${list.id}`}
                      type="number"
                      min="0"
                      value={listVotes[list.id] || ''}
                      onChange={(e) => handleListVoteChange(list.id, e.target.value)}
                      placeholder="0"
                      disabled={!isEditMode}
                    />
                  </div>

                  {/* Candidate Votes */}
                  <div>
                    <h4 className="mb-3 text-sm">أصوات المرشحين</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {list.candidates.map((candidate) => (
                        <div key={candidate.id} className="space-y-1">
                          <Label 
                            htmlFor={`candidate-${candidate.id}`}
                            className="text-sm"
                          >
                            {candidate.name}
                            <span className="text-xs text-muted-foreground mr-2">
                              (الدائرة {candidate.block})
                            </span>
                          </Label>
                          <Input
                            id={`candidate-${candidate.id}`}
                            type="number"
                            min="0"
                            value={candidateVotes[candidate.id] || ''}
                            onChange={(e) => handleCandidateVoteChange(candidate.id, e.target.value)}
                            placeholder="0"
                            className="text-sm"
                            disabled={!isEditMode}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Rejected, Blank, and Total Votes */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="totalVotes">مجموع أصوات الغرفة</Label>
                  <Input
                    id="totalVotes"
                    type="number"
                    min="0"
                    value={totalVotes || ''}
                    onChange={(e) => setTotalVotes(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="rejectedVotes">ملغية</Label>
                  <Input
                    id="rejectedVotes"
                    type="number"
                    min="0"
                    value={rejectedVotes || ''}
                    onChange={(e) => handleRejectedVotesChange(e.target.value)}
                    placeholder="0"
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="blankVotes">ورقة بيضاء</Label>
                  <Input
                    id="blankVotes"
                    type="number"
                    min="0"
                    value={blankVotes || ''}
                    onChange={(e) => handleBlankVotesChange(e.target.value)}
                    placeholder="0"
                    disabled={!isEditMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save/Cancel Buttons */}
            {isEditMode && (
              <div className="flex justify-end gap-3">
                {hasExistingData && (
                  <Button onClick={handleCancelEdit} size="lg" variant="outline" className="gap-2">
                    <X className="w-5 h-5" />
                    إلغاء
                  </Button>
                )}
                <Button onClick={handleSaveVotes} size="lg" className="gap-2">
                  <Save className="w-5 h-5" />
                  {hasExistingData ? 'تحديث الأصوات' : 'حفظ الأصوات'}
                </Button>
              </div>
            )}
          </>
        )}

        {!selectedBoxId && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              الرجاء اختيار صندوق اقتراع لبدء إدخال الأصوات
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}