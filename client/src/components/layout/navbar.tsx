import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Sparkles, User, Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/use-auth";
import { useThemeStore } from "@/store/theme";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();
  const { t, changeLanguage, currentLanguage } = useTranslation();

  const navigation = [
    { name: t('navbar.marketplace'), href: "/", active: location === "/" },
    { name: t('navbar.myCards'), href: "/my-cards", active: location === "/my-cards" },
    { name: t('navbar.myTrades'), href: "/my-trades", active: location === "/my-trades" },
  ];
  
  const languages = [
    { code: 'pt-BR', name: 'Português (BR)' },
    { code: 'en', name: 'English' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                CardEx
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={`relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all duration-300 font-medium group ${
                      item.active ? "text-primary dark:text-primary" : ""
                    }`}
                  >
                    {item.name}
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: item.active ? "100%" : 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* User Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center space-x-4"
            >
              {/* Language Toggle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Globe className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {languages.map((lang) => (
                        <DropdownMenuItem 
                          key={lang.code} 
                          onClick={() => changeLanguage(lang.code)}
                          className={currentLanguage === lang.code ? 'bg-gray-100 dark:bg-gray-700' : ''}
                        >
                          {lang.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* Dark Mode Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <AnimatePresence mode="wait">
                      {isDark ? (
                        <motion.div
                          key="sun"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Sun className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Moon className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </motion.div>

              {/* User Menu */}
              <AnimatePresence mode="wait">
                {isAuthenticated ? (
                  <motion.div 
                    key="authenticated"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:block">{user?.username}</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" onClick={logout} className="border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300">
                        Logout
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unauthenticated"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Menu Button */}
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
                className="md:hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="space-y-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        className={`block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:translate-x-2 ${
                          item.active ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary" : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
