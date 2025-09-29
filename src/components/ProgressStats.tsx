interface ProgressStatsProps {
  habits: Array<{
    id: string;
    name: string;
    weekData: boolean[];
  }>;
}

export const ProgressStats = ({ habits }: ProgressStatsProps) => {
  const totalDays = habits.length * 7;
  const completedDays = habits.reduce((acc, habit) => 
    acc + habit.weekData.filter(Boolean).length, 0
  );
  const completionPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const getMotivationalMessage = () => {
    if (completionPercentage >= 90) return "🏆 Amazing! You're crushing it!";
    if (completionPercentage >= 70) return "🎉 Great job! Keep it up!";
    if (completionPercentage >= 50) return "💪 You're on track!";
    if (completionPercentage >= 25) return "🌱 Nice start, keep going!";
    return "🚀 Every journey begins with a single step!";
  };

  return (
    <div className="habit-card">
      <h2 className="text-xl font-bold text-card-foreground mb-6">Your Progress</h2>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--success))"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="progress-ring"
              style={{
                filter: 'drop-shadow(0 0 10px hsl(var(--success-glow) / 0.4))'
              }}
            />
          </svg>
          
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-card-foreground animate-count-up">
              {Math.round(completionPercentage)}%
            </span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-3">
        <div className="text-lg font-medium text-card-foreground animate-count-up">
          {completedDays} of {totalDays} days completed
        </div>
        
        <div className="text-sm text-muted-foreground">
          {getMotivationalMessage()}
        </div>

        {completionPercentage >= 70 && (
          <div className="celebration-badge animate-bounce-in mx-auto w-fit">
            Weekly Champion! 🏅
          </div>
        )}
      </div>
    </div>
  );
};