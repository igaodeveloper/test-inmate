import { CardItem } from "./card-item";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import type { Card, UserCard } from "@/types";

interface CardsGridProps {
  cards: Card[];
  userCards?: UserCard[];
  isLoading?: boolean;
  onViewCard?: (card: Card) => void;
  onEditCard?: (card: Card) => void;
  emptyMessage?: string;
}

export function CardsGrid({
  cards,
  userCards = [],
  isLoading = false,
  onViewCard,
  onEditCard,
  emptyMessage = "No cards found",
}: CardsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {cards.map((card) => {
        const userCard = userCards.find(uc => uc.cardId === card.id);
        return (
          <CardItem
            key={card.id}
            card={card}
            userCard={userCard}
            onView={onViewCard}
            onEdit={onEditCard}
          />
        );
      })}
    </div>
  );
}
