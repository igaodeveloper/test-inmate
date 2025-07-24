import { useState } from "react";
import { X, PlusCircle, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useTradesStore } from "@/store/trades";
import { useCardsStore } from "@/store/cards";
import { createTradeSchema, type CreateTradeData, type Card, type UserCard } from "@/types";
import { api } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

interface CreateTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTradeModal({ isOpen, onClose }: CreateTradeModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [offeringCards, setOfferingCards] = useState<Card[]>([]);
  const [receivingCards, setReceivingCards] = useState<Card[]>([]);
  const [activeTab, setActiveTab] = useState<"offering" | "receiving">("offering");

  const { createTrade } = useTradesStore();
  const { userCards } = useCardsStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTradeData>({
    resolver: zodResolver(createTradeSchema),
  });

  // Fetch user's cards for offering
  const { data: myCards } = useQuery({
    queryKey: ["/me/cards"],
    queryFn: async () => {
      const response = await api.get<UserCard[]>("/me/cards");
      return response.data;
    },
  });

  // Search all cards for receiving
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["/cards", "search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await api.get<Card[]>(`/cards?search=${encodeURIComponent(searchQuery)}`);
      return response.data;
    },
    enabled: searchQuery.length > 2 && activeTab === "receiving",
  });

  const handleCardSelect = (card: Card) => {
    if (activeTab === "offering") {
      if (!offeringCards.find(c => c.id === card.id)) {
        setOfferingCards([...offeringCards, card]);
      }
    } else {
      if (!receivingCards.find(c => c.id === card.id)) {
        setReceivingCards([...receivingCards, card]);
      }
    }
  };

  const handleCardRemove = (cardId: number, type: "offering" | "receiving") => {
    if (type === "offering") {
      setOfferingCards(offeringCards.filter(c => c.id !== cardId));
    } else {
      setReceivingCards(receivingCards.filter(c => c.id !== cardId));
    }
  };

  const onSubmit = async (data: CreateTradeData) => {
    try {
      const tradeData = {
        ...data,
        offeringCards: offeringCards.map(c => c.id),
        receivingCards: receivingCards.map(c => c.id),
      };

      await createTrade(tradeData);
      toast({
        title: "Trade Created",
        description: "Your trade has been created successfully.",
      });
      handleClose();
    } catch (error) {
      // Error is handled by the axios interceptor
    }
  };

  const handleClose = () => {
    reset();
    setOfferingCards([]);
    setReceivingCards([]);
    setSearchQuery("");
    setActiveTab("offering");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Create New Trade</DialogTitle>
        <DialogDescription className="sr-only">Create a new trade offer by selecting cards to offer and cards you want in return</DialogDescription>
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Trade</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setActiveTab("offering")}
                className={`py-2 px-4 font-medium transition-colors ${
                  activeTab === "offering"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Cards I'm Offering ({offeringCards.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("receiving")}
                className={`py-2 px-4 font-medium transition-colors ${
                  activeTab === "receiving"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Cards I Want ({receivingCards.length})
              </button>
            </div>

            {/* Offering Section */}
            {activeTab === "offering" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Cards from Your Collection
                </h3>

                {/* Selected Offering Cards */}
                {offeringCards.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {offeringCards.map((card) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                          {card.imageUrl && (
                            <img
                              src={card.imageUrl}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <p className="text-xs mt-1 truncate">{card.name}</p>
                        <button
                          type="button"
                          onClick={() => handleCardRemove(card.id, "offering")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* My Cards Grid */}
                <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {myCards && myCards.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {myCards.map((userCard) => (
                        <motion.div
                          key={userCard.id}
                          whileHover={{ scale: 1.05 }}
                          className="cursor-pointer"
                          onClick={() => handleCardSelect(userCard as any)} // Note: API might return different structure
                        >
                          <div className="w-full h-20 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                            {/* Note: userCard might need to be joined with card data */}
                            <div className="w-full h-full flex items-center justify-center text-xs">
                              Card #{userCard.cardId}
                            </div>
                          </div>
                          <p className="text-xs mt-1 truncate">Card #{userCard.cardId}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      No cards in your collection
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Receiving Section */}
            {activeTab === "receiving" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Search for Cards You Want
                </h3>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search for cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Selected Receiving Cards */}
                {receivingCards.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {receivingCards.map((card) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                          {card.imageUrl && (
                            <img
                              src={card.imageUrl}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <p className="text-xs mt-1 truncate">{card.name}</p>
                        <button
                          type="button"
                          onClick={() => handleCardRemove(card.id, "receiving")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Search Results */}
                {searchQuery.length > 2 && (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <LoadingSpinner />
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                        {searchResults.map((card) => (
                          <motion.div
                            key={card.id}
                            whileHover={{ scale: 1.05 }}
                            className="cursor-pointer"
                            onClick={() => handleCardSelect(card)}
                          >
                            <div className="w-full h-20 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                              {card.imageUrl && (
                                <img
                                  src={card.imageUrl}
                                  alt={card.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <p className="text-xs mt-1 truncate">{card.name}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No cards found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <Label htmlFor="description">Trade Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any additional details about this trade..."
                {...register("description")}
                rows={3}
              />
            </div>

            {/* Validation Errors */}
            {(errors.offeringCards || errors.receivingCards) && (
              <div className="text-red-500 text-sm">
                {errors.offeringCards?.message || errors.receivingCards?.message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={offeringCards.length === 0 || receivingCards.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Trade
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
