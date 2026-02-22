import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';

interface DistrictResult {
  district: string;
  totalVotes: number;
  unaccepted: number;
  blank: number;
  turnout: number;
}

interface DistrictResultsProps {
  results: DistrictResult[];
}

export function DistrictResults({ results }: DistrictResultsProps) {
  const totals = results.reduce(
    (acc, result) => ({
      totalVotes: acc.totalVotes + result.totalVotes,
      unaccepted: acc.unaccepted + result.unaccepted,
      blank: acc.blank + result.blank,
    }),
    { totalVotes: 0, unaccepted: 0, blank: 0 }
  );

  const avgTurnout = results.reduce((sum, r) => sum + r.turnout, 0) / results.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          District-by-District Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground">Vote counting status and turnout by district</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Total Votes</TableHead>
                <TableHead className="text-right">Valid Votes</TableHead>
                <TableHead className="text-right">Unaccepted</TableHead>
                <TableHead className="text-right">Blank Papers</TableHead>
                <TableHead className="text-right">Turnout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => {
                const validVotes = result.totalVotes - result.unaccepted;
                const rejectionRate = ((result.unaccepted / result.totalVotes) * 100).toFixed(2);
                const blankRate = ((result.blank / result.totalVotes) * 100).toFixed(2);
                
                return (
                  <TableRow key={result.district}>
                    <TableCell>{result.district}</TableCell>
                    <TableCell className="text-right">
                      {result.totalVotes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {validVotes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span>{result.unaccepted.toLocaleString()}</span>
                        <span className="text-xs text-red-600">({rejectionRate}%)</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span>{result.blank.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">({blankRate}%)</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {result.turnout > avgTurnout ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : result.turnout < avgTurnout ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : null}
                        <span>{result.turnout}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {/* Totals Row */}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>TOTAL</TableCell>
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
                <TableCell className="text-right">
                  {avgTurnout.toFixed(1)}% avg
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm text-muted-foreground">Total Cast</div>
            <div className="text-2xl">{totals.totalVotes.toLocaleString()}</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="text-sm text-muted-foreground">Rejected Votes</div>
            <div className="text-2xl text-red-600">{totals.unaccepted.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-sm text-muted-foreground">Blank Papers</div>
            <div className="text-2xl text-gray-600">{totals.blank.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
