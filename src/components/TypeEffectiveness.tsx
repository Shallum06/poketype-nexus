
import React from 'react';
import { Shield, Zap, Minus } from 'lucide-react';
import TypeBadge from './TypeBadge';

interface EffectivenessProps {
  type: string;
  multiplier: number;
}

interface TypeEffectivenessProps {
  weaknesses: EffectivenessProps[];
  resistances: EffectivenessProps[];
  immunities: string[];
}

const TypeEffectiveness: React.FC<TypeEffectivenessProps> = ({ 
  weaknesses, 
  resistances, 
  immunities 
}) => {
  // Group weaknesses by multiplier
  const weaknessGroups = weaknesses.reduce((acc, { type, multiplier }) => {
    acc[multiplier] = [...(acc[multiplier] || []), type];
    return acc;
  }, {} as Record<number, string[]>);

  // Sort weakness keys in descending order (4x, 2x)
  const sortedWeaknessKeys = Object.keys(weaknessGroups)
    .map(Number)
    .sort((a, b) => b - a);

  // Group resistances by multiplier
  const resistanceGroups = resistances.reduce((acc, { type, multiplier }) => {
    acc[multiplier] = [...(acc[multiplier] || []), type];
    return acc;
  }, {} as Record<number, string[]>);

  // Sort resistance keys in ascending order (0.25x, 0.5x)
  const sortedResistanceKeys = Object.keys(resistanceGroups)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-red-500" size={18} />
          <h3 className="text-lg font-semibold">Weaknesses</h3>
        </div>
        
        {sortedWeaknessKeys.length > 0 ? (
          <div className="space-y-4">
            {sortedWeaknessKeys.map(multiplier => (
              <div key={`weakness-${multiplier}`} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {multiplier}x damage from
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {weaknessGroups[multiplier].map(type => (
                    <TypeBadge key={`weakness-${type}`} type={type} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No weaknesses</p>
        )}
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-green-500" size={18} />
          <h3 className="text-lg font-semibold">Resistances</h3>
        </div>
        
        {sortedResistanceKeys.length > 0 || immunities.length > 0 ? (
          <div className="space-y-4">
            {sortedResistanceKeys.map(multiplier => (
              <div key={`resistance-${multiplier}`} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {multiplier}x damage from
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resistanceGroups[multiplier].map(type => (
                    <TypeBadge key={`resistance-${type}`} type={type} />
                  ))}
                </div>
              </div>
            ))}
            
            {immunities.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Immune to
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {immunities.map(type => (
                    <TypeBadge key={`immunity-${type}`} type={type} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No resistances</p>
        )}
      </div>
    </div>
  );
};

export default TypeEffectiveness;
