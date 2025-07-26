import { motion } from "framer-motion";
import React from 'react';
import { Card } from './card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Card as CardType } from '@/services/cards';

// Define the props interface for the CardsGrid component
interface CardsGridProps {
  cards: CardType[];
  isLoading?: boolean;
  onViewCard?: (cardId: string) => void;
  onAddCard?: (cardId: string) => void;
  emptyMessage?: string;
  showActions?: boolean;
}

/**
 * A responsive grid layout for displaying trading cards
 */
export function CardsGrid({
  cards = [],
  isLoading = false,
  onViewCard,
  onAddCard,
  emptyMessage = 'No cards found',
  showActions = true,
}: CardsGridProps) {
  // Show loading skeleton when data is being fetched
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="space-y-2">
            <Skeleton className="w-full h-48 rounded-lg" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        ))}
      </div>
    );
  }

  // Show empty state when no cards are available
  if (!cards.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card) => (
        <div key={card.id} className="h-full">
          <Card
            card={card}
            onView={onViewCard ? () => onViewCard(card.id) : undefined}
            onAdd={onAddCard ? () => onAddCard(card.id) : undefined}
            showActions={showActions}
          />
        </div>
      ))}
    </div>
  );
}
