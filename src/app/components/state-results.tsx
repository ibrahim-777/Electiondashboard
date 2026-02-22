import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StateResult {
  state: string;
  winner: string;
  margin: number;
  votes: number;
  turnout: number;
}

interface Candidate {
  id: number;
  name: string;
  party: string;
  color: string;
  votes: number;
  electoralVotes: number;
  image: string;
}

interface StateResultsProps {
  results: StateResult[];
  candidates: Candidate[];
}

export function StateResults({ results, candidates }: StateResultsProps) {
  const getWinnerColor = (winnerName: string) => {
    const candidate = candidates.find(c => c.name === winnerName);
    return candidate?.color || '#64748b';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>State-by-State Results</CardTitle>
        <p className="text-sm text-muted-foreground">Key battleground states and outcomes</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Total Votes</TableHead>
                <TableHead className="text-right">Turnout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.state}>
                  <TableCell>{result.state}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getWinnerColor(result.winner) }}
                      />
                      <span>{result.winner.split(' ')[1]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {result.margin < 3 ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Close
                        </Badge>
                      ) : null}
                      <span>+{result.margin}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {result.votes.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {result.turnout > 70 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : result.turnout < 65 ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : null}
                      <span>{result.turnout}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
