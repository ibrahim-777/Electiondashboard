import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';

interface BlockResult {
  block: string;
  seats: number;
  totalVotes: number;
  unaccepted: number;
  blank: number;
}

interface BlockResultsProps {
  blocks: BlockResult[];
}

export function BlockResults({ blocks }: BlockResultsProps) {
  const totals = blocks.reduce(
    (acc, block) => ({
      seats: acc.seats + block.seats,
      totalVotes: acc.totalVotes + block.totalVotes,
      unaccepted: acc.unaccepted + block.unaccepted,
      blank: acc.blank + block.blank,
    }),
    { seats: 0, totalVotes: 0, unaccepted: 0, blank: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Voting Blocks Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          The state is divided into 3 voting blocks with different seat allocations
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Block</TableHead>
                <TableHead className="text-right">Seats</TableHead>
                <TableHead className="text-right">Total Votes</TableHead>
                <TableHead className="text-right">Valid Votes</TableHead>
                <TableHead className="text-right">Unaccepted</TableHead>
                <TableHead className="text-right">Blank Papers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block) => {
                const validVotes = block.totalVotes - block.unaccepted;
                const rejectionRate = ((block.unaccepted / block.totalVotes) * 100).toFixed(2);
                const blankRate = ((block.blank / block.totalVotes) * 100).toFixed(2);
                
                return (
                  <TableRow key={block.block}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{block.block}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-semibold">
                        {block.seats}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {block.totalVotes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {validVotes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span>{block.unaccepted.toLocaleString()}</span>
                        <span className="text-xs text-red-600">({rejectionRate}%)</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span>{block.blank.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">({blankRate}%)</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {/* Totals Row */}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-blue-600">
                    {totals.seats}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {totals.totalVotes.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {(totals.totalVotes - totals.unaccepted).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span>{totals.unaccepted.toLocaleString()}</span>
                    <span className="text-xs text-red-600">
                      ({((totals.unaccepted / totals.totalVotes) * 100).toFixed(2)}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span>{totals.blank.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">
                      ({((totals.blank / totals.totalVotes) * 100).toFixed(2)}%)
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold">Block 1</h4>
            </div>
            <div className="text-3xl mb-1">1 Seat</div>
            <p className="text-sm text-muted-foreground">
              {blocks[0]?.totalVotes.toLocaleString()} votes
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold">Block 2</h4>
            </div>
            <div className="text-3xl mb-1">2 Seats</div>
            <p className="text-sm text-muted-foreground">
              {blocks[1]?.totalVotes.toLocaleString()} votes
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold">Block 3</h4>
            </div>
            <div className="text-3xl mb-1">8 Seats</div>
            <p className="text-sm text-muted-foreground">
              {blocks[2]?.totalVotes.toLocaleString()} votes
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm">
            <strong>Note:</strong> The state is geographically divided into 3 blocks for voting organization. 
            Block 1 elects 1 representative, Block 2 elects 2 representatives, and Block 3 elects 8 representatives, 
            totaling 11 seats in parliament.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
