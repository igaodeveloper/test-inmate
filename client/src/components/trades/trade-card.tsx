import { Eye, Trash2, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TradeWithCards } from "@/types";
import { useAuth } from "@/hooks/use-auth";

interface TradeCardProps {
  trade: TradeWithCards;
  onView?: (trade: TradeWithCards) => void;
  onDelete?: (tradeId: number) => void;
}

export function TradeCard({ trade, onView, onDelete }: TradeCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === trade.creatorId;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {trade.creator.username}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(trade.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(trade.status)}>
            {trade.status}
          </Badge>
        </div>

        {/* Offering Cards */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Offering</h3>
          <div className="flex space-x-2 overflow-x-auto">
            {trade.offeringCards.slice(0, 3).map((card) => (
              <div key={card.id} className="flex-shrink-0">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-16 h-20 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500">No img</span>
                  </div>
                )}
              </div>
            ))}
            {trade.offeringCards.length > 3 && (
              <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{trade.offeringCards.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Receiving Cards */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Wanting</h3>
          <div className="flex space-x-2 overflow-x-auto">
            {trade.receivingCards.slice(0, 3).map((card) => (
              <div key={card.id} className="flex-shrink-0">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-16 h-20 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500">No img</span>
                  </div>
                )}
              </div>
            ))}
            {trade.receivingCards.length > 3 && (
              <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{trade.receivingCards.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {trade.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {trade.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(trade)}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Button>

          {isOwner && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(trade.id)}
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
