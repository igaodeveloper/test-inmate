import { useState } from "react";
import { X, Search, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCardsStore } from "@/store/cards";
import { addCardSchema, type AddCardData, type Card } from "@/types";
import { api } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { addCardToUser } = useCardsStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddCardData>({
    resolver: zodResolver(addCardSchema),
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["/cards", "search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await api.get<Card[]>(`/cards?search=${encodeURIComponent(searchQuery)}`);
      return response.data;
    },
    enabled: searchQuery.length > 2,
  });

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    setValue("cardId", card.id);
  };

  const onSubmit = async (data: AddCardData) => {
    try {
      await addCardToUser(data);
      toast({
        title: "Card Added",
        description: "The card has been added to your collection.",
      });
      reset();
      setSelectedCard(null);
      setSearchQuery("");
      onClose();
    } catch (error) {
      // Error is handled by the axios interceptor
    }
  };

  const handleClose = () => {
    reset();
    setSelectedCard(null);
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Add Card to Collection</DialogTitle>
        <DialogDescription className="sr-only">Search for cards and add them to your personal collection</DialogDescription>
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Card to Collection</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Card Search */}
            <div>
              <Label htmlFor="search">Search for Cards</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by card name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery.length > 2 && (
              <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <LoadingSpinner />
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="space-y-2 p-2">
                    {searchResults.map((card) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedCard?.id === card.id
                            ? "bg-primary/10 border border-primary"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => handleCardSelect(card)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-16 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0">
                            {card.imageUrl && (
                              <img
                                src={card.imageUrl}
                                alt={card.name}
                                className="w-full h-full object-cover rounded"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {card.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {card.description}
                            </p>
                            {card.rarity && (
                              <span className="inline-block bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded mt-1">
                                {card.rarity}
                              </span>
                            )}
                          </div>
                        </div>
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

            {/* Selected Card */}
            <AnimatePresence>
              {selectedCard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Selected Card</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-20 h-28 bg-gray-200 dark:bg-gray-600 rounded">
                      {selectedCard.imageUrl && (
                        <img
                          src={selectedCard.imageUrl}
                          alt={selectedCard.name}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{selectedCard.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCard.description}</p>
                    </div>
                  </div>

                  {/* Condition Select */}
                  <div>
                    <Label htmlFor="condition">Card Condition</Label>
                    <Select onValueChange={(value) => setValue("condition", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mint">Mint (M)</SelectItem>
                        <SelectItem value="near-mint">Near Mint (NM)</SelectItem>
                        <SelectItem value="lightly-played">Lightly Played (LP)</SelectItem>
                        <SelectItem value="moderately-played">Moderately Played (MP)</SelectItem>
                        <SelectItem value="heavily-played">Heavily Played (HP)</SelectItem>
                        <SelectItem value="damaged">Damaged (D)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.cardId && (
              <p className="text-red-500 text-sm">{errors.cardId.message}</p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedCard || isSubmitting}>
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Collection
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
