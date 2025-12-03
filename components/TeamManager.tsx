
import React, { useState, useRef } from 'react';
import { Team, Player, KitStyle, League } from '../types';
import KitIcon from './KitIcon';
import { Plus, Trash2, Shirt, Image as ImageIcon, Download, Upload, Save, FolderOpen, Database, RefreshCw, FileJson, Pencil, X, ArrowUpDown } from 'lucide-react';

interface TeamManagerProps {
  team: Team;
  setTeam: (t: Team) => void;
  library: League[];
  updateLibrary: (l: League[]) => void;
  setSport: (s: 'football' | 'futsal') => void;
}

const TeamManager: React.FC<TeamManagerProps> = ({ team, setTeam, library, updateLibrary, setSport }) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNickname, setNewPlayerNickname] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState('DEF');
  
  // Sorting State
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'position'>('number');
  const [sortAsc, setSortAsc] = useState(true);

  // Kit Edit State
  const [editingKitId, setEditingKitId] = useState<string>(team.activeKitId || (team.kits.length > 0 ? team.kits[0].id : ''));

  // Player Edit State
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Library State
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // --- Core Team Updates ---
  const updateTeamField = (field: keyof Team, value: any) => {
    setTeam({ ...team, [field]: value });
    if (field === 'sport') {
      setSport(value);
    }
  };

  // --- Kit Management ---
  const getEditingKit = () => team.kits.find(k => k.id === editingKitId) || team.kits[0];

  const updateKit = (field: keyof KitStyle, value: any) => {
    const kitToUpdate = getEditingKit();
    if (!kitToUpdate) return;

    const updatedKits = team.kits.map(k => 
        k.id === kitToUpdate.id ? { ...k, [field]: value } : k
    );
    setTeam({ ...team, kits: updatedKits });
  };

  const addNewKit = () => {
    const newId = `kit_${Date.now()}`;
    const newKit: KitStyle = {
        id: newId,
        name: `Equipamento ${team.kits.length + 1}`,
        primaryColor: '#cccccc',
        secondaryColor: '#000000',
        pattern: 'solid',
        shortsColor: '#000000',
        numberColor: '#000000'
    };
    setTeam({ ...team, kits: [...team.kits, newKit] });
    setEditingKitId(newId);
  };

  const deleteKit = (id: string) => {
    if (team.kits.length <= 1) {
        alert("A equipa deve ter pelo menos um equipamento.");
        return;
    }
    const newKits = team.kits.filter(k => k.id !== id);
    setTeam({ 
        ...team, 
        kits: newKits,
        activeKitId: team.activeKitId === id ? newKits[0].id : team.activeKitId 
    });
    if (editingKitId === id) {
        setEditingKitId(newKits[0].id);
    }
  };

  // --- Player Management ---
  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName || !newPlayerNumber) return;

    const num = parseInt(newPlayerNumber);
    if (num < 0 || num > 99) {
      alert("O número do jogador deve ser entre 0 e 99.");
      return;
    }

    const newPlayer: Player = {
      id: `p_${Date.now()}`,
      name: newPlayerName,
      nickname: newPlayerNickname || undefined,
      number: num,
      position: newPlayerPos
    };

    setTeam({ ...team, players: [...team.players, newPlayer] });
    setNewPlayerName('');
    setNewPlayerNickname('');
    setNewPlayerNumber('');
  };

  const removePlayer = (id: string) => {
    if (window.confirm("Tem a certeza que deseja remover este jogador?")) {
       setTeam({ ...team, players: team.players.filter(p => p.id !== id) });
    }
  };

  const handleUpdatePlayer = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingPlayer) return;
      
      const num = editingPlayer.number;
      if (num < 0 || num > 99) {
        alert("O número do jogador deve ser entre 0 e 99.");
        return;
      }

      const updatedPlayers = team.players.map(p => 
          p.id === editingPlayer.id ? editingPlayer : p
      );
      
      setTeam({ ...team, players: updatedPlayers });
      setEditingPlayer(null);
  };

  // Sorting Logic
  const handleSort = (criteria: 'number' | 'name' | 'position') => {
    if (sortBy === criteria) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(criteria);
      setSortAsc(true);
    }
  };

  const sortedPlayers = [...team.players].sort((a, b) => {
    let valA, valB;
    if (sortBy === 'number') {
      valA = a.number;
      valB = b.number;
    } else if (sortBy === 'position') {
      const posOrder = { 'GK': 0, 'DEF': 1, 'MID': 2, 'FWD': 3 };
      valA = posOrder[a.position as keyof typeof posOrder] ?? 99;
      valB = posOrder[b.position as keyof typeof posOrder] ?? 99;
    } else {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // --- Logo Upload ---
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateTeamField('logoUrl', result);
    };
    reader.readAsDataURL(file);
    if (logoFileInputRef.current) logoFileInputRef.current.value = "";
  };

  // --- JSON Actions ---
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(team, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${team.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Basic validation
        if (json.players && Array.isArray(json.players) && json.kits) {
           if(window.confirm(`Importar "${json.name}" irá substituir o espaço de trabalho atual. Continuar?`)) {
             setTeam(json);
             if (json.sport) setSport(json.sport);
             setEditingKitId(json.kits[0]?.id || '');
           }
        } else {
          alert("Formato de ficheiro inválido.");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Falha ao carregar ficheiro.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Library Actions ---
  const handleAddLeague = () => {
    const name = prompt("Nome da nova Liga:");
    if (!name) return;
    const newLeague: League = {
      id: `league_${Date.now()}`,
      name,
      teams: []
    };
    updateLibrary([...library, newLeague]);
    setSelectedLeagueId(newLeague.id);
  };

  const handleAddTeamToLibrary = () => {
    if (!selectedLeagueId) {
      alert("Por favor selecione uma liga primeiro.");
      return;
    }
    const name = prompt("Nome da nova Equipa:");
    if (!name) return;

    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name,
      manager: 'Nome do Treinador',
      sport: 'football',
      players: [],
      kits: [{
          id: `kit_${Date.now()}`,
          name: 'Principal',
          primaryColor: '#ffffff',
          secondaryColor: '#000000',
          pattern: 'solid',
          shortsColor: '#ffffff',
          numberColor: '#000000'
      }],
      activeKitId: `kit_${Date.now()}`
    };

    const updatedLibrary = library.map(l => {
      if (l.id === selectedLeagueId) {
        return { ...l, teams: [...l.teams, newTeam] };
      }
      return l;
    });
    updateLibrary(updatedLibrary);
    setSelectedTeamId(newTeam.id);
  };

  const handleDeleteTeamFromLibrary = () => {
    if (!selectedLeagueId || !selectedTeamId) return;
    if (!window.confirm("Tem a certeza que deseja eliminar esta equipa da biblioteca? Esta ação não pode ser desfeita.")) return;

    const updatedLibrary = library.map(l => {
      if (l.id === selectedLeagueId) {
        return { ...l, teams: l.teams.filter(t => t.id !== selectedTeamId) };
      }
      return l;
    });
    updateLibrary(updatedLibrary);
    setSelectedTeamId('');
  };

  const handleLoadFromLibrary = () => {
    if (!selectedLeagueId || !selectedTeamId) return;
    const league = library.find(l => l.id === selectedLeagueId);
    const teamToLoad = league?.teams.find(t => t.id === selectedTeamId);
    
    if (teamToLoad) {
      if (window.confirm(`Carregar "${teamToLoad.name}" para o espaço de trabalho? As alterações não guardadas serão perdidas.`)) {
         const loadedTeam = JSON.parse(JSON.stringify(teamToLoad));
         setTeam(loadedTeam); // Deep copy
         if (loadedTeam.sport) setSport(loadedTeam.sport);
         setEditingKitId(teamToLoad.kits[0]?.id || '');
      }
    }
  };

  const handleSaveToLibrary = () => {
    // 1. Check if team exists in library (by ID)
    let found = false;
    let updatedLibrary = library.map(l => {
        const teamIndex = l.teams.findIndex(t => t.id === team.id);
        if (teamIndex > -1) {
            found = true;
            // Update the team in this league
            const newTeams = [...l.teams];
            newTeams[teamIndex] = team;
            return { ...l, teams: newTeams };
        }
        return l;
    });

    // 2. If found, save and exit
    if (found) {
        updateLibrary(updatedLibrary);
        alert(`"${team.name}" guardada na biblioteca com sucesso.`);
        return;
    }

    // 3. If not found, try to add to selected league
    if (!selectedLeagueId) {
        alert("Esta é uma equipa nova. Por favor selecione uma Liga para a guardar.");
        return;
    }

    updatedLibrary = library.map(l => {
        if (l.id === selectedLeagueId) {
            return { ...l, teams: [...l.teams, team] };
        }
        return l;
    });
    
    updateLibrary(updatedLibrary);
    setSelectedTeamId(team.id); // Select it
    alert(`"${team.name}" adicionada à biblioteca.`);
  };

  const availableTeams = library.find(l => l.id === selectedLeagueId)?.teams || [];
  const currentEditingKit = getEditingKit();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* --- Data Management Section --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-display font-bold text-aduane-navy flex items-center">
               <Database className="w-5 h-5 mr-2" /> Dados e Biblioteca
            </h2>
            <div className="flex gap-2">
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="flex items-center text-xs font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 px-3 py-1.5 rounded transition-colors"
                 >
                   <Upload className="w-4 h-4 mr-1.5" /> Importar JSON
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleImportJSON} 
                   accept=".json" 
                   className="hidden" 
                 />
                 <button 
                   onClick={handleExportJSON}
                   className="flex items-center text-xs font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 px-3 py-1.5 rounded transition-colors"
                 >
                   <FileJson className="w-4 h-4 mr-1.5" /> Exportar JSON
                 </button>
            </div>
         </div>
         
         <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* Library Browser */}
               <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Navegador da Biblioteca</h3>
                  <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Liga</label>
                        <div className="flex gap-1">
                          <select 
                             className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-aduane-gold outline-none"
                             value={selectedLeagueId}
                             onChange={(e) => {
                               setSelectedLeagueId(e.target.value);
                               setSelectedTeamId('');
                             }}
                          >
                             <option value="">-- Selecionar Liga --</option>
                             {library.map(l => (
                               <option key={l.id} value={l.id}>{l.name}</option>
                             ))}
                          </select>
                          <button onClick={handleAddLeague} className="bg-gray-100 hover:bg-gray-200 p-2 rounded border border-gray-300" title="Nova Liga">
                             <Plus size={16} />
                          </button>
                        </div>
                     </div>
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Equipa</label>
                        <div className="flex gap-1">
                          <select 
                             className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-aduane-gold outline-none"
                             value={selectedTeamId}
                             onChange={(e) => setSelectedTeamId(e.target.value)}
                             disabled={!selectedLeagueId}
                          >
                             <option value="">-- Selecionar Equipa --</option>
                             {availableTeams.map(t => (
                               <option key={t.id} value={t.id}>{t.name}</option>
                             ))}
                          </select>
                          <button 
                             onClick={handleAddTeamToLibrary} 
                             disabled={!selectedLeagueId}
                             className="bg-gray-100 hover:bg-gray-200 p-2 rounded border border-gray-300 disabled:opacity-50" 
                             title="Nova Equipa"
                          >
                             <Plus size={16} />
                          </button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                     <button 
                        onClick={handleDeleteTeamFromLibrary}
                        disabled={!selectedTeamId}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Trash2 size={14} className="mr-1" /> Eliminar
                     </button>
                     <button 
                        onClick={handleLoadFromLibrary}
                        disabled={!selectedTeamId}
                        className="bg-aduane-navy text-white hover:bg-aduane-navyDark text-sm font-bold px-4 py-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <FolderOpen size={16} className="mr-2" /> Carregar
                     </button>
                  </div>
               </div>

               {/* Workspace Actions */}
               <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8 pt-6 lg:pt-0">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ações do Espaço de Trabalho</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                     <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-aduane-navy text-sm">Espaço Atual:</span>
                        <span className="text-xs bg-white px-2 py-0.5 rounded border border-blue-100 text-gray-600">{team.name}</span>
                     </div>
                     <p className="text-xs text-blue-800 mb-4">
                        Está a editar uma equipa na memória. Para manter as alterações permanentemente, guarde-as na biblioteca.
                     </p>
                     <button 
                        onClick={handleSaveToLibrary}
                        className="w-full bg-aduane-gold hover:bg-yellow-500 text-aduane-navy font-bold px-4 py-2 rounded flex items-center justify-center transition-colors"
                     >
                        <Save size={16} className="mr-2" /> Guardar na Biblioteca
                     </button>
                  </div>
               </div>

            </div>
         </div>
      </div>

      {/* --- Team Details & Kit --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-display font-bold text-aduane-navy mb-6 flex items-center border-b pb-2">
            Detalhes da Equipa
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Equipa</label>
              <input 
                type="text" 
                value={team.name}
                onChange={(e) => updateTeamField('name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-aduane-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Treinador</label>
              <input 
                type="text" 
                value={team.manager}
                onChange={(e) => updateTeamField('manager', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-aduane-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modalidade</label>
              <select 
                value={team.sport}
                onChange={(e) => updateTeamField('sport', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-aduane-gold outline-none bg-white"
              >
                <option value="football">Futebol 11</option>
                <option value="futsal">Futsal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logótipo da Equipa</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        value={team.logoUrl || ''}
                        placeholder="https://... ou carregue imagem"
                        onChange={(e) => updateTeamField('logoUrl', e.target.value)}
                        className="w-full pl-9 pr-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-aduane-gold outline-none text-sm"
                    />
                </div>
                
                <button 
                  onClick={() => logoFileInputRef.current?.click()}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600 p-2 rounded flex items-center justify-center transition-colors shrink-0"
                  title="Carregar imagem do computador"
                >
                  <Upload size={18} />
                </button>
                <input 
                  type="file" 
                  ref={logoFileInputRef} 
                  onChange={handleLogoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                {team.logoUrl && (
                    <div className="w-10 h-10 border rounded bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={team.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                    </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Cole um URL ou carregue uma imagem do seu computador.</p>
            </div>
          </div>
        </div>

        {/* Kit Designer */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
             <h2 className="text-xl font-display font-bold text-aduane-navy flex items-center">
                <Shirt className="w-5 h-5 mr-2" /> Design de Equipamento
             </h2>
             <button 
                onClick={addNewKit} 
                className="text-xs flex items-center bg-aduane-gold text-aduane-navy px-2 py-1 rounded font-bold hover:bg-yellow-500"
             >
                <Plus size={14} className="mr-1" /> Adicionar Kit
             </button>
          </div>
          
          {/* Kit Tabs/Selection */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {team.kits.map(kit => (
                  <div 
                    key={kit.id}
                    onClick={() => setEditingKitId(kit.id)}
                    className={`
                        relative flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer min-w-[80px] transition-all
                        ${editingKitId === kit.id ? 'border-aduane-navy bg-blue-50' : 'border-gray-100 hover:border-gray-300'}
                    `}
                  >
                     <KitIcon style={kit} size={32} number={10} />
                     <span className="text-xs font-bold mt-1 text-gray-700 truncate w-full text-center">{kit.name}</span>
                     
                     {/* Delete Button (only if not active and > 1) */}
                     {team.kits.length > 1 && (
                         <button 
                            onClick={(e) => { e.stopPropagation(); deleteKit(kit.id); }}
                            className="absolute -top-1 -right-1 bg-red-100 text-red-500 rounded-full p-0.5 hover:bg-red-500 hover:text-white"
                         >
                            <X size={10} />
                         </button>
                     )}
                  </div>
              ))}
          </div>
          
          {currentEditingKit && (
              <div className="flex gap-6 items-start animate-fade-in">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center gap-2">
                   <KitIcon style={currentEditingKit} size={100} showShorts number={10} />
                   <div className="text-xs text-gray-400 font-mono">{currentEditingKit.name}</div>
                </div>

                <div className="flex-1 space-y-3">
                   <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Equipamento</label>
                       <input 
                         type="text"
                         value={currentEditingKit.name}
                         onChange={(e) => updateKit('name', e.target.value)}
                         className="w-full p-1.5 text-sm border border-gray-300 rounded focus:ring-aduane-navy"
                       />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cor Principal</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={currentEditingKit.primaryColor}
                            onChange={(e) => updateKit('primaryColor', e.target.value)}
                            className="h-8 w-full p-0 border-0 rounded cursor-pointer"
                          />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cor Detalhes</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={currentEditingKit.secondaryColor}
                            onChange={(e) => updateKit('secondaryColor', e.target.value)}
                            className="h-8 w-full p-0 border-0 rounded cursor-pointer"
                          />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cor Calções</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={currentEditingKit.shortsColor}
                            onChange={(e) => updateKit('shortsColor', e.target.value)}
                            className="h-8 w-full p-0 border-0 rounded cursor-pointer"
                          />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cor Número</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={currentEditingKit.numberColor}
                            onChange={(e) => updateKit('numberColor', e.target.value)}
                            className="h-8 w-full p-0 border-0 rounded cursor-pointer"
                          />
                        </div>
                     </div>
                     <div className="col-span-2">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Padrão</label>
                       <select 
                         value={currentEditingKit.pattern}
                         onChange={(e) => updateKit('pattern', e.target.value)}
                         className="w-full p-1.5 text-sm border border-gray-300 rounded focus:ring-aduane-navy"
                       >
                         <option value="solid">Sólido</option>
                         <option value="stripes">Riscas</option>
                         <option value="hoops">Listras</option>
                         <option value="sash">Faixa</option>
                         <option value="half">Metade</option>
                       </select>
                     </div>
                   </div>
                </div>
              </div>
          )}
        </div>
      </div>

      {/* Roster Management */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-display font-bold text-aduane-navy mb-6 flex items-center border-b pb-2">
          Plantel
        </h2>

        {/* Add Player Form */}
        <form onSubmit={addPlayer} className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-end border border-gray-200">
           <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-gray-500 mb-1">Nome do Jogador</label>
             <input 
                type="text" 
                placeholder="ex: Ronaldo" 
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                required
             />
           </div>
           <div className="w-40">
             <label className="block text-xs font-bold text-gray-500 mb-1">Alcunha (Opcional)</label>
             <input 
                type="text" 
                placeholder="ex: CR7" 
                value={newPlayerNickname}
                onChange={(e) => setNewPlayerNickname(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
             />
           </div>
           <div className="w-24">
             <label className="block text-xs font-bold text-gray-500 mb-1">Número</label>
             <input 
                type="number" 
                placeholder="7" 
                min="0"
                max="99"
                value={newPlayerNumber}
                onChange={(e) => setNewPlayerNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                required
             />
           </div>
           <div className="w-32">
             <label className="block text-xs font-bold text-gray-500 mb-1">Posição</label>
             <select 
                value={newPlayerPos}
                onChange={(e) => setNewPlayerPos(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
             >
               <option value="GK">GR</option>
               <option value="DEF">DEF</option>
               <option value="MID">MED</option>
               <option value="FWD">AV</option>
             </select>
           </div>
           <button type="submit" className="bg-aduane-gold text-aduane-navy font-bold px-4 py-2 rounded hover:bg-yellow-500 transition-colors flex items-center">
             <Plus size={18} className="mr-1" /> Adicionar
           </button>
        </form>

        {/* Player List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200 text-sm uppercase tracking-wider">
                <th className="p-3 font-semibold cursor-pointer hover:text-aduane-navy select-none" onClick={() => handleSort('number')}>
                  <div className="flex items-center gap-1"># {sortBy === 'number' && <ArrowUpDown size={12} />}</div>
                </th>
                <th className="p-3 font-semibold cursor-pointer hover:text-aduane-navy select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Nome {sortBy === 'name' && <ArrowUpDown size={12} />}</div>
                </th>
                <th className="p-3 font-semibold cursor-pointer hover:text-aduane-navy select-none" onClick={() => handleSort('position')}>
                   <div className="flex items-center gap-1">Pos {sortBy === 'position' && <ArrowUpDown size={12} />}</div>
                </th>
                <th className="p-3 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedPlayers.map(player => (
                <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-aduane-navy">{player.number}</td>
                  <td className="p-3 font-medium">
                    {player.name}
                    {player.nickname && <span className="ml-2 text-gray-400 text-xs italic">({player.nickname})</span>}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      player.position === 'GK' ? 'bg-yellow-100 text-yellow-800' :
                      player.position === 'DEF' ? 'bg-blue-100 text-blue-800' :
                      player.position === 'MID' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {player.position === 'GK' ? 'GR' : 
                       player.position === 'MID' ? 'MED' :
                       player.position === 'FWD' ? 'AV' : player.position}
                    </span>
                  </td>
                  <td className="p-3 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingPlayer(player)}
                      className="text-gray-400 hover:text-aduane-navy p-1 rounded hover:bg-gray-100"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => removePlayer(player.id)}
                      className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                      title="Remover"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {team.players.length === 0 && (
                 <tr>
                   <td colSpan={4} className="p-8 text-center text-gray-400 italic">Nenhum jogador adicionado.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Player Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-aduane-navy">Editar Jogador</h3>
                 <button onClick={() => setEditingPlayer(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                 </button>
              </div>
              
              <form onSubmit={handleUpdatePlayer} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Nome</label>
                    <input 
                      type="text" 
                      value={editingPlayer.name}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-aduane-gold outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Alcunha (Opcional)</label>
                    <input 
                      type="text" 
                      value={editingPlayer.nickname || ''}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, nickname: e.target.value || undefined })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-aduane-gold outline-none"
                    />
                 </div>
                 <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Número</label>
                        <input 
                          type="number" 
                          min="0"
                          max="99"
                          value={editingPlayer.number}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, number: parseInt(e.target.value) })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-aduane-gold outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Posição</label>
                        <select 
                            value={editingPlayer.position}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-aduane-gold outline-none"
                        >
                           <option value="GK">GR</option>
                           <option value="DEF">DEF</option>
                           <option value="MID">MED</option>
                           <option value="FWD">AV</option>
                        </select>
                    </div>
                 </div>
                 
                 <div className="flex justify-end gap-2 mt-6">
                    <button 
                      type="button"
                      onClick={() => setEditingPlayer(null)}
                      className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded"
                    >
                       Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 text-sm font-bold text-aduane-navy bg-aduane-gold hover:bg-yellow-500 rounded"
                    >
                       Guardar
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;