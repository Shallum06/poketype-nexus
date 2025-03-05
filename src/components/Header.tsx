
import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { toast } = useToast();

  const handleThemeToggle = () => {
    toggleDarkMode();
    toast({
      title: `Theme Changed to ${isDarkMode ? 'Light' : 'Dark'} Mode`,
      duration: 1500,
    });
  };

  return (
    <header className="w-full flex justify-between items-center py-6 px-4 sm:px-6 relative">
      <Link 
        to="/" 
        className="flex items-center gap-2 group"
      >
        <div className="bg-primary/10 p-2 rounded-full">
          <div className="w-6 h-6 bg-primary rounded-full animate-pulse-slow"></div>
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-normal">
          PokeType Nexus
        </h1>
      </Link>

      <button
        onClick={handleThemeToggle}
        className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    </header>
  );
};

export default Header;
