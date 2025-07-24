import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradesGrid } from "@/components/trades/trades-grid";
import { Pagination } from "@/components/common/pagination";
import type { TradeWithCards } from "@/types";
import { api } from "@/lib/axios";

export default function Marketplace() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { data: tradesData, isLoading } = useQuery({
    queryKey: ["/trades", "marketplace", currentPage, searchQuery, sortBy],
    queryFn: async () => {
      const response = await api.get<{ data: TradeWithCards[]; meta: any }>("/trades", {
        params: {
          page: currentPage,
          rpp: 12,
          search: searchQuery,
          sort: sortBy,
        }
      });
      return response.data;
    },
  });

  const trades = tradesData?.data || [];
  const meta = tradesData?.meta || { page: 1, totalPages: 1, total: 0 };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Marketplace</h1>
          <p className="text-gray-600 dark:text-gray-300">Browse all available trades</p>
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
                placeholder="Search trades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-cards">Most Cards</SelectItem>
              <SelectItem value="least-cards">Least Cards</SelectItem>
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
            emptyMessage={searchQuery ? "No trades found matching your search." : "No trades available."}
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
      </div>
    </div>
  );
}
