import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/custom-tabs';
import { CardsGrid } from '@/components/cards/cards-grid';
import { useAuthStore } from '@/store/auth';
import { cardService, type Card, type PaginatedResponse } from '@/services/cards';



// Define the number of items per page
const ITEMS_PER_PAGE = 12;

// Define the tab types
type ActiveTab = 'all' | 'my';

export default function CardsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });

  // Fetch cards based on active tab and search query
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        
        if (activeTab === 'all') {
          const response = await cardService.getCards({
            page: pagination.page,
            limit: ITEMS_PER_PAGE,
            search: searchQuery || undefined,
          });
          
          setCards(response.data);
          setPagination({
            page: response.meta.page,
            total: response.meta.total,
            totalPages: response.meta.totalPages,
          });
        } else if (activeTab === 'my' && isAuthenticated) {
          const response = await cardService.getUserCards({
            page: pagination.page,
            limit: ITEMS_PER_PAGE,
          });
          
          setCards(response.data);
          setPagination({
            page: response.meta.page,
            total: response.meta.total,
            totalPages: response.meta.totalPages,
          });
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [activeTab, searchQuery, pagination.page, isAuthenticated]);

  // Handle card view
  const handleViewCard = (cardId: string) => {
    navigate(`/cards/${cardId}`);
  };

  // Handle adding card to collection
  const handleAddCard = async (cardId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cards' } });
      return;
    }

    try {
      await cardService.addCardsToUser([cardId]);
      // Refresh the cards after adding
      const response = await cardService.getCards({
        page: pagination.page,
        limit: ITEMS_PER_PAGE,
        search: searchQuery || undefined,
      });
      setCards(response.data);
    } catch (error) {
      console.error('Failed to add card to collection:', error);
    }
  };

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ActiveTab);
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col justify-between mb-8 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Card Collection
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'all' 
                ? 'Browse all available trading cards' 
                : 'View and manage your personal card collection'}
            </p>
          </div>
          
          {isAuthenticated && (
            <Button 
              onClick={() => navigate('/cards/new')}
              className="flex items-center gap-2 mt-4 md:mt-0"
              variant="default"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Card</span>
            </Button>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={
                  activeTab === 'all'
                    ? 'Search cards by name or description...'
                    : 'Search your collection...'
                }
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                disabled={true} // Temporarily disabled
                title="Coming soon"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                disabled={!searchQuery}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            defaultValue="all"
            className="w-full"
          >
            <TabsList className="grid w-full max-w-xs grid-cols-2">
              <TabsTrigger value="all">
                <span>All Cards</span>
              </TabsTrigger>
              <TabsTrigger 
                value="my" 
                disabled={!isAuthenticated}
                title={!isAuthenticated ? 'Sign in to view your collection' : ''}
              >
                <span>My Collection</span>
              </TabsTrigger>
            </TabsList>
            
            {/* All Cards Tab */}
            <TabsContent value="all" className="mt-6">
              <CardsGrid 
                cards={cards}
                isLoading={isLoading}
                onViewCard={handleViewCard}
                onAddCard={isAuthenticated ? handleAddCard : undefined}
                emptyMessage={
                  searchQuery 
                    ? 'No cards match your search' 
                    : 'No cards available at the moment. Please check back later.'
                }
                showActions={true}
              />
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      // Calculate page numbers with ellipsis
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? 'default' : 'outline'}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={pagination.page === pageNum}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                      <span className="flex items-center px-3">...</span>
                    )}
                    
                    {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 1 && (
                      <Button
                        variant={pagination.page === pagination.totalPages ? 'default' : 'outline'}
                        onClick={() => handlePageChange(pagination.totalPages)}
                      >
                        {pagination.totalPages}
                      </Button>
                    )}
                    
                    {pagination.page < pagination.totalPages && (
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* My Collection Tab */}
            <TabsContent value="my" className="mt-6">
              {isAuthenticated ? (
                <>
                  <CardsGrid 
                    cards={cards}
                    isLoading={isLoading}
                    onViewCard={handleViewCard}
                    emptyMessage={
                      searchQuery
                        ? 'No cards in your collection match this search'
                        : 'Your collection is empty. Start by adding some cards!'
                    }
                    showActions={false}
                  />
                  
                  {/* Pagination for My Collection */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-2">
                        {pagination.page > 1 && (
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination.page - 1)}
                          >
                            Previous
                          </Button>
                        )}
                        
                        <Button variant="default">
                          {pagination.page}
                        </Button>
                        
                        {pagination.page < pagination.totalPages && (
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination.page + 1)}
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="mb-4 text-gray-500 dark:text-gray-400">
                    Please sign in to view your collection
                  </p>
                  <Button onClick={() => navigate('/login', { state: { from: '/cards' } })}>
                    Sign In
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
