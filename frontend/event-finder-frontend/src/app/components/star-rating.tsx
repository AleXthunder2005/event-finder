import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  showNumber = false, 
  reviewCount,
  interactive = false,
  onRate
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:fill-yellow-300 hover:text-yellow-300' : ''}`}
          onClick={() => interactive && onRate && onRate(i + 1)}
        />
      ))}
      {showNumber && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating}
          {reviewCount !== undefined && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}
