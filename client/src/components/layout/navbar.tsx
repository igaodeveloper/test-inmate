import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Sparkles, User, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useThemeStore } from "@/store/theme";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";

export function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();

  const navigation = [
    { name: "Marketplace", href: "/", active: location === "/" },
    { name: "My Cards", href: "/my-cards", active: location === "/my-cards" },
    { name: "My Trades", href: "/my-trades", active: location === "/my-trades" },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">CardEx</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium ${
                    item.active ? "text-primary dark:text-primary" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-lg"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">{user?.username}</span>
                  </Button>
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${
                      item.active ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
