import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTestData } from "@/hooks/useTestData";

interface PerformanceDashboardProps {
  className?: string;
}

export function PerformanceDashboard({ className }: PerformanceDashboardProps) {
  const { 
    getRecentScores, 
    getWeeklyData, 
    getOverallAccuracy, 
    getStrongestAndWeakest 
  } = useTestData();

  const recentScores = getRecentScores();
  const weeklyData = getWeeklyData();
  const overallAccuracy = getOverallAccuracy();
  const { strongest, weakest } = getStrongestAndWeakest();

  // Show default message if no data
  if (recentScores.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Your Digital SAT Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No test data available yet.</p>
            <p className="text-sm text-muted-foreground">Complete some practice tests or take the full SAT to see your performance data here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-8 ${className || ''}`}>
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Digital SAT Performance</h2>
        
        {/* Previous Scores */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-muted-foreground">PREVIOUS SCORES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentScores.map((score, index) => (
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
                             <div className="text-sm font-bold">{score.totalScore}</div>
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
                            <div className="text-sm">Total: {score.totalScore}</div>
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
                <div className="text-lg font-semibold mb-2">{overallAccuracy.totalCorrect} correct out of {overallAccuracy.totalQuestions}</div>
                
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
                            strokeDasharray={`${overallAccuracy.percentage * 1.13}, 113`}
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
                            <div className="text-4xl font-bold text-primary animate-pulse">{overallAccuracy.percentage}%</div>
                            <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-semibold">Accuracy Details</div>
                          <div className="text-sm">{overallAccuracy.totalCorrect} correct answers</div>
                          <div className="text-sm">{overallAccuracy.totalQuestions - overallAccuracy.totalCorrect} incorrect answers</div>
                          <div className="text-sm">{overallAccuracy.totalQuestions} total questions</div>
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
                {weeklyData.length > 0 ? weeklyData.map((data, index) => (
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
                )) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No weekly data available yet.</p>
                    <p className="text-sm">Complete more practice sessions to see weekly trends.</p>
                  </div>
                )}
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
                  {strongest.accuracy}%
                </div>
                <div>
                  <div className="font-medium text-green-800">Strongest Section:</div>
                  <div className="text-sm text-green-600">{strongest.domain}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white px-3 py-1 rounded font-bold text-lg">
                  {weakest.accuracy}%
                </div>
                <div>
                  <div className="font-medium text-red-800">Weakest Section:</div>
                  <div className="text-sm text-red-600">{weakest.domain}</div>
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