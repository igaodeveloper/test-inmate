import React from 'react';
import { Card as CardType } from '@/services/cards';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';

// Define button props to extend
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

interface CardProps {
  card: CardType;
  onView?: (cardId: string) => void;
  onAdd?: (cardId: string) => void;
  showActions?: boolean;
  className?: string;
}

// Create a custom button component with proper types
const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${
          variant === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
        } ${
          variant === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''
        } ${
          variant === 'outline' ? 'border border-input hover:bg-accent hover:text-accent-foreground' : ''
        } ${
          variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : ''
        } ${
          variant === 'link' ? 'text-primary underline-offset-4 hover:underline' : ''
        } ${
          size === 'default' ? 'h-10 py-2 px-4' : ''
        } ${
          size === 'sm' ? 'h-9 px-3 rounded-md' : ''
        } ${
          size === 'lg' ? 'h-11 px-8 rounded-md' : ''
        } ${
          size === 'icon' ? 'h-10 w-10' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
CustomButton.displayName = 'Button';

export function Card({ card, onView, onAdd, showActions = true, className = '' }: CardProps) {
  const handleView = () => {
    if (onView) onView(card.id);
  };

  const handleAdd = () => {
    if (onAdd) onAdd(card.id);
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
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            {onView && (
              <CustomButton 
                variant="secondary" 
                size="icon"
                onClick={handleView}
                className="rounded-full bg-white/90 hover:bg-white"
                aria-label="View card details"
              >
                <Eye className="w-4 h-4" />
              </CustomButton>
            )}
            {onAdd && (
              <CustomButton 
                variant="default" 
                size="icon"
                onClick={handleAdd}
                className="rounded-full"
                aria-label="Add to collection"
              >
                <Plus className="w-4 h-4" />
              </CustomButton>
            )}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
            {card.name}
          </h3>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
          {card.description}
        </p>
      </div>
    </div>
  );
}
