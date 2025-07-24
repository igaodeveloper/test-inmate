import { motion } from "framer-motion";
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
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <CardSkeleton />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (cards.length === 0) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.p 
          className="text-gray-500 dark:text-gray-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {emptyMessage}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {cards.map((card, index) => {
        const userCard = userCards.find(uc => uc.cardId === card.id);
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.05, 
              duration: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <CardItem
              card={card}
              userCard={userCard}
              onView={onViewCard}
              onEdit={onEditCard}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
