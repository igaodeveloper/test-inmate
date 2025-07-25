import { Card as CardType } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus } from 'lucide-react';

interface CardProps {
  card: CardType;
  onView?: (cardId: number) => void;
  onAdd?: (cardId: number) => void;
}

export function Card({ card, onView, onAdd }: CardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'bg-gray-200 text-gray-800';
      case 'uncommon':
        return 'bg-green-100 text-green-800';
      case 'rare':
        return 'bg-blue-100 text-blue-800';
      case 'mythic':
        return 'bg-purple-100 text-purple-800';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Card Image */}
      <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No Image</span>
          </div>
        )}
        
        {/* Card Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          {onView && (
            <Button 
              variant="secondary" 
              size="icon"
              onClick={() => onView(card.id)}
              className="rounded-full w-10 h-10"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onAdd && (
            <Button 
              variant="default" 
              size="icon"
              onClick={() => onAdd(card.id)}
              className="rounded-full w-10 h-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{card.name}</h3>
          {card.rarity && (
            <Badge className={`text-xs ${getRarityColor(card.rarity)}`}>
              {card.rarity}
            </Badge>
          )}
        </div>
        
        {card.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {card.description}
          </p>
        )}
        
        {card.category && (
          <div className="mt-2">
            <span className="inline-block bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
              {card.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
