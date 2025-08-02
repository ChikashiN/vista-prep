import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PerformanceDashboardProps {
  className?: string;
}

// Mock data for the performance dashboard
const previousScores = [
  {
    date: "August 06",
    scoreRange: "1360-1560",
    readingScore: 680,
    mathScore: 780
  },
  {
    date: "July 30", 
    scoreRange: "1310-1510",
    readingScore: 650,
    mathScore: 760
  },
  {
    date: "July 23",
    scoreRange: "1240-1440", 
    readingScore: 620,
    mathScore: 720
  }
];

const questionSummaryData = [
  { period: "07/13-07/20", attempted: 180, correct: 162, percentage: 90 },
  { period: "07/20-07/27", attempted: 98, correct: 88, percentage: 90 },
  { period: "07/27-08/03", attempted: 92, correct: 82, percentage: 89 },
  { period: "08/03-08/10", attempted: 98, correct: 95, percentage: 97 },
  { period: "08/10-08/17", attempted: 5, correct: 5, percentage: 100 }
];

export function PerformanceDashboard({ className }: PerformanceDashboardProps) {
  const totalAttempted = 455 + 35;
  const accuracyPercentage = Math.round((455 / totalAttempted) * 100);

  return (
    <div className={`space-y-8 ${className || ''}`}>
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Digital SAT Performance</h2>
        
        {/* Previous Scores */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-muted-foreground">PREVIOUS SCORES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {previousScores.map((score, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{score.date}</span>
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                      See Results →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Total Score</div>
                    <div className="text-2xl font-bold">{score.scoreRange}</div>
                  </div>
                  
                  {/* Score visualization circle */}
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      {/* Background circle */}
                      <path 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      {/* Progress circle */}
                      <path 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray={`${(score.readingScore + score.mathScore) / 1600 * 100}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Accuracy and Question Summary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Accuracy */}
          <Card>
            <CardHeader>
              <CardTitle>ACCURACY</CardTitle>
              <div className="text-sm text-muted-foreground">July 14-August 10</div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-lg font-semibold mb-2">455 correct out of 490</div>
                
                {/* Large donut visualization */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <path 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <path 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeDasharray={`${accuracyPercentage}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Center percentage */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{accuracyPercentage}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Question Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questionSummaryData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{data.period}</span>
                      <div className="text-right">
                        <span className="text-primary font-semibold">{data.correct}</span>
                        <span className="text-muted-foreground">/{data.attempted}</span>
                        <span className="ml-2 text-xs text-green-600">{data.percentage}%</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={(data.attempted / 200) * 100} className="h-6 bg-muted/30" />
                      <Progress 
                        value={(data.correct / 200) * 100} 
                        className="h-6 absolute top-0 bg-transparent" 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded"></div>
                  <span>Questions Attempted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Questions Answered Correctly</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 text-white px-3 py-1 rounded font-bold text-lg">
                  100%
                </div>
                <div>
                  <div className="font-medium text-green-800">Strongest Section:</div>
                  <div className="text-sm text-green-600">Linear Equations In 1 Variable</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white px-3 py-1 rounded font-bold text-lg">
                  70%
                </div>
                <div>
                  <div className="font-medium text-red-800">Weakest Section:</div>
                  <div className="text-sm text-red-600">Command Of Evidence: Textual</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          All Accuracy and Question Summary numbers exclude questions answered with hints.
        </div>
      </div>
    </div>
  );
}