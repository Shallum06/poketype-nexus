
import React from 'react';
import TypeBadge from './TypeBadge';
import { Pokemon } from '@/utils/pokemonAPI';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const { name, sprites, types } = pokemon;
  
  return (
    <div className="relative glass rounded-2xl p-6 h-full w-full overflow-hidden card-glow animate-fade-in flex flex-col items-center justify-center">
      <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {sprites.other["official-artwork"].front_default ? (
          <div className="w-64 h-64 mx-auto mb-4 relative">
            <img
              src={sprites.other["official-artwork"].front_default}
              alt={name}
              className="w-full h-full object-contain drop-shadow-lg animate-float"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-64 h-64 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">No image available</p>
          </div>
        )}
        
        <h2 className="text-2xl font-bold capitalize mb-2">
          {name}
        </h2>
        
        <div className="flex gap-2 mt-2">
          {types.map((typeInfo) => (
            <TypeBadge 
              key={typeInfo.type.name} 
              type={typeInfo.type.name} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
