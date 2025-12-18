import { useState, useEffect } from "react";
import { Filter, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface VideoFilterSheetProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function VideoFilterSheet({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: VideoFilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState(selectedCategory);

  // Sync temp state when sheet opens
  useEffect(() => {
    if (isOpen) {
      setTempCategory(selectedCategory);
    }
  }, [isOpen, selectedCategory]);

  const handleApply = () => {
    onCategoryChange(tempCategory);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempCategory("All");
    onCategoryChange("All");
    setIsOpen(false);
  };

  const activeFilterCount = selectedCategory !== "All" ? 1 : 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "relative gap-2 min-w-[100px] h-11 text-sm font-medium",
            "border-2 transition-all duration-200",
            activeFilterCount > 0 
              ? "border-primary bg-primary/10 text-primary" 
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-2xl">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-foreground">
              Filter Videos
            </SheetTitle>
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Category
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => {
                const isSelected = tempCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setTempCategory(category)}
                    className={cn(
                      "flex items-center justify-between w-full p-4 rounded-xl text-left transition-all duration-200",
                      "border-2 active:scale-[0.98]",
                      isSelected 
                        ? "border-primary bg-primary/10 text-foreground" 
                        : "border-border bg-card/50 text-muted-foreground hover:border-primary/30 hover:bg-card"
                    )}
                  >
                    <span className={cn(
                      "font-medium",
                      isSelected && "text-foreground"
                    )}>
                      {category}
                    </span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="pt-4 pb-6 border-t border-border space-y-3">
          <Button 
            onClick={handleApply}
            className="w-full h-12 text-base font-semibold"
          >
            Apply Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default VideoFilterSheet;
