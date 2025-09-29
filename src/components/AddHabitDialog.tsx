import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddHabitDialogProps {
  onAddHabit: (name: string, category?: string, icon?: string) => void;
  category?: string;
  children?: React.ReactNode;
}

const HABIT_ICONS = [
  "🏃", "📚", "🧘", "💧", "🍎", "💤", "💪", "🎯", "✍️", "🎵"
];

const CATEGORIES = ["Health", "Work", "Learning"];

export const AddHabitDialog = ({ onAddHabit, category, children }: AddHabitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "Health");
  const [selectedIcon, setSelectedIcon] = useState("🎯");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName.trim(), selectedCategory, selectedIcon);
      setHabitName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            size="sm" 
            className="rounded-full w-10 h-10 p-0 glow-button"
          >
            <Plus className="w-5 h-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-card-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-card-foreground">
            Add New Habit {category && `to ${category}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="habit-name" className="text-sm font-medium text-card-foreground">
              Habit Name
            </Label>
            <Input
              id="habit-name"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water"
              className="mt-1 bg-muted border-border"
              autoFocus
            />
          </div>

          {!category && (
            <div>
              <Label className="text-sm font-medium text-card-foreground">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1 bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-card-border">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-card-foreground">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-card-foreground mb-2 block">
              Choose Icon
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {HABIT_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`w-10 h-10 rounded-lg border transition-all duration-200 flex items-center justify-center text-lg hover:scale-110 ${
                    selectedIcon === icon 
                      ? 'border-primary bg-primary/20 shadow-lg' 
                      : 'border-border bg-muted hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!habitName.trim()} className="glow-button">
              Add Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};