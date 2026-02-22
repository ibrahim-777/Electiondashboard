import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trophy, TrendingUp } from 'lucide-react';

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
}

interface PartyList {
  id: number;
  name: string;
  shortName: string;
  color: string;
  votes: number;
}

interface SeatAllocationProps {
  allocations: Allocation[];
  winningNumber1: number;
  winningNumber2: number;
  allLists: PartyList[];
}

export function SeatAllocation({ allocations, winningNumber1, winningNumber2, allLists }: SeatAllocationProps) {
  // Get lists that didn't qualify
  const unqualifiedLists = allLists.filter(
    list => !allocations.find(a => a.id === list.id)
  );

  // Sort allocations by final seats (descending)
  const sortedAllocations = [...allocations].sort((a, b) => b.finalSeats - a.finalSeats);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Seat Allocation Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed calculation showing how seats are distributed using the proportional system
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Party List</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead className="text-right">÷ WN2</TableHead>
                <TableHead className="text-right">Exact Seats</TableHead>
                <TableHead className="text-right">Initial</TableHead>
                <TableHead className="text-right">Remainder</TableHead>
                <TableHead className="text-right">Final Seats</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAllocations.map((alloc, index) => {
                const gotExtraSeat = alloc.finalSeats > alloc.initialSeats;
                
                return (
                  <TableRow key={alloc.id} className="font-medium">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: alloc.color }}
                        />
                        <div>
                          <div>{alloc.name}</div>
                          <div className="text-xs text-muted-foreground font-normal">
                            {alloc.shortName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {alloc.votes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {winningNumber2.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        {alloc.exactSeats.toFixed(3)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {alloc.initialSeats}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={gotExtraSeat ? 'text-green-600 font-semibold' : ''}>
                        {alloc.remainder.toFixed(3)}
                        {gotExtraSeat && <TrendingUp className="w-3 h-3 inline ml-1" />}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xl" style={{ color: alloc.color }}>
                          {alloc.finalSeats}
                        </span>
                        {index === 0 && (
                          <Trophy className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {unqualifiedLists.length > 0 && (
                <>
                  <TableRow>
                    <TableCell colSpan={7} className="bg-muted/50 font-semibold text-center">
                      Below Threshold (Winning Number 1: {winningNumber1.toLocaleString(undefined, { maximumFractionDigits: 0 })})
                    </TableCell>
                  </TableRow>
                  {unqualifiedLists.map((list) => (
                    <TableRow key={list.id} className="opacity-60">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: list.color }}
                          />
                          <div>
                            <div>{list.name}</div>
                            <div className="text-xs text-muted-foreground font-normal">
                              {list.shortName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {list.votes.toLocaleString()}
                      </TableCell>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Not qualified for seat allocation
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">0</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold mb-3">How It Works:</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>
              <strong>Threshold Check:</strong> Lists must get more than Winning Number 1 ({winningNumber1.toLocaleString(undefined, { maximumFractionDigits: 0 })}) to qualify
            </li>
            <li>
              <strong>Calculate Exact Seats:</strong> Each qualified list's votes ÷ Winning Number 2 ({winningNumber2.toLocaleString(undefined, { maximumFractionDigits: 2 })})
            </li>
            <li>
              <strong>Initial Allocation:</strong> Each list gets the integer part (floor) of their exact seats
            </li>
            <li>
              <strong>Remainder Distribution:</strong> Remaining seats go to lists with highest decimal remainders
            </li>
            <li>
              <strong>Example:</strong> If a list gets 1.763 exact seats, they initially get 1 seat. If their remainder (0.763) is among the highest, they get 1 more seat for a final total of 2 seats
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
