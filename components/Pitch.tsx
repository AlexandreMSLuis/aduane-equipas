
import React from 'react';
import { PositionCoordinates, PlacedPlayersMap, Team, Player, Referee } from '../types';
import KitIcon from './KitIcon';
import { X } from 'lucide-react';

interface PitchProps {
  formation: PositionCoordinates[];
  placedPlayers: PlacedPlayersMap;
  team: Team;
  onDrop: (positionId: string, playerId: string) => void;
  onRemove: (positionId: string) => void;
  onSetCaptain: (playerId: string) => void;
  selectedForPlacement?: Player | Referee | null;
  onPositionClick?: (positionId: string) => void;
  sport: 'football' | 'futsal';
}

const Pitch: React.FC<PitchProps> = ({ 
  formation, 
  placedPlayers, 
  team, 
  onDrop, 
  onRemove, 
  onSetCaptain,
  selectedForPlacement,
  onPositionClick,
  sport
}) => {
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, positionId: string) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData('text/plain');
    if (playerId) {
      onDrop(positionId, playerId);
    }
  };

  const activeKit = team.kits.find(k => k.id === team.activeKitId) || team.kits[0];
  const gkKit = { ...activeKit, primaryColor: '#fbbf24', secondaryColor: '#000', pattern: 'solid' as const, shortsColor: '#000', numberColor: '#000000' };

  // Styles based on Sport
  const isFootball = sport === 'football';
  const pitchColor = isFootball ? '#2d8a3e' : '#3b82f6'; // Green vs Blue
  const pitchGradient = isFootball 
    ? `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255, 255, 255, 0.05) 50px, rgba(255, 255, 255, 0.05) 100px), radial-gradient(circle at 50% 50%, #2d8a3e 0%, #1e6b2e 100%)`
    : `linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)`;

  return (
    <div 
      className="relative w-full aspect-[3/4] md:aspect-[4/3] max-w-3xl mx-auto rounded-xl shadow-2xl overflow-hidden border-4 border-white/20 select-none"
      style={{
        backgroundColor: pitchColor,
        backgroundImage: pitchGradient
      }}
    >
      {/* Pitch Lines */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/50 transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 left-1/2 w-64 h-32 border-x-2 border-b-2 border-white/50 transform -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-64 h-32 border-x-2 border-t-2 border-white/50 transform -translate-x-1/2"></div>
      <div className="absolute top-0 left-1/2 w-24 h-12 border-x-2 border-b-2 border-white/50 transform -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-24 h-12 border-x-2 border-t-2 border-white/50 transform -translate-x-1/2"></div>

      {/* Players on Pitch */}
      {formation.map((pos) => {
        const playerId = placedPlayers[pos.id];
        const player = team.players.find(p => p.id === playerId);
        const isGK = pos.label === 'GK' || pos.label === 'GR';
        const isReferee = player?.position === 'REF';
        
        // Highlight logic for selection mode
        const isSelectedTarget = selectedForPlacement && !playerId;

        return (
          <div
            key={pos.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isSelectedTarget ? 'z-20' : 'z-10'}`}
            style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, pos.id)}
            onClick={() => onPositionClick && onPositionClick(pos.id)}
          >
            {player ? (
              <div className="group relative flex flex-col items-center cursor-pointer">
                {/* Remove Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(pos.id); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X size={12} />
                </button>
                
                {/* Captain Toggle */}
                {!isReferee && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSetCaptain(player.id); }}
                    className={`absolute -top-2 -left-2 rounded-full p-0.5 z-10 transition-all transform ${
                      player.isCaptain 
                        ? 'bg-aduane-gold text-aduane-navy opacity-100 scale-100 shadow-md ring-2 ring-white/50' 
                        : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100 scale-90 hover:scale-110 hover:bg-aduane-gold hover:text-aduane-navy'
                    }`}
                    title="Definir Capitão"
                  >
                    <div className="w-3 h-3 flex items-center justify-center font-bold text-[10px] leading-none">C</div>
                  </button>
                )}

                {/* Jersey */}
                <div className="transform group-hover:scale-110 transition-transform duration-200">
                  <KitIcon 
                    style={isGK ? gkKit : activeKit} 
                    size={48} 
                    showShorts 
                    number={isReferee ? undefined : player.number}
                  />
                </div>

                {/* Player Name */}
                <div className="mt-1 flex flex-col items-center">
                   <div className="bg-aduane-navy/90 backdrop-blur-sm px-3 py-0.5 rounded shadow-lg border border-white/20">
                     <span className="text-white text-sm font-bold font-display tracking-wider whitespace-nowrap">
                       {(player.nickname || player.name).toUpperCase()}
                       {player.isCaptain && <span className="text-aduane-gold ml-1">©</span>}
                     </span>
                   </div>
                </div>
              </div>
            ) : (
              // Empty Slot
              <div className={`group flex flex-col items-center transition-all ${selectedForPlacement ? 'scale-110 cursor-pointer' : ''}`}>
                <div className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
                  selectedForPlacement 
                    ? 'border-aduane-gold bg-aduane-gold/20 animate-pulse shadow-[0_0_15px_rgba(252,163,17,0.5)]' 
                    : 'border-white/40 bg-black/10 group-hover:bg-white/10 group-hover:border-white'
                }`}>
                  <span className={`font-bold text-xs ${selectedForPlacement ? 'text-aduane-gold' : 'text-white/60'}`}>{pos.label}</span>
                </div>
                {selectedForPlacement && (
                   <div className="mt-1 bg-aduane-gold text-aduane-navy text-[10px] font-bold px-2 rounded-full animate-bounce">
                      Colocar
                   </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Pitch;
