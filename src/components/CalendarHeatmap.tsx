import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarHeatmapProps {
  habits: Array<{
    id: string;
    name: string;
    weekData: boolean[];
  }>;
}

export const CalendarHeatmap = ({ habits }: CalendarHeatmapProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Generate 12 weeks of data (simulated for demo)
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    for (let week = 11; week >= 0; week--) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7) + day - today.getDay());
        
        // Simulate completion level (0-3)
        let level = 0;
        if (week >= 9) { // Current and recent weeks use actual data
          const dayIndex = day;
          const completedHabits = habits.filter(h => h.weekData[dayIndex]).length;
          level = Math.min(3, Math.floor((completedHabits / habits.length) * 4));
        } else {
          // Simulate historical data
          level = Math.floor(Math.random() * 4);
        }
        
        weekData.push({
          date: date.toISOString().split('T')[0],
          level,
          completedHabits: level * Math.ceil(habits.length / 3),
          totalHabits: habits.length
        });
      }
      data.push(weekData);
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="habit-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          12-Week Activity Heatmap
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map(level => (
              <div 
                key={level}
                className={`heatmap-cell level-${level}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <TooltipProvider>
        <div className="space-y-2">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-muted-foreground pl-8">
            {heatmapData.map((week, index) => {
              if (index % 4 === 0) {
                const month = new Date(week[0].date).getMonth();
                return (
                  <span key={index} className="w-4">
                    {monthNames[month]}
                  </span>
                );
              }
              return <span key={index} className="w-4"></span>;
            })}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-1">
              {['', 'M', '', 'W', '', 'F', ''].map((day, i) => (
                <div key={i} className="h-4 flex items-center justify-center w-6">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="flex gap-1">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <Tooltip key={day.date}>
                      <TooltipTrigger asChild>
                        <div
                          className={`heatmap-cell level-${day.level}`}
                          onClick={() => setSelectedDate(
                            selectedDate === day.date ? null : day.date
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-card border-card-border">
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-muted-foreground">
                            {day.completedHabits}/{day.totalHabits} habits completed
                          </div>
                          {day.level === 0 && (
                            <div className="text-destructive text-xs">No activity</div>
                          )}
                          {day.level === 3 && (
                            <div className="text-success text-xs">Perfect day! 🔥</div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="text-xs text-muted-foreground pt-2">
            Click on any day to see detailed activity
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};