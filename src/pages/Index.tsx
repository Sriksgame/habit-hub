import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryPanel } from "@/components/CategoryPanel";
import { DashboardStats } from "@/components/DashboardStats";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { TypewriterQuote } from "@/components/TypewriterQuote";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, BookOpen, Heart, BarChart3, Calendar } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  weekData: boolean[];
  xp: number;
}

const motivationalQuotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "Your habits shape your identity, and your identity shapes your future.", 
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "The secret to getting ahead is getting started.",
  "Small daily improvements lead to stunning results.",
  "Discipline is choosing between what you want now and what you want most.",
  "You are never too old to set another goal or dream a new dream."
];

const CATEGORIES = [
  { name: "Health", icon: "🏥", color: "success" },
  { name: "Work", icon: "💼", color: "primary" },
  { name: "Learning", icon: "📚", color: "accent" }
];

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Drink 8 glasses of water",
      icon: "💧",
      category: "Health",
      weekData: [true, true, false, true, true, false, true],
      xp: 10
    },
    {
      id: "2", 
      name: "Read for 30 minutes",
      icon: "📚",
      category: "Learning",
      weekData: [true, true, true, false, true, true, false],
      xp: 15
    },
    {
      id: "3",
      name: "Exercise for 20 minutes",
      icon: "🏃",
      category: "Health", 
      weekData: [false, true, true, true, false, true, true],
      xp: 20
    },
    {
      id: "4",
      name: "Complete daily tasks",
      icon: "✅",
      category: "Work",
      weekData: [true, false, true, true, true, false, true],
      xp: 12
    }
  ]);

  const totalXP = habits.reduce((acc, habit) => 
    acc + (habit.weekData.filter(Boolean).length * habit.xp), 0);
  const level = Math.floor(totalXP / 1000) + 1;
  const xpToNextLevel = 1000 - (totalXP % 1000);

  const handleToggleDay = (habitId: string, dayIndex: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? {
            ...habit,
            weekData: habit.weekData.map((day, index) => 
              index === dayIndex ? !day : day
            )
          }
        : habit
    ));
  };

  const handleAddHabit = (name: string, category: string = "Health", icon: string = "🎯") => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      icon,
      category,
      weekData: [false, false, false, false, false, false, false],
      xp: 10
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const getHabitsByCategory = (category: string) => 
    habits.filter(habit => habit.category === category);

  const totalCompletedToday = habits.filter(h => h.weekData[new Date().getDay()]).length;
  const completionRate = habits.length > 0 ? (totalCompletedToday / habits.length) * 100 : 0;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cyberpunk Header */}
        <header className="text-center space-y-6 animate-slide-in">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow-pulse">
              HABIT NEXUS
            </h1>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <Badge className="celebration-badge">
                Level {level}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">
                {totalXP.toLocaleString()} XP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">
                {Math.round(completionRate)}% Today
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-destructive" />
              <span className="text-muted-foreground">
                {habits.length} Active Habits
              </span>
            </div>
          </div>
        </header>

        {/* Motivation Widget */}
        <TypewriterQuote quotes={motivationalQuotes} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="habits" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-card-border">
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Habits
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="habits" className="space-y-8 mt-8">
            <div className="space-y-6">
              {CATEGORIES.map((category) => (
                <CategoryPanel
                  key={category.name}
                  category={category.name}
                  habits={getHabitsByCategory(category.name)}
                  color={category.color}
                  icon={category.icon}
                  onToggleDay={handleToggleDay}
                  onAddHabit={handleAddHabit}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <DashboardStats 
                habits={habits}
                totalXP={totalXP}
                level={level}
                xpToNextLevel={xpToNextLevel}
              />
              
              {/* Global Achievements */}
              <div className="space-y-6">
                <div className="habit-card">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Global Achievements
                  </h3>
                  <div className="space-y-3">
                    {level >= 2 && (
                      <Badge className="celebration-badge animate-bounce-in w-full justify-center">
                        🎯 Habit Tracker - Reached Level {level}
                      </Badge>
                    )}
                    {totalXP >= 500 && (
                      <Badge className="celebration-badge animate-bounce-in w-full justify-center">
                        💪 XP Master - Earned 500+ XP
                      </Badge>
                    )}
                    {habits.some(h => h.weekData.filter(Boolean).length === 7) && (
                      <Badge className="celebration-badge animate-bounce-in w-full justify-center">
                        🏆 Perfect Week - Completed all 7 days
                      </Badge>
                    )}
                    {completionRate === 100 && (
                      <Badge className="celebration-badge animate-bounce-in w-full justify-center">
                        🔥 Today's Champion - 100% completion
                      </Badge>
                    )}
                    {habits.length >= 5 && (
                      <Badge className="celebration-badge animate-bounce-in w-full justify-center">
                        📈 Habit Collector - 5+ active habits
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="habit-card">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-success">
                        {habits.reduce((acc, h) => acc + h.weekData.filter(Boolean).length, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Completed This Week</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-accent">
                        {Math.max(...habits.map(h => 
                          h.weekData.reduce((streak, day, i) => 
                            day ? streak + 1 : 0, 0)
                        ), 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Best Streak</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(habits.reduce((acc, h) => 
                          acc + (h.weekData.filter(Boolean).length / 7), 0) / habits.length * 100) || 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">Average Completion</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-warning">
                        {habits.filter(h => h.weekData.filter(Boolean).length >= 5).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Strong Habits</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-8">
            <CalendarHeatmap habits={habits} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;