import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
                  
                  {/* Enhanced score visualization arc */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="relative w-28 h-28 mx-auto cursor-pointer group">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 42 42">
                            {/* Background arc */}
                            <path 
                              d="M 21,21 m 0,-18 A 18,18 0 1,1 21,39 A 18,18 0 1,1 21,3"
                              fill="none"
                              stroke="hsl(var(--muted))"
                              strokeWidth="3"
                              strokeOpacity="0.3"
                            />
                            {/* Animated progress arc */}
                            <path 
                              d="M 21,21 m 0,-18 A 18,18 0 1,1 21,39 A 18,18 0 1,1 21,3"
                              fill="none"
                              stroke={`hsl(${Math.min((score.readingScore + score.mathScore) / 1600 * 120, 120)}, 70%, 50%)`}
                              strokeWidth="3"
                              strokeDasharray={`${(score.readingScore + score.mathScore) / 1600 * 113}, 113`}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out group-hover:stroke-primary"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-sm font-bold">{score.readingScore + score.mathScore}</div>
                              <div className="text-xs text-muted-foreground">/ 1600</div>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-semibold">Score Breakdown</div>
                          <div className="text-sm">Reading: {score.readingScore}</div>
                          <div className="text-sm">Math: {score.mathScore}</div>
                          <div className="text-sm">Total: {score.readingScore + score.mathScore}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                
                {/* Enhanced animated accuracy chart */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="relative w-36 h-36 mx-auto mb-4 cursor-pointer group">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 42 42">
                          {/* Background circle */}
                          <path 
                            d="M 21,21 m 0,-18 A 18,18 0 1,1 21,39 A 18,18 0 1,1 21,3"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="4"
                            strokeOpacity="0.2"
                          />
                          {/* Animated accuracy circle */}
                          <path 
                            d="M 21,21 m 0,-18 A 18,18 0 1,1 21,39 A 18,18 0 1,1 21,3"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="4"
                            strokeDasharray={`${accuracyPercentage * 1.13}, 113`}
                            strokeLinecap="round"
                            className="transition-all duration-2000 ease-out"
                          />
                          {/* Gradient overlay for visual appeal */}
                          <defs>
                            <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="hsl(var(--primary))" />
                              <stop offset="100%" stopColor="hsl(var(--secondary))" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Animated center content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center transition-transform group-hover:scale-105">
                            <div className="text-4xl font-bold text-primary animate-pulse">{accuracyPercentage}%</div>
                            <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <div className="font-semibold">Accuracy Details</div>
                        <div className="text-sm">455 correct answers</div>
                        <div className="text-sm">35 incorrect answers</div>
                        <div className="text-sm">490 total questions</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="space-y-2 cursor-pointer group">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">{data.period}</span>
                            <div className="text-right">
                              <span className="text-green-600 font-semibold">{data.correct}</span>
                              <span className="text-red-500 font-semibold">/{data.attempted - data.correct}</span>
                              <span className="text-muted-foreground">/{data.attempted}</span>
                              <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">{data.percentage}%</span>
                            </div>
                          </div>
                          <div className="relative h-8 bg-muted/30 rounded-lg overflow-hidden group-hover:shadow-md transition-all">
                            {/* Total attempted background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-muted to-muted/50"></div>
                            {/* Incorrect answers (red) */}
                            <div 
                              className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-1000"
                              style={{ width: `${((data.attempted - data.correct) / data.attempted) * 100}%` }}
                            ></div>
                            {/* Correct answers (green) */}
                            <div 
                              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000 delay-200"
                              style={{ width: `${(data.correct / data.attempted) * 100}%` }}
                            ></div>
                            {/* Percentage text overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-semibold text-white drop-shadow-lg">
                                {data.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-semibold">{data.period}</div>
                          <div className="text-sm text-green-600">✓ {data.correct} correct</div>
                          <div className="text-sm text-red-500">✗ {data.attempted - data.correct} incorrect</div>
                          <div className="text-sm text-muted-foreground">Total: {data.attempted} questions</div>
                          <div className="text-sm font-semibold">{data.percentage}% accuracy</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded"></div>
                  <span>Correct Answers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded"></div>
                  <span>Incorrect Answers</span>
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