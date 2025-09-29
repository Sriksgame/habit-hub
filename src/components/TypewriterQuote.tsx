import { useState, useEffect } from "react";

interface TypewriterQuoteProps {
  quotes: string[];
}

export const TypewriterQuote = ({ quotes }: TypewriterQuoteProps) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentQuote = quotes[currentQuoteIndex];

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        if (displayedText.length < currentQuote.length) {
          setDisplayedText(currentQuote.slice(0, displayedText.length + 1));
        } else {
          setIsTyping(false);
          // Start next quote after 3 seconds
          setTimeout(() => {
            setDisplayedText("");
            setIsTyping(true);
            setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
          }, 3000);
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [displayedText, isTyping, currentQuote, quotes.length]);

  return (
    <div className="category-panel animate-glow-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-accent animate-pulse"></div>
        <h3 className="text-lg font-semibold text-accent">Daily Motivation</h3>
      </div>
      <div className="min-h-[60px] flex items-center">
        <p className="text-foreground text-lg font-medium typewriter">
          "{displayedText}"
        </p>
      </div>
    </div>
  );
};