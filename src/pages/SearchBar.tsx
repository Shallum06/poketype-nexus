import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
const SearchBar: React.FC = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pokemonName.trim()) {
      toast({
        title: "Please enter a Pokémon name",
        variant: "destructive"
      });
      return;
    }

    // Convert to lowercase and trim for consistent API calls
    const formattedName = pokemonName.toLowerCase().trim();
    navigate(`/pokemon/${formattedName}`);
  };
  const clearInput = () => {
    setPokemonName('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return <form onSubmit={handleSubmit} className={`relative w-full max-w-md mx-auto transition-all duration-300 ${isInputFocused ? 'scale-105' : 'scale-100'}`}>
      <div className="relative">
        <input ref={inputRef} type="text" value={pokemonName} onChange={e => setPokemonName(e.target.value)} onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)} placeholder="Search for a Pokémon..." className="w-full h-14 px-12 rounded-full border border-input bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-foreground shadow-sm transition-all duration-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/80" autoComplete="off" />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        
        {pokemonName && <button type="button" onClick={clearInput} className="absolute right-[4.5rem] top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>}
      </div>
      
      <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-12 px-5 rounded-full font-medium">
        Search
      </Button>
    </form>;
};
export default SearchBar;
