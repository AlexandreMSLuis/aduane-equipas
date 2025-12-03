
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Builder from './components/Builder';
import TeamManager from './components/TeamManager';
import { Team, Tactic, PlacedPlayersMap, League, Referee, SavedMatch } from './types';
import { INITIAL_TEAM, FOOTBALL_TACTICS, FUTSAL_TACTICS, LEAGUES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'manage'>('builder');
  
  // -- Library State (Persisted) --
  // Initialize from localStorage or fallback to constants
  const [library, setLibrary] = useState<League[]>(() => {
    try {
      const saved = localStorage.getItem('aduane_library');
      return saved ? JSON.parse(saved) : LEAGUES;
    } catch (e) {
      console.error("Failed to load library", e);
      return LEAGUES;
    }
  });

  // Helper to update library state and localStorage
  const updateLibrary = (newLibrary: League[]) => {
    setLibrary(newLibrary);
    localStorage.setItem('aduane_library', JSON.stringify(newLibrary));
  };

  // -- Workspace State --
  const [team, setTeam] = useState<Team>(INITIAL_TEAM);
  const [tactic, setTactic] = useState<Tactic>(FOOTBALL_TACTICS[0]);
  const [placedPlayers, setPlacedPlayers] = useState<PlacedPlayersMap>({});
  const [bench, setBench] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Moved from Builder to App for persistence
  const [mode, setMode] = useState<'team' | 'referee'>('team');
  const [venue, setVenue] = useState<'home' | 'away'>('home');
  const [sport, setSport] = useState<'football' | 'futsal'>('football');

  // -- Referee State --
  const [referees, setReferees] = useState<Referee[]>([
    { id: 'ref1', name: 'Árbitro Principal' },
    { id: 'ref2', name: 'Assistente 1' },
    { id: 'ref3', name: 'Assistente 2' },
    { id: 'ref4', name: '4º Árbitro' },
  ]);
  const [placedReferees, setPlacedReferees] = useState<PlacedPlayersMap>({});

  const resetLineup = () => {
    if (window.confirm('Tem a certeza que deseja limpar a tática?')) {
      setPlacedPlayers({});
      setBench([]);
      setMissing([]);
      setPlacedReferees({});
    }
  };

  const handleSetCaptain = (playerId: string) => {
    const updatedPlayers = team.players.map(p => ({
      ...p,
      isCaptain: p.id === playerId
    }));
    setTeam({ ...team, players: updatedPlayers });
  };

  const handleSetActiveKit = (kitId: string) => {
    setTeam({ ...team, activeKitId: kitId });
  };

  const handleSportChange = (newSport: 'football' | 'futsal') => {
    if (newSport !== sport) {
      setTimeout(() => {
        if (window.confirm('Mudar de modalidade irá limpar a formação atual. Continuar?')) {
          setSport(newSport);
          setPlacedPlayers({});
          setPlacedReferees({});
          // Default tactic for the new sport
          setTactic(newSport === 'football' ? FOOTBALL_TACTICS[0] : FUTSAL_TACTICS[0]);
        }
      }, 50);
    }
  };

  const handleLoadMatch = (data: SavedMatch) => {
     try {
        setMode(data.mode || 'team');
        setVenue(data.venue || 'home');
        setSport(data.sport || 'football');
        
        if (data.team) setTeam(data.team);
        
        if (data.tacticName) {
           const availableTactics = (data.sport === 'futsal') ? FUTSAL_TACTICS : FOOTBALL_TACTICS;
           const foundTactic = availableTactics.find(f => f.name === data.tacticName);
           if (foundTactic) {
             setTactic(foundTactic);
           } else {
             // Fallback if specific tactic not found
             setTactic(availableTactics[0]);
           }
        }
        
        setPlacedPlayers(data.placedPlayers || {});
        setBench(data.bench || []);
        setMissing(data.missing || []);
        
        if (data.referees) setReferees(data.referees);
        setPlacedReferees(data.placedReferees || {});
        
        alert("Jogo carregado com sucesso!");
     } catch (e) {
        console.error(e);
        alert("Erro ao carregar o ficheiro de jogo.");
     }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
    >
      {activeTab === 'builder' ? (
        <Builder 
          team={team}
          tactic={tactic}
          placedPlayers={placedPlayers}
          setTactic={setTactic}
          setPlacedPlayers={setPlacedPlayers}
          bench={bench}
          setBench={setBench}
          missing={missing}
          setMissing={setMissing}
          availableTactics={sport === 'football' ? FOOTBALL_TACTICS : FUTSAL_TACTICS}
          resetLineup={resetLineup}
          onSetCaptain={handleSetCaptain}
          setActiveKitId={handleSetActiveKit}
          referees={referees}
          setReferees={setReferees}
          placedReferees={placedReferees}
          setPlacedReferees={setPlacedReferees}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          mode={mode}
          setMode={setMode}
          venue={venue}
          setVenue={setVenue}
          onLoadMatch={handleLoadMatch}
          sport={sport}
          setSport={handleSportChange}
        />
      ) : (
        <div className="h-full overflow-y-auto bg-gray-50">
           <TeamManager 
             team={team} 
             setTeam={setTeam} 
             library={library}
             updateLibrary={updateLibrary}
             setSport={setSport}
           />
        </div>
      )}
    </Layout>
  );
};

export default App;