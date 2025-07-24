import { motion } from "framer-motion";
import { TradeCard } from "./trade-card";
import { TradeSkeleton } from "@/components/ui/loading-skeleton";
import type { TradeWithCards } from "@/types";

interface TradesGridProps {
  trades: TradeWithCards[];
  isLoading?: boolean;
  onViewTrade?: (trade: TradeWithCards) => void;
  onDeleteTrade?: (tradeId: number) => void;
  emptyMessage?: string;
}

export function TradesGrid({
  trades,
  isLoading = false,
  onViewTrade,
  onDeleteTrade,
  emptyMessage = "No trades found",
}: TradesGridProps) {
  if (isLoading) {
    return (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <TradeSkeleton />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (trades.length === 0) {
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {trades.map((trade, index) => (
        <motion.div
          key={trade.id}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: index * 0.1, 
            duration: 0.5,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <TradeCard
            trade={trade}
            onView={onViewTrade}
            onDelete={onDeleteTrade}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
