import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.theme === 'dark' || !('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
      }
      return newMode;
    });
  };

  return <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 transition-colors duration-300 w-full">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-10">
        <div className="w-full space-y-12 text-center">
          <div className="space-y-4 animate-slide-up">
            <div className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Find Pokémon Type Information
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Discover Pokémon Type
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent block mt-1 my-0 py-[9px]">
                Strengths & Weaknesses
              </span>
            </h1>
            
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a Pokémon name to instantly find its type advantages and disadvantages.
            </p>
          </div>

          <div className="animate-slide-up staggered-300">
            <SearchBar />
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center animate-slide-up staggered-600 w-full">
            <FeatureCard icon={<div className="w-8 h-8 bg-red-500 rounded-full"></div>} title="Type Matchups" description="Know exactly which types are effective against your Pokémon." />
            <FeatureCard icon={<div className="w-8 h-8 bg-blue-500 rounded-full"></div>} title="Battle Ready" description="Build stronger teams with knowledge of type advantages." />
            <FeatureCard icon={<div className="w-8 h-8 bg-green-500 rounded-full"></div>} title="Instant Results" description="Get all the information you need with a simple search." />
          </div>
        </div>
      </main>
      
      <footer className="w-full max-w-4xl mx-auto py-6 text-center text-sm text-muted-foreground">
        <p>Made with PokeAPI • Designed for Pokémon trainers</p>
      </footer>
      
      <div className="fixed bottom-1 right-2 text-[10px] text-gray-400">SL ♥ LN</div>
    </div>;
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description
}) => {
  return <div className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-3 w-full md:max-w-xs">
      <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>;
};

export default Index;
