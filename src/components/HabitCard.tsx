import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Flame } from "lucide-react";

interface HabitCardProps {
  id: string;
  name: string;
  weekData: boolean[];
  onToggleDay: (habitId: string, dayIndex: number) => void;
}

export const HabitCard = ({ id, name, weekData, onToggleDay }: HabitCardProps) => {
  const [animatingDay, setAnimatingDay] = useState<number | null>(null);
  
  const completedDays = weekData.filter(Boolean).length;
  const streak = calculateStreak(weekData);
  const progressPercentage = (completedDays / 7) * 100;

  const handleDayToggle = (dayIndex: number) => {
    setAnimatingDay(dayIndex);
    onToggleDay(id, dayIndex);
    setTimeout(() => setAnimatingDay(null), 500);
  };

  const getDayStatus = (completed: boolean, dayIndex: number) => {
    if (completed) return 'completed';
    if (dayIndex < new Date().getDay()) return 'missed';
    return 'untracked';
  };

  return (
    <div className="habit-card animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-card-foreground">{name}</h3>
          {streak >= 3 && (
            <div className="streak-flame">
              <Flame className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium text-warning ml-1">{streak}</span>
            </div>
          )}
        </div>
        {progressPercentage >= 70 && (
          <Badge className="celebration-badge animate-bounce-in">
            🎉 {Math.round(progressPercentage)}%
          </Badge>
        )}
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-muted-foreground mb-1">{day}</div>
            <button
              className={`calendar-day ${getDayStatus(weekData[index], index)} ${
                animatingDay === index ? 'animate-bounce-in' : ''
              }`}
              onClick={() => handleDayToggle(index)}
            >
              {weekData[index] ? (
                <Check className="w-4 h-4" />
              ) : getDayStatus(weekData[index], index) === 'missed' ? (
                <X className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-card-foreground animate-count-up">
            {completedDays}/7 days
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-success to-success-glow h-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Achievement Badges */}
      {streak >= 7 && (
        <div className="mt-3 text-center">
          <Badge className="celebration-badge">
            🌟 Habit Hero - 7 Day Streak!
          </Badge>
        </div>
      )}
    </div>
  );
};

function calculateStreak(weekData: boolean[]): number {
  let streak = 0;
  for (let i = weekData.length - 1; i >= 0; i--) {
    if (weekData[i]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}