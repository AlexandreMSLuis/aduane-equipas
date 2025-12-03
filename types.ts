
export interface Player {
  id: string;
  name: string;
  nickname?: string; // Optional nickname
  number: number;
  position: string; // "GK", "DEF", "MID", "FWD"
  isCaptain?: boolean;
}

export interface Referee {
  id: string;
  name: string;
}

export interface KitStyle {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  pattern: 'solid' | 'stripes' | 'hoops' | 'sash' | 'half';
  shortsColor: string;
  numberColor: string;
}

export interface Team {
  id: string;
  name: string;
  manager: string;
  logoUrl?: string; // Optional URL, otherwise we use a placeholder
  players: Player[];
  kits: KitStyle[];
  activeKitId: string;
  sport: 'football' | 'futsal';
}

export interface League {
  id: string;
  name: string;
  teams: Team[];
}

export interface PositionCoordinates {
  id: string;
  label: string; // e.g., "GK", "LB", "ST"
  top: number; // Percentage
  left: number; // Percentage
}

export interface Tactic {
  name: string;
  positions: PositionCoordinates[];
}

export type PlacedPlayersMap = Record<string, string>; // PositionID -> PlayerID

export interface SavedMatch {
  version: string;
  timestamp: string;
  sport: 'football' | 'futsal';
  mode: 'team' | 'referee';
  venue: 'home' | 'away';
  team: Team;
  tacticName: string;
  placedPlayers: PlacedPlayersMap;
  bench: string[];
  missing: string[];
  referees: Referee[];
  placedReferees: PlacedPlayersMap;
}