import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradesGrid } from "@/components/trades/trades-grid";
import { CreateTradeModal } from "@/components/trades/create-trade-modal";
import { Pagination } from "@/components/common/pagination";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { useTradesStore } from "@/store/trades";
import type { TradeWithCards } from "@/types";
import { api } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

function MyTradesContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [createTradeModalOpen, setCreateTradeModalOpen] = useState(false);

  const { deleteTrade } = useTradesStore();

  const { data: tradesData, isLoading, refetch } = useQuery({
    queryKey: ["/me/trades", currentPage, searchQuery, status, sortBy],
    queryFn: async () => {
      const response = await api.get<{ data: TradeWithCards[]; meta: any }>("/me/trades", {
        params: {
          page: currentPage,
          rpp: 12,
          search: searchQuery,
          status: status !== "all" ? status : undefined,
          sort: sortBy,
        }
      });
      return response.data;
    },
  });

  const trades = tradesData?.data || [];
  const meta = tradesData?.meta || { page: 1, totalPages: 1, total: 0 };

  const handleDeleteTrade = async (tradeId: number) => {
    if (confirm("Are you sure you want to delete this trade?")) {
      try {
        await deleteTrade(tradeId);
        toast({
          title: "Trade Deleted",
          description: "Your trade has been deleted successfully.",
        });
        refetch();
      } catch (error) {
        // Error is handled by the axios interceptor
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, status, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Trades</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your trading offers ({meta.total} trades)
            </p>
          </div>
          <Button
            onClick={() => setCreateTradeModalOpen(true)}
            className="mt-4 md:mt-0 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Trade</span>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8"
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search your trades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="cards">By Card Count</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Trades Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TradesGrid
            trades={trades}
            isLoading={isLoading}
            onDeleteTrade={handleDeleteTrade}
            emptyMessage={searchQuery ? "No trades found matching your search." : "You haven't created any trades yet. Create your first trade to get started!"}
          />
        </motion.div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
              className="mt-12"
            />
          </motion.div>
        )}

        <CreateTradeModal
          isOpen={createTradeModalOpen}
          onClose={() => {
            setCreateTradeModalOpen(false);
            refetch();
          }}
        />
      </div>
    </div>
  );
}

export default function MyTrades() {
  return (
    <ProtectedRoute>
      <MyTradesContent />
    </ProtectedRoute>
  );
}
