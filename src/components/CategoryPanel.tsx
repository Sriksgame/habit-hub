import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedHabitCard } from "./EnhancedHabitCard";
import { AddHabitDialog } from "./AddHabitDialog";

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  weekData: boolean[];
  xp: number;
}

interface CategoryPanelProps {
  category: string;
  habits: Habit[];
  color: string;
  icon: string;
  onToggleDay: (habitId: string, dayIndex: number) => void;
  onAddHabit: (name: string, category: string) => void;
}

export const CategoryPanel = ({ 
  category, 
  habits, 
  color, 
  icon, 
  onToggleDay, 
  onAddHabit 
}: CategoryPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.weekData[new Date().getDay()]).length;
  const categoryXP = habits.reduce((acc, habit) => 
    acc + (habit.weekData.filter(Boolean).length * habit.xp), 0
  );

  return (
    <div className="category-panel">
      <div 
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
          <div className={`w-8 h-8 rounded-lg bg-${color} bg-opacity-20 flex items-center justify-center`}>
            <span className="text-lg">{icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">
              {category}
            </h2>
            <div className="text-sm text-muted-foreground">
              {completedToday}/{totalHabits} completed today • {categoryXP} XP
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full bg-${color} bg-opacity-20`}>
            <span className={`text-sm font-medium text-${color}`}>
              {totalHabits} habits
            </span>
          </div>
          <AddHabitDialog 
            onAddHabit={(name) => onAddHabit(name, category)}
            category={category}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-slide-in">
          {habits.map((habit, index) => (
            <div 
              key={habit.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EnhancedHabitCard
                id={habit.id}
                name={habit.name}
                icon={habit.icon}
                category={habit.category}
                weekData={habit.weekData}
                xp={habit.xp}
                onToggleDay={onToggleDay}
              />
            </div>
          ))}
          
          {habits.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
              <p className="text-muted-foreground mb-3">
                No {category.toLowerCase()} habits yet
              </p>
              <AddHabitDialog 
                onAddHabit={(name) => onAddHabit(name, category)}
                category={category}
              >
                <Button variant="outline" className="glow-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First {category} Habit
                </Button>
              </AddHabitDialog>
            </div>
          )}
        </div>
      )}
    </div>
  );
};