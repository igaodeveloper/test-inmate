import { useState } from "react";
import { Eye, Edit } from "lucide-react";
import { motion } from "framer-motion";
import type { Card, UserCard } from "@/types";
import { Button } from "@/components/ui/button";

interface CardItemProps {
  card: Card;
  userCard?: UserCard;
  onView?: (card: Card) => void;
  onEdit?: (card: Card) => void;
}

export function CardItem({ card, userCard, onView, onEdit }: CardItemProps) {
  const [imageError, setImageError] = useState(false);

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary':
        return 'from-yellow-400 to-yellow-500 text-yellow-900';
      case 'mythic':
        return 'from-purple-400 to-purple-500 text-purple-900';
      case 'ultra rare':
        return 'from-blue-400 to-blue-500 text-blue-900';
      case 'rare':
        return 'from-green-400 to-green-500 text-green-900';
      case 'uncommon':
        return 'from-gray-400 to-gray-500 text-gray-900';
      default:
        return 'from-gray-300 to-gray-400 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative">
        {!imageError && card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            {onView && (
              <Button
                size="icon"
                className="bg-white text-gray-900 shadow-lg hover:bg-gray-100"
                onClick={() => onView(card)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                size="icon"
                className="bg-white text-gray-900 shadow-lg hover:bg-gray-100"
                onClick={() => onEdit(card)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {card.rarity && (
          <span className={`absolute top-2 left-2 bg-gradient-to-r ${getRarityColor(card.rarity)} px-2 py-1 rounded-full text-xs font-bold`}>
            {card.rarity}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {card.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
          {card.description || card.category}
        </p>
        <div className="flex items-center justify-between">
          {userCard?.condition && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {userCard.condition}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(card.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
