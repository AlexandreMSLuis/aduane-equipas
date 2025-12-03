
import React, { useState, useRef, useCallback } from 'react';
import { Team, Tactic, PlacedPlayersMap, Player, Referee, SavedMatch } from '../types';
import Pitch from './Pitch';
import { Search, Download, Trash2, Shield, RefreshCw, X, Users, Flag, Plus, Youtube, Facebook, MousePointerClick, Save, FolderOpen } from 'lucide-react';
import { toPng } from 'html-to-image';
import { REFEREE_TACTIC, REFEREE_KIT, APP_LOGO_URL } from '../constants';

interface PlayerItemProps {
  player: Player | Referee;
  isCompact?: boolean;
  onDelete?: () => void;
  onDragStart: (e: React.DragEvent, player: Player | Referee) => void;
  isReferee?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

const PlayerItem: React.FC<PlayerItemProps> = ({ player, isCompact = false, onDelete, onDragStart, isReferee = false, onClick, isSelected }) => {
  const displayNumber = 'number' in player ? player.number : (isReferee ? 'R' : '');
  const displayPosition = 'position' in player ? player.position : (isReferee ? 'Árbitro' : '');
  const isCaptain = 'isCaptain' in player ? player.isCaptain : false;
  // Use Nickname if available
  const displayName = ('nickname' in player && player.nickname) ? player.nickname : player.name;

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, player)}
      onClick={onClick}
      className={`flex items-center ${isCompact ? 'p-1.5' : 'p-2'} bg-white border rounded-lg hover:shadow-md cursor-grab active:cursor-grabbing transition-all group relative ${isSelected ? 'border-aduane-gold ring-2 ring-aduane-gold bg-yellow-50' : 'border-gray-100 hover:border-aduane-gold'}`}
    >
      <div className={`${isCompact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} flex items-center justify-center bg-gray-100 rounded-full font-bold text-aduane-navy mr-3 group-hover:bg-aduane-navy group-hover:text-white transition-colors`}>
        {isReferee ? <Flag size={14} /> : displayNumber}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className={`font-medium text-gray-800 ${isCompact ? 'text-xs truncate' : 'text-sm'}`}>{displayName}</p>
        {!isCompact && <p className="text-xs text-gray-500">{displayPosition}</p>}
      </div>
      {isCaptain && <span className="text-aduane-gold font-bold text-xs mr-2">C</span>}
      
      {onDelete && (
         <button 
           onClick={(e) => { e.stopPropagation(); onDelete(); }}
           className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
         >
           <X size={14} />
         </button>
      )}
    </div>
  );
};

interface BuilderProps {
  team: Team;
  tactic: Tactic;
  placedPlayers: PlacedPlayersMap;
  setTactic: (t: Tactic) => void;
  setPlacedPlayers: (p: PlacedPlayersMap) => void;
  bench: string[];
  setBench: (ids: string[]) => void;
  missing: string[];
  setMissing: (ids: string[]) => void;
  availableTactics: Tactic[];
  resetLineup: () => void;
  onSetCaptain: (playerId: string) => void;
  setActiveKitId: (kitId: string) => void;
  
  // Referee Props
  referees: Referee[];
  setReferees: (r: Referee[]) => void;
  placedReferees: PlacedPlayersMap;
  setPlacedReferees: (p: PlacedPlayersMap) => void;

  // Sidebar state
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  
  // Global State (Lifted for Persistence)
  mode: 'team' | 'referee';
  setMode: (m: 'team' | 'referee') => void;
  venue: 'home' | 'away';
  setVenue: (v: 'home' | 'away') => void;
  onLoadMatch: (data: SavedMatch) => void;
  
  // Sport State
  sport: 'football' | 'futsal';
  setSport: (s: 'football' | 'futsal') => void;
}

const Builder: React.FC<BuilderProps> = ({ 
  team, 
  tactic, 
  placedPlayers, 
  setTactic, 
  setPlacedPlayers, 
  bench,
  setBench,
  missing,
  setMissing,
  availableTactics,
  resetLineup,
  onSetCaptain,
  setActiveKitId,
  referees,
  setReferees,
  placedReferees,
  setPlacedReferees,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  mode,
  setMode,
  venue,
  setVenue,
  onLoadMatch,
  sport,
  setSport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [isExporting, setIsExporting] = useState(false);
  const [newRefereeName, setNewRefereeName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mobile Interaction State (Tap to Select -> Tap to Place)
  const [selectedForPlacement, setSelectedForPlacement] = useState<Player | Referee | null>(null);

  const pitchRef = useRef<HTMLDivElement>(null);

  // --- Logic Selection based on Mode ---
  
  // Team Mode Logic
  const placedPlayerIds = Object.values(placedPlayers);
  const availablePlayers = team.players.filter(p => 
    !placedPlayerIds.includes(p.id) && 
    !bench.includes(p.id) && 
    !missing.includes(p.id) &&
    (positionFilter === 'ALL' || p.position === positionFilter) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (p.nickname && p.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
     p.number.toString().includes(searchTerm))
  );

  // Referee Mode Logic
  const placedRefereeIds = Object.values(placedReferees);
  const availableReferees = referees.filter(r => 
    !placedRefereeIds.includes(r.id) &&
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const movePlayer = (playerId: string, targetZone: 'pitch' | 'bench' | 'missing', targetPosId?: string) => {
    // 1. Create copies
    let newPlaced = { ...placedPlayers };
    let newBench = [...bench];
    let newMissing = [...missing];

    // 2. Remove from source
    const existingPitchPos = Object.keys(newPlaced).find(k => newPlaced[k] === playerId);
    if (existingPitchPos) delete newPlaced[existingPitchPos];
    
    const benchIndex = newBench.indexOf(playerId);
    if (benchIndex > -1) newBench.splice(benchIndex, 1);

    const missingIndex = newMissing.indexOf(playerId);
    if (missingIndex > -1) newMissing.splice(missingIndex, 1);

    // 3. Add to target
    if (targetZone === 'pitch' && targetPosId) {
       newPlaced[targetPosId] = playerId;
    } else if (targetZone === 'bench') {
       newBench.push(playerId);
    } else if (targetZone === 'missing') {
       newMissing.push(playerId);
    }

    // 4. Update states
    setPlacedPlayers(newPlaced);
    setBench(newBench);
    setMissing(newMissing);
  };

  const moveReferee = (refereeId: string, targetPosId: string) => {
    let newPlaced = { ...placedReferees };
    // Remove from existing pos
    const existingPos = Object.keys(newPlaced).find(k => newPlaced[k] === refereeId);
    if (existingPos) delete newPlaced[existingPos];
    
    // Set new pos
    newPlaced[targetPosId] = refereeId;
    setPlacedReferees(newPlaced);
  };

  const handleDragStart = (e: React.DragEvent, item: Player | Referee) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    // Clear selection if drag starts to avoid conflict
    setSelectedForPlacement(null);
  };

  const handleSidebarItemClick = (item: Player | Referee) => {
    if (selectedForPlacement?.id === item.id) {
      setSelectedForPlacement(null); // Deselect if clicked again
    } else {
      setSelectedForPlacement(item);
      // On mobile, auto-close sidebar to allow placing
      if (window.innerWidth < 1024) {
         setIsMobileSidebarOpen(false);
      }
    }
  };

  const handlePitchDrop = (positionId: string, itemId: string) => {
    if (mode === 'team') {
      movePlayer(itemId, 'pitch', positionId);
    } else {
      moveReferee(itemId, positionId);
    }
  };

  const handlePitchClick = (positionId: string) => {
    if (!selectedForPlacement) return;
    
    handlePitchDrop(positionId, selectedForPlacement.id);
    setSelectedForPlacement(null); // Clear selection after placement
  };

  const handleZoneDrop = (e: React.DragEvent, zone: 'bench' | 'missing') => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData('text/plain');
    if (playerId) {
      movePlayer(playerId, zone);
    }
  };

  const handleZoneClick = (zone: 'bench' | 'missing') => {
    if (!selectedForPlacement || mode !== 'team') return;
    // Cast to string as we know it's a Player in team mode (Referee doesn't use zones)
    movePlayer(selectedForPlacement.id, zone);
    setSelectedForPlacement(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const removePlayerFromZone = (playerId: string, zone: 'bench' | 'missing') => {
    if (zone === 'bench') {
      setBench(bench.filter(id => id !== playerId));
    } else {
      setMissing(missing.filter(id => id !== playerId));
    }
  };
  
  const handleRemoveItemFromPitch = (positionId: string) => {
    if (mode === 'team') {
      const newPlaced = { ...placedPlayers };
      delete newPlaced[positionId];
      setPlacedPlayers(newPlaced);
    } else {
      const newPlaced = { ...placedReferees };
      delete newPlaced[positionId];
      setPlacedReferees(newPlaced);
    }
  };

  const handleAddReferee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefereeName.trim()) return;
    const newRef: Referee = {
      id: `ref_${Date.now()}`,
      name: newRefereeName
    };
    setReferees([...referees, newRef]);
    setNewRefereeName('');
  };

  const handleDeleteReferee = (id: string) => {
    if (placedRefereeIds.includes(id)) {
      alert("Remova o árbitro do campo antes de eliminar.");
      return;
    }
    setReferees(referees.filter(r => r.id !== id));
  };

  // --- SAVE & LOAD Logic ---

  const handleSaveMatch = () => {
    const saveData: SavedMatch = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      sport,
      mode,
      venue,
      team,
      tacticName: tactic.name,
      placedPlayers,
      bench,
      missing,
      referees,
      placedReferees
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveData, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
    const name = mode === 'team' ? team.name.replace(/\s+/g, '_') : 'Arbitragem';
    link.download = `${name}_${sport}_${formattedDate}.json`;
    link.click();
  };

  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onLoadMatch(json);
      } catch (err) {
        console.error(err);
        alert("Erro ao ler ficheiro");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const handleDownload = useCallback(() => {
    if (pitchRef.current === null) return;
    setIsExporting(true);

    setTimeout(() => {
        toPng(pitchRef.current!, { cacheBust: true, pixelRatio: 2 })
        .then((dataUrl) => {
            const link = document.createElement('a');
            const fileName = mode === 'team' ? team.name : 'Equipa_de_Arbitragem';
            link.download = `${fileName.replace(/\s+/g, '_')}.png`;
            link.href = dataUrl;
            link.click();
            setIsExporting(false);
        })
        .catch((err) => {
            console.error(err);
            setIsExporting(false);
        });
    }, 100);
  }, [pitchRef, team.name, mode]);

  const posFilterLabels: Record<string, string> = {
    'ALL': 'TODOS',
    'GK': 'GR',
    'DEF': 'DEF',
    'MID': 'MED',
    'FWD': 'AV'
  };

  // --- Prepare Data for Pitch Component ---
  const activeTactic = mode === 'team' ? tactic : REFEREE_TACTIC;
  const activePlaced = mode === 'team' ? placedPlayers : placedReferees;
  
  const refereeTeam: Team = {
    ...team,
    players: referees.map(r => ({ ...r, number: 0, position: 'REF', isCaptain: false } as unknown as Player)),
    activeKitId: REFEREE_KIT.id,
    kits: [REFEREE_KIT]
  };
  
  const activeTeam = mode === 'team' ? team : refereeTeam;

  return (
    <div className="flex flex-col lg:flex-row h-full relative">
      
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Selection Action Bar (Floating) */}
      {selectedForPlacement && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-aduane-navy text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-4 animate-bounce-slight border-2 border-aduane-gold">
           <div className="flex flex-col">
             <span className="text-xs text-aduane-gold font-bold uppercase tracking-wider">A colocar:</span>
             <span className="font-bold">{selectedForPlacement.name}</span>
           </div>
           <div className="h-8 w-px bg-white/20"></div>
           <span className="text-xs opacity-80 whitespace-nowrap hidden sm:inline">Selecione uma posição</span>
           <button 
             onClick={() => setSelectedForPlacement(null)}
             className="bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
           >
             <X size={18} />
           </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`
          fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:h-full lg:order-1
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          
          {/* Mobile Close Button */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h2 className="text-lg font-bold text-aduane-navy">Menu</h2>
            <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-500 hover:text-red-500">
               <X size={24} />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-200 p-1 rounded-lg mb-4">
             <button 
                onClick={() => setMode('team')}
                className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition-all ${mode === 'team' ? 'bg-white text-aduane-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Users size={16} className="mr-2" /> Equipa
             </button>
             <button 
                onClick={() => setMode('referee')}
                className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition-all ${mode === 'referee' ? 'bg-white text-aduane-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Flag size={16} className="mr-2" /> Árbitros
             </button>
          </div>

          <h2 className="text-lg font-bold text-aduane-navy mb-3 flex items-center hidden lg:flex">
            {mode === 'team' ? <><Shield className="w-5 h-5 mr-2" /> Plantel</> : <><Flag className="w-5 h-5 mr-2" /> Árbitros</>}
          </h2>
          
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={mode === 'team' ? "Pesquisar jogador..." : "Pesquisar árbitro..."}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduane-gold focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Position Filters */}
          {mode === 'team' && (
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
              {['ALL', 'GK', 'DEF', 'MID', 'FWD'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPositionFilter(pos)}
                  className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${
                    positionFilter === pos 
                      ? 'bg-aduane-navy text-white border-aduane-navy' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-aduane-gold'
                  }`}
                >
                  {posFilterLabels[pos]}
                </button>
              ))}
            </div>
          )}

          {/* Add Referee */}
          {mode === 'referee' && (
             <form onSubmit={handleAddReferee} className="flex gap-2 mt-2">
                <input 
                  type="text"
                  placeholder="Novo Árbitro"
                  value={newRefereeName}
                  onChange={(e) => setNewRefereeName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-aduane-navy outline-none"
                />
                <button type="submit" className="bg-aduane-navy text-white p-1.5 rounded hover:bg-aduane-navyDark">
                   <Plus size={16} />
                </button>
             </form>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {mode === 'team' ? (
            availablePlayers.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">Nenhum jogador encontrado.</div>
            ) : (
              availablePlayers.map(player => (
                <PlayerItem 
                  key={player.id} 
                  player={player} 
                  onDragStart={handleDragStart} 
                  onClick={() => handleSidebarItemClick(player)}
                  isSelected={selectedForPlacement?.id === player.id}
                />
              ))
            )
          ) : (
            availableReferees.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">Nenhum árbitro disponível.</div>
            ) : (
              availableReferees.map(ref => (
                <PlayerItem 
                   key={ref.id} 
                   player={ref} 
                   onDragStart={handleDragStart} 
                   isReferee={true} 
                   onDelete={() => handleDeleteReferee(ref.id)}
                   onClick={() => handleSidebarItemClick(ref)}
                   isSelected={selectedForPlacement?.id === ref.id}
                />
              ))
            )
          )}
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 bg-gray-100 p-4 lg:p-6 overflow-y-auto lg:order-2">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {mode === 'team' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Modalidade</label>
                    <select 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-aduane-navy focus:border-aduane-navy block w-32 p-2"
                      value={sport}
                      onChange={(e) => setSport(e.target.value as 'football' | 'futsal')}
                    >
                      <option value="football">Futebol 11</option>
                      <option value="futsal">Futsal</option>
                    </select>
                  </div>
                  <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tática</label>
                    <select 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-aduane-navy focus:border-aduane-navy block w-32 p-2"
                      value={tactic.name}
                      onChange={(e) => {
                        const found = availableTactics.find(t => t.name === e.target.value);
                        if (found) setTactic(found);
                      }}
                    >
                      {availableTactics.map(t => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Equipamento</label>
                    <div className="flex items-center gap-2">
                      <select 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-aduane-navy focus:border-aduane-navy block w-32 p-2"
                        value={team.activeKitId}
                        onChange={(e) => setActiveKitId(e.target.value)}
                      >
                        {team.kits.map(k => (
                          <option key={k.id} value={k.id}>{k.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estatuto</label>
                    <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                      <button 
                        onClick={() => setVenue('home')}
                        className={`px-3 py-1 text-xs font-bold rounded transition-all ${venue === 'home' ? 'bg-white shadow text-aduane-navy' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Casa
                      </button>
                      <button 
                        onClick={() => setVenue('away')}
                        className={`px-3 py-1 text-xs font-bold rounded transition-all ${venue === 'away' ? 'bg-white shadow text-aduane-navy' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Visitante
                      </button>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                </>
              )}
              
              <div className="flex items-center gap-2">
                 <button onClick={resetLineup} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Limpar">
                    <Trash2 size={20} />
                 </button>
              </div>

               {/* Save & Load */}
               <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
               <div className="flex items-center gap-2">
                  <button onClick={handleSaveMatch} className="flex items-center gap-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs font-bold">
                     <Save size={16} /> Guardar Jogo
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs font-bold">
                     <FolderOpen size={16} /> Carregar Jogo
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleLoadFile} accept=".json" className="hidden" />
               </div>
            </div>

            <button 
              onClick={handleDownload}
              disabled={isExporting}
              className="flex items-center px-6 py-2.5 bg-aduane-navy hover:bg-aduane-navyDark text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              {isExporting ? <RefreshCw className="animate-spin w-5 h-5 mr-2" /> : <Download className="w-5 h-5 mr-2" />}
              {isExporting ? 'A gerar...' : 'Descarregar PNG'}
            </button>
          </div>

          {/* Capture Area */}
          <div ref={pitchRef} className="bg-gradient-to-br from-gray-900 to-aduane-navyDark p-8 rounded-xl shadow-2xl">
             {/* Header */}
             <div className="flex justify-between items-end mb-6 text-white border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                  {mode === 'team' && (
                    team.logoUrl ? (
                        <img 
                          src={team.logoUrl} 
                          alt="Team Logo" 
                          className="w-20 h-20 object-contain drop-shadow-lg"
                          crossOrigin="anonymous" 
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full border-2 border-aduane-gold/30 flex items-center justify-center bg-aduane-navy/50">
                           <Shield className="w-10 h-10 text-aduane-gold/50" />
                        </div>
                      )
                  )}
                   
                   <div>
                      <h2 className="text-4xl font-display font-bold tracking-widest text-white uppercase leading-none">
                         {mode === 'team' ? team.name : 'Equipa de Arbitragem'}
                      </h2>
                   </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-5xl font-display font-bold text-white/10 absolute top-8 right-8 pointer-events-none">
                     
                  </div>
                   {mode === 'team' && (
                     <div className="flex items-center gap-2 text-white/80">
                        <span className="font-bold uppercase tracking-wider">
                          {venue === 'home' ? 'Equipa da Casa' : 'Equipa Visitante'}
                        </span>
                     </div>
                   )}
                </div>
             </div>

             <div className="flex flex-col md:flex-row gap-8">
                {/* The Pitch */}
                <div className={`flex-1 ${mode === 'referee' ? 'flex justify-center' : ''}`}>
                   <Pitch 
                      formation={activeTactic.positions} 
                      placedPlayers={activePlaced} 
                      team={activeTeam} 
                      onDrop={handlePitchDrop}
                      onRemove={handleRemoveItemFromPitch}
                      onSetCaptain={onSetCaptain}
                      selectedForPlacement={selectedForPlacement}
                      onPositionClick={handlePitchClick}
                      sport={sport}
                   />
                </div>

                {/* Sidebar info */}
                {mode === 'team' && (
                  <div className="w-full md:w-96 flex flex-col gap-4">
                      {/* Subs */}
                      <div 
                        className={`bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 flex flex-col ${bench.length === 0 ? 'border-dashed border-white/30' : ''} ${selectedForPlacement ? 'hover:border-aduane-gold hover:bg-white/10 cursor-pointer' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleZoneDrop(e, 'bench')}
                        onClick={() => handleZoneClick('bench')}
                      >
                         <h3 className="text-aduane-gold font-display text-xl mb-3 border-b border-white/10 pb-2 flex justify-between items-center">
                            Suplentes
                            <span className="text-xs font-sans text-white/40 bg-white/10 px-2 py-0.5 rounded-full">{bench.length}</span>
                         </h3>
                         <div className={`grid gap-2 min-h-[60px] ${bench.length > 7 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {bench.length === 0 && (
                              <div className="h-full flex items-center justify-center text-white/30 text-xs italic py-4 col-span-full">
                                {selectedForPlacement ? "Toque aqui para adicionar" : "Arraste jogadores para aqui"}
                              </div>
                            )}
                            {bench.map(id => {
                               const player = team.players.find(p => p.id === id);
                               if (!player) return null;
                               return (
                                 <div key={id} className="group relative flex items-center bg-white/10 rounded px-2 py-1.5 border border-transparent hover:border-white/30 transition-all cursor-move" draggable onDragStart={(e) => handleDragStart(e, player)}>
                                    <span className="w-6 font-bold text-aduane-gold text-sm">{player.number}</span>
                                    <span className="truncate text-white text-sm flex-1">{player.nickname || player.name}</span>
                                    <button onClick={(e) => { e.stopPropagation(); removePlayerFromZone(id, 'bench'); }} className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 p-1">
                                      <X size={14} />
                                    </button>
                                 </div>
                               );
                            })}
                         </div>
                      </div>

                      {/* Manager */}
                       <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 flex flex-col">
                          <h3 className="text-aduane-gold font-display text-xl mb-2 border-b border-white/10 pb-1">
                             Treinador
                          </h3>
                          <div className="text-white text-lg font-medium">
                             {team.manager}
                          </div>
                       </div>

                      {/* Missing Players */}
                      {(missing.length > 0 || !isExporting) && (
                        <div 
                          className={`bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 flex flex-col ${missing.length === 0 ? 'border-dashed border-white/30 opacity-70 hover:opacity-100 transition-opacity' : ''} ${selectedForPlacement ? 'hover:border-red-400 hover:bg-white/10 cursor-pointer' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleZoneDrop(e, 'missing')}
                          onClick={() => handleZoneClick('missing')}
                        >
                           <h3 className="text-red-400 font-display text-xl mb-3 border-b border-white/10 pb-2 flex justify-between items-center">
                              Ausentes
                              <span className="text-xs font-sans text-white/40 bg-white/10 px-2 py-0.5 rounded-full">{missing.length}</span>
                           </h3>
                           <div className="space-y-2 min-h-[60px]">
                              {missing.length === 0 && (
                                <div className="h-full flex items-center justify-center text-white/30 text-xs italic py-4">
                                   {selectedForPlacement ? "Toque aqui para adicionar" : "Arraste jogadores ausentes para aqui"}
                                </div>
                              )}
                              {missing.map(id => {
                                 const player = team.players.find(p => p.id === id);
                                 if (!player) return null;
                                 return (
                                   <div key={id} className="group relative flex items-center bg-white/10 rounded px-2 py-1.5 border border-transparent hover:border-white/30 transition-all cursor-move" draggable onDragStart={(e) => handleDragStart(e, player)}>
                                      <span className="w-6 font-bold text-gray-400 text-sm">{player.number}</span>
                                      <span className="truncate text-white/70 text-sm flex-1">{player.nickname || player.name}</span>
                                      <button onClick={(e) => { e.stopPropagation(); removePlayerFromZone(id, 'missing'); }} className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 p-1">
                                        <X size={14} />
                                      </button>
                                   </div>
                                 );
                              })}
                           </div>
                        </div>
                      )}
                  </div>
                )}
             </div>

             {/* Footer */}
             <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                   <div className="h-8">
                     <img src={APP_LOGO_URL} alt="Aduane" className="h-full w-auto object-contain brightness-0 invert opacity-80" />
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1 text-white text-s">
                     <Youtube size={14} />
                     <span>@AduaneSolutions</span>
                   </div>
                   <div className="flex items-center gap-1 text-white text-s">
                     <Facebook size={14} />
                     <span>@AduaneSports</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Builder;
