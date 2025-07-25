import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardsList } from '@/components/cards/cards-list';
import { useAuth } from '@/hooks/use-auth';

export default function CardsPage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Card Collection</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and manage your card collection
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cards..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-xs mb-6">
              <TabsTrigger value="all">All Cards</TabsTrigger>
              <TabsTrigger value="my" disabled={!isAuthenticated}>
                My Collection
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardsList 
                  onCardClick={(cardId) => {
                    // Handle card click (e.g., navigate to card details)
                    console.log('View card:', cardId);
                  }}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="my">
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardsList 
                    userId={1} // This would come from auth context
                    onCardClick={(cardId) => {
                      // Handle card click (e.g., navigate to card details)
                      console.log('View my card:', cardId);
                    }}
                  />
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Please log in to view your collection</p>
                  <Button>Log In</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
