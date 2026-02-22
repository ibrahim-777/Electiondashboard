import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle2, XCircle, TrendingUp, User } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  personalVotes: number;
  rank?: number;
  wonSeat?: boolean;
}

interface PartyList {
  id: number;
  name: string;
  shortName: string;
  color: string;
  votes: number;
}

interface ListCardProps {
  list: PartyList;
  totalVotes: number;
  seats: number;
  exactSeats: number;
  qualified: boolean;
  winningNumber1: number;
  topCandidates: Candidate[];
}

export function ListCard({ list, totalVotes, seats, exactSeats, qualified, winningNumber1, topCandidates }: ListCardProps) {
  const percentage = ((list.votes / totalVotes) * 100).toFixed(2);
  const marginFromThreshold = list.votes - winningNumber1;
  const marginPercentage = ((marginFromThreshold / winningNumber1) * 100).toFixed(1);

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${qualified ? 'border-2' : 'opacity-75'}`}
      style={{ borderColor: qualified ? list.color : undefined }}
    >
      {qualified && (
        <div 
          className="absolute top-0 left-0 right-0 h-1.5" 
          style={{ backgroundColor: list.color }}
        />
      )}
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: list.color }}
                />
                <h3 className="text-lg">{list.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{list.shortName}</p>
            </div>
            {qualified ? (
              <Badge className="bg-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Qualified
              </Badge>
            ) : (
              <Badge variant="secondary">
                <XCircle className="w-3 h-3 mr-1" />
                Below Threshold
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-muted-foreground">Total Votes</span>
              <div className="text-right">
                <div className="text-2xl">{list.votes.toLocaleString()}</div>
                <div className="text-sm" style={{ color: list.color }}>
                  {percentage}%
                </div>
              </div>
            </div>
            <Progress 
              value={parseFloat(percentage)} 
              className="h-3"
              style={{
                // @ts-ignore
                '--progress-background': list.color,
              }}
            />
          </div>

          {qualified ? (
            <>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Seats Won</span>
                  <span className="text-2xl" style={{ color: list.color }}>
                    {seats}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  Exact calculation: {exactSeats.toFixed(3)} seats
                </div>
              </div>

              {topCandidates.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Top Candidates:</div>
                  <div className="space-y-1">
                    {topCandidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center gap-2 text-xs">
                        {candidate.wonSeat ? (
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                        ) : (
                          <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={candidate.wonSeat ? 'font-semibold' : ''}>
                          {candidate.rank}. {candidate.name}
                        </span>
                        <span className="text-muted-foreground ml-auto">
                          ({candidate.personalVotes.toLocaleString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Above Threshold</span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{marginPercentage}%
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground text-center py-2">
                Did not exceed threshold of {winningNumber1.toLocaleString(undefined, { maximumFractionDigits: 0 })} votes
              </div>
              <div className="text-xs text-red-600 text-center">
                Short by {Math.abs(marginFromThreshold).toLocaleString()} votes
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}