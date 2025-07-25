import { useEffect } from 'react';
import { useApi } from '@/hooks/use-api';
import { cardsService } from '@/services/cards';
import { Card } from '@/components/cards/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface CardsListProps {
  userId?: number;
  onCardClick?: (cardId: number) => void;
  showAddButton?: boolean;
}

export function CardsList({ userId, onCardClick, showAddButton = false }: CardsListProps) {
  const { toast } = useToast();
  const { data, error, isLoading, execute: fetchCards } = useApi(
    userId ? cardsService.getUserCards : cardsService.getAll
  );

  useEffect(() => {
    fetchCards(1, 10);
  }, [fetchCards]);

  const handleAddCard = async (cardId: number) => {
    try {
      await cardsService.addCardToUser(cardId);
      toast({
        title: 'Success',
        description: 'Card added to your collection',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add card to collection',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Error loading cards: {error.message}</p>
        <Button onClick={() => fetchCards(1, 10)}>Retry</Button>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No cards found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.data.map((card) => (
          <Card 
            key={card.id} 
            card={card} 
            onView={onCardClick}
            onAdd={showAddButton ? handleAddCard : undefined}
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          disabled={!data.meta || data.meta.page === 1}
          onClick={() => fetchCards((data.meta?.page || 1) - 1, 10)}
        >
          Previous
        </Button>
        
        <span className="text-sm text-gray-600">
          Page {data.meta?.page} of {data.meta?.totalPages}
        </span>
        
        <Button
          variant="outline"
          disabled={!data.meta || data.meta.page >= data.meta.totalPages}
          onClick={() => fetchCards((data.meta?.page || 1) + 1, 10)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
