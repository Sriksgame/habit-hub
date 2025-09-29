import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Flame, Star, Target, Zap } from "lucide-react";

interface EnhancedHabitCardProps {
  id: string;
  name: string;
  icon: string;
  category: string;
  weekData: boolean[];
  xp: number;
  onToggleDay: (habitId: string, dayIndex: number) => void;
}

const HABIT_ICONS = {
  "🏃": Target,
  "📚": Star,
  "🧘": Zap,
  "💧": Flame,
  "🍎": Target,
  "💤": Star,
} as const;

export const EnhancedHabitCard = ({ 
  id, 
  name, 
  icon, 
  category, 
  weekData, 
  xp, 
  onToggleDay 
}: EnhancedHabitCardProps) => {
  const [animatingDay, setAnimatingDay] = useState<number | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const completedDays = weekData.filter(Boolean).length;
  const streak = calculateStreak(weekData);
  const progressPercentage = (completedDays / 7) * 100;

  const IconComponent = HABIT_ICONS[icon as keyof typeof HABIT_ICONS] || Target;

  const handleDayToggle = (dayIndex: number) => {
    setAnimatingDay(dayIndex);
    onToggleDay(id, dayIndex);
    
    // Create particle effect on completion
    if (!weekData[dayIndex] && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
      }));
      setParticles(newParticles);
      
      setTimeout(() => setParticles([]), 1000);
    }
    
    setTimeout(() => setAnimatingDay(null), 500);
  };

  const getDayStatus = (completed: boolean, dayIndex: number) => {
    if (completed) return 'completed';
    if (dayIndex < new Date().getDay()) return 'missed';
    return 'untracked';
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'Health': return 'success';
      case 'Work': return 'primary';
      case 'Learning': return 'accent';
      default: return 'muted';
    }
  };

  return (
    <div ref={cardRef} className="habit-card animate-slide-in relative overflow-hidden">
      {/* Particle Effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle animate-particle-burst"
          style={{
            left: particle.x,
            top: particle.y,
          }}
        />
      ))}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${getCategoryColor()} bg-opacity-20 flex items-center justify-center`}>
            <IconComponent className={`w-5 h-5 text-${getCategoryColor()}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              {name}
              <span className="text-lg">{icon}</span>
            </h3>
            <Badge variant="outline" className={`text-xs text-${getCategoryColor()}`}>
              {category}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {streak >= 3 && (
            <div className="streak-flame flex items-center gap-1">
              <Flame className="w-5 h-5 text-warning" />
              <span className="text-sm font-bold text-warning">{streak}</span>
            </div>
          )}
          
          <div className="text-right">
            <div className="text-sm text-accent font-bold">+{xp} XP</div>
            <div className="text-xs text-muted-foreground">per day</div>
          </div>
        </div>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-muted-foreground mb-1 font-medium">{day}</div>
            <button
              className={`calendar-day ${getDayStatus(weekData[index], index)} ${
                animatingDay === index ? 'animate-bounce-in animate-neon-flicker' : ''
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

      {/* Enhanced Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Weekly Progress</span>
          <span className="font-bold text-card-foreground animate-count-up">
            {completedDays}/7 days • {completedDays * xp} XP earned
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`xp-bar h-3 transition-all duration-700 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {progressPercentage >= 70 && (
            <div className="absolute -top-1 -right-1">
              <Star className="w-4 h-4 text-accent animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {progressPercentage >= 70 && (
          <Badge className="celebration-badge animate-bounce-in text-xs">
            🎉 Week Champion
          </Badge>
        )}
        {streak >= 7 && (
          <Badge className="celebration-badge animate-bounce-in text-xs">
            🔥 Fire Streak
          </Badge>
        )}
        {completedDays === 7 && (
          <Badge className="celebration-badge animate-bounce-in text-xs">
            🏆 Perfect Week
          </Badge>
        )}
      </div>
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