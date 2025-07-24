import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradesGrid } from "@/components/trades/trades-grid";
import { Pagination } from "@/components/common/pagination";
import { useTradesStore } from "@/store/trades";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import type { TradeWithCards } from "@/types";
import { api } from "@/lib/axios";

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();
  const { pagination } = useTradesStore();

  const { data: tradesData, isLoading } = useQuery({
    queryKey: ["/trades", currentPage],
    queryFn: async () => {
      const response = await api.get<{ data: TradeWithCards[]; meta: any }>("/trades", {
        params: { page: currentPage, rpp: 12 }
      });
      return response.data;
    },
  });

  const trades = tradesData?.data || [];
  const meta = tradesData?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Trade Premium
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}Collectible Cards
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the ultimate marketplace for trading card enthusiasts. Discover, collect, and trade rare cards with collectors worldwide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Button size="lg" className="transform hover:scale-105 transition-all duration-200 shadow-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Trading
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setAuthModalOpen(true)}
                  className="transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="transform hover:scale-105 transition-all duration-200"
              >
                Browse Cards
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary">50k+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Cards</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary">12k+</div>
              <div className="text-gray-600 dark:text-gray-400">Traders</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary">89%</div>
              <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Support</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Trades */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Trades</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Discover the hottest trades happening now</p>
          </motion.div>

          <TradesGrid
            trades={trades}
            isLoading={isLoading}
            emptyMessage="No active trades at the moment. Be the first to create one!"
          />

          {meta.totalPages > 1 && (
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
              className="mt-12"
            />
          )}
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
