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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <TradeSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trades.map((trade) => (
        <TradeCard
          key={trade.id}
          trade={trade}
          onView={onViewTrade}
          onDelete={onDeleteTrade}
        />
      ))}
    </div>
  );
}
