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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        rotateX: 2,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.5, 
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group perspective-1000"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <User className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <motion.div 
                className="font-semibold text-gray-900 dark:text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {trade.creator.username}
              </motion.div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(trade.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Badge className={getStatusColor(trade.status)}>
              {trade.status}
            </Badge>
          </motion.div>
        </div>

        {/* Offering Cards */}
        <div className="mb-4">
          <motion.h3 
            className="font-semibold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            Offering
          </motion.h3>
          <div className="flex space-x-2 overflow-x-auto">
            {trade.offeringCards.slice(0, 3).map((card, index) => (
              <motion.div 
                key={card.id} 
                className="flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  y: -5, 
                  scale: 1.05,
                  rotateY: 15,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-16 h-20 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300">
                    <span className="text-xs text-gray-500">No img</span>
                  </div>
                )}
              </motion.div>
            ))}
            {trade.offeringCards.length > 3 && (
              <motion.div 
                className="flex-shrink-0 w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  +{trade.offeringCards.length - 3}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Receiving Cards */}
        <div className="mb-4">
          <motion.h3 
            className="font-semibold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Wanting
          </motion.h3>
          <div className="flex space-x-2 overflow-x-auto">
            {trade.receivingCards.slice(0, 3).map((card, index) => (
              <motion.div 
                key={card.id} 
                className="flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  y: -5, 
                  scale: 1.05,
                  rotateY: -15,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-16 h-20 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300">
                    <span className="text-xs text-gray-500">No img</span>
                  </div>
                )}
              </motion.div>
            ))}
            {trade.receivingCards.length > 3 && (
              <motion.div 
                className="flex-shrink-0 w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  +{trade.receivingCards.length - 3}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Description */}
        {trade.description && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {trade.description}
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(trade)}
              className="flex items-center space-x-2 hover:bg-primary/5 transition-colors duration-300"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.2 }}
              >
                <Eye className="w-4 h-4" />
              </motion.div>
              <span>View Details</span>
            </Button>
          </motion.div>

          {isOwner && onDelete && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(trade.id)}
                className="flex items-center space-x-2 hover:bg-red-600 transition-colors duration-300"
              >
                <motion.div
                  whileHover={{ rotate: -15, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.div>
                <span>Delete</span>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
