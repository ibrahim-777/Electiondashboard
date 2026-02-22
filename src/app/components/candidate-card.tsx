import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Crown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Candidate {
  id: number;
  name: string;
  party: string;
  color: string;
  votes: number;
  electoralVotes: number;
  image: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  totalVotes: number;
  isLeading: boolean;
}

export function CandidateCard({ candidate, totalVotes, isLeading }: CandidateCardProps) {
  const percentage = ((candidate.votes / totalVotes) * 100).toFixed(2);

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg">
      {isLeading && (
        <div 
          className="absolute top-0 left-0 right-0 h-1" 
          style={{ backgroundColor: candidate.color }}
        />
      )}
      <CardContent className="pt-6">
        <div className="flex items-start gap-4 mb-4">
          <ImageWithFallback
            src={candidate.image}
            alt={candidate.name}
            className="w-20 h-20 rounded-full object-cover border-4"
            style={{ borderColor: candidate.color }}
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl mb-1">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.party}</p>
              </div>
              {isLeading && (
                <Badge className="bg-yellow-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Leading
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-muted-foreground">Popular Vote</span>
              <div className="text-right">
                <div className="text-2xl">{candidate.votes.toLocaleString()}</div>
                <div className="text-sm" style={{ color: candidate.color }}>
                  {percentage}%
                </div>
              </div>
            </div>
            <Progress 
              value={parseFloat(percentage)} 
              className="h-3"
              style={{
                // @ts-ignore
                '--progress-background': candidate.color,
              }}
            />
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Electoral Votes</span>
              <span className="text-xl" style={{ color: candidate.color }}>
                {candidate.electoralVotes}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
