import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardsGrid } from "@/components/cards/cards-grid";
import { AddCardModal } from "@/components/cards/add-card-modal";
import { Pagination } from "@/components/common/pagination";
import { ProtectedRoute } from "@/components/layout/protected-route";
import type { Card, UserCard } from "@/types";
import { api } from "@/lib/axios";

function MyCardsContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);

  const { data: cardsData, isLoading, refetch } = useQuery({
    queryKey: ["/me/cards", currentPage, searchQuery, category, sortBy],
    queryFn: async () => {
      const response = await api.get<{ data: (UserCard & { card: Card })[]; meta: any }>("/me/cards", {
        params: {
          page: currentPage,
          rpp: 20,
          search: searchQuery,
          category: category !== "all" ? category : undefined,
          sort: sortBy,
        }
      });
      return response.data;
    },
  });

  const userCards = cardsData?.data || [];
  const cards = userCards.map(uc => uc.card);
  const meta = cardsData?.meta || { page: 1, totalPages: 1, total: 0 };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Collection</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your trading cards ({meta.total} cards)
            </p>
          </div>
          <Button
            onClick={() => setAddCardModalOpen(true)}
            className="mt-4 md:mt-0 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Card</span>
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
                placeholder="Search your cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="pokemon">Pokemon</SelectItem>
              <SelectItem value="magic">Magic: The Gathering</SelectItem>
              <SelectItem value="yugioh">Yu-Gi-Oh!</SelectItem>
              <SelectItem value="baseball">Baseball</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Sort by Date</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="rarity">Sort by Rarity</SelectItem>
              <SelectItem value="condition">Sort by Condition</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardsGrid
            cards={cards}
            userCards={userCards}
            isLoading={isLoading}
            emptyMessage={searchQuery ? "No cards found matching your search." : "No cards in your collection yet. Add some cards to get started!"}
          />
        </motion.div>

        {/* Load More / Pagination */}
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

        <AddCardModal
          isOpen={addCardModalOpen}
          onClose={() => {
            setAddCardModalOpen(false);
            refetch();
          }}
        />
      </div>
    </div>
  );
}

export default function MyCards() {
  return (
    <ProtectedRoute>
      <MyCardsContent />
    </ProtectedRoute>
  );
}
