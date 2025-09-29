import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardStatsProps {
  habits: Array<{
    id: string;
    name: string;
    category: string;
    weekData: boolean[];
    xp: number;
  }>;
  totalXP: number;
  level: number;
  xpToNextLevel: number;
}

export const DashboardStats = ({ habits, totalXP, level, xpToNextLevel }: DashboardStatsProps) => {
  // Category completion data for pie chart
  const categoryData = ['Health', 'Work', 'Learning'].map(category => {
    const categoryHabits = habits.filter(h => h.category === category);
    const totalDays = categoryHabits.length * 7;
    const completedDays = categoryHabits.reduce((acc, h) => 
      acc + h.weekData.filter(Boolean).length, 0);
    const percentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
    
    return {
      name: category,
      value: percentage,
      count: completedDays,
      total: totalDays
    };
  });

  // Weekly progress data for bar chart
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];
    const completedCount = habits.filter(h => h.weekData[i]).length;
    const xpEarned = habits
      .filter(h => h.weekData[i])
      .reduce((acc, h) => acc + h.xp, 0);
    
    return {
      day: dayName,
      completed: completedCount,
      xp: xpEarned,
      total: habits.length
    };
  });

  const COLORS = {
    Health: 'hsl(var(--success))',
    Work: 'hsl(var(--primary))', 
    Learning: 'hsl(var(--accent))'
  };

  const levelProgress = ((totalXP % 1000) / 1000) * 100;

  return (
    <div className="space-y-6">
      {/* XP and Level Display */}
      <div className="habit-card">
        <div className="text-center space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-accent animate-glow-pulse">
              Level {level}
            </h2>
            <p className="text-muted-foreground">
              {totalXP.toLocaleString()} XP Total
            </p>
          </div>
          
          {/* Circular Level Progress */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#levelGradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - levelProgress / 100)}`}
                strokeLinecap="round"
                className="progress-ring"
              />
              <defs>
                <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-card-foreground">
                  {Math.round(levelProgress)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  to Level {level + 1}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {xpToNextLevel} XP to next level
          </div>
        </div>
      </div>

      {/* Category Distribution Pie Chart */}
      <div className="habit-card">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Category Completion
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${Math.round(value)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name) => [
                  `${Math.round(value)}%`, 
                  name
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Progress Bar Chart */}
      <div className="habit-card">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Daily XP This Week
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                formatter={(value: number, name) => [
                  name === 'xp' ? `${value} XP` : `${value} habits`,
                  name === 'xp' ? 'XP Earned' : 'Completed'
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="xp" 
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" />
                  <stop offset="95%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};