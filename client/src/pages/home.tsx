import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-gray-800 dark:to-gray-900 py-16 overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 dark:bg-white/10 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 relative"
            >
              <motion.span
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 200 }}
                className="inline-block"
              >
                Trade Premium
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.7, duration: 0.8, type: "spring", stiffness: 200 }}
                className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0px 0px 8px rgba(79, 70, 229, 0.8)",
                  transition: { duration: 0.3 }
                }}
              >
                {" "}Collectible Cards
              </motion.span>
              {/* Sparkle Effects */}
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Sparkles className="w-8 h-8 text-primary/70" />
              </motion.div>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Join the ultimate marketplace for trading card enthusiasts. Discover, collect, and trade rare cards with collectors worldwide.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              {isAuthenticated ? (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                    </motion.div>
                    {t('navbar.myTrades')}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    size="lg"
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                    </motion.div>
                    {t('common.getStarted')}
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
                >
                  {t('home.browseCards')}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 transform rotate-12 scale-150"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.joinCommunity')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.communityDescription')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary">50k+</div>
              <div className="text-gray-600 dark:text-gray-400">{t('home.activeCards')}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <motion.div 
                className="text-3xl font-bold text-primary"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                12k+
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400">{t('home.traders')}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <motion.div 
                className="text-3xl font-bold text-primary"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                89%
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400">{t('home.successRate')}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <motion.div 
                className="text-3xl font-bold text-primary"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                24/7
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400">{t('home.support')}</div>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('home.featuredTrades')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('home.featuredTradesDescription')}</p>
          </motion.div>

          <TradesGrid
            trades={trades}
            isLoading={isLoading}
            emptyMessage={t('home.noTradesMessage')}
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
