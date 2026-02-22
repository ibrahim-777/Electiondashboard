import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { UserCheck, Crown, Medal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Candidate {
  id: number;
  name: string;
  personalVotes: number;
  rank?: number;
  wonSeat?: boolean;
}

interface Allocation {
  id: number;
  name: string;
  shortName: string;
  color: string;
  votes: number;
  exactSeats: number;
  initialSeats: number;
  remainder: number;
  finalSeats: number;
  candidates: Candidate[];
}

interface CandidateRankingsProps {
  allocations: Allocation[];
}

export function CandidateRankings({ allocations }: CandidateRankingsProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Candidate Rankings & Seat Winners
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Voters choose both a party list and a specific candidate. Candidates are ranked by personal votes within each list.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={allocations[0]?.id.toString() || '1'}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
            {allocations.map((alloc) => (
              <TabsTrigger key={alloc.id} value={alloc.id.toString()}>
                <div className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: alloc.color }}
                  />
                  {alloc.shortName}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {allocations.map((alloc) => (
            <TabsContent key={alloc.id} value={alloc.id.toString()}>
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: alloc.color }}
                    />
                    <div>
                      <h3 className="text-lg">{alloc.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Total List Votes: {alloc.votes.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl" style={{ color: alloc.color }}>
                      {alloc.finalSeats} Seats
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Top {alloc.finalSeats} candidates win seats
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Candidate Name</TableHead>
                      <TableHead className="text-right">Personal Votes</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alloc.candidates.map((candidate) => (
                      <TableRow 
                        key={candidate.id}
                        className={candidate.wonSeat ? 'bg-green-50 font-semibold' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {candidate.rank === 1 && (
                              <Crown className="w-4 h-4 text-yellow-600" />
                            )}
                            {candidate.rank === 2 && (
                              <Medal className="w-4 h-4 text-gray-400" />
                            )}
                            {candidate.rank === 3 && (
                              <Medal className="w-4 h-4 text-orange-600" />
                            )}
                            <span>#{candidate.rank}</span>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.name}</TableCell>
                        <TableCell className="text-right">
                          {candidate.personalVotes.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {candidate.wonSeat ? (
                            <Badge className="bg-green-600">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Elected
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Elected</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold mb-2">How Candidate Selection Works:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Each voter chooses a party list AND votes for one candidate from that list</li>
            <li>Party lists compete for seats based on total list votes (using Winning Numbers 1 & 2)</li>
            <li>Within each list, candidates are ranked by their personal votes</li>
            <li>The top-ranked candidates from each list fill the seats won by that list</li>
            <li>Example: If a list wins 3 seats, the top 3 candidates by personal votes are elected</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
