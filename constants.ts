
import { Tactic, Team, League, KitStyle } from './types';

// Substitua este URL pelo URL da sua imagem (ex: '/logo.png' se estiver na pasta public, ou um link externo)
export const APP_LOGO_URL = new URL("aduane-logo2.png", import.meta.url).href;

export const FOOTBALL_TACTICS: Tactic[] = [
  {
    name: '4-4-2',
    positions: [
      { id: 'pos_gk', label: 'GR', top: 88, left: 50 },
      { id: 'pos_lb', label: 'DE', top: 70, left: 10 },
      { id: 'pos_lcb', label: 'DC', top: 75, left: 35 },
      { id: 'pos_rcb', label: 'DC', top: 75, left: 65 },
      { id: 'pos_rb', label: 'DD', top: 70, left: 90 },
      { id: 'pos_lm', label: 'ME', top: 45, left: 10 },
      { id: 'pos_lcm', label: 'MC', top: 50, left: 35 },
      { id: 'pos_rcm', label: 'MC', top: 50, left: 65 },
      { id: 'pos_rm', label: 'MD', top: 45, left: 90 },
      { id: 'pos_lst', label: 'PL', top: 20, left: 35 },
      { id: 'pos_rst', label: 'PL', top: 20, left: 65 },
    ]
  },
  {
    name: '4-3-3',
    positions: [
      { id: 'pos_gk', label: 'GR', top: 88, left: 50 },
      { id: 'pos_lb', label: 'DE', top: 70, left: 10 },
      { id: 'pos_lcb', label: 'DC', top: 75, left: 35 },
      { id: 'pos_rcb', label: 'DC', top: 75, left: 65 },
      { id: 'pos_rb', label: 'DD', top: 70, left: 90 },
      { id: 'pos_cdm', label: 'MDC', top: 55, left: 50 },
      { id: 'pos_lcm', label: 'MC', top: 40, left: 30 },
      { id: 'pos_rcm', label: 'MC', top: 40, left: 70 },
      { id: 'pos_lw', label: 'EE', top: 20, left: 15 },
      { id: 'pos_st', label: 'PL', top: 15, left: 50 },
      { id: 'pos_rw', label: 'ED', top: 20, left: 85 },
    ]
  },
  {
    name: '3-5-2',
    positions: [
      { id: 'pos_gk', label: 'GR', top: 88, left: 50 },
      { id: 'pos_lcb', label: 'DC', top: 75, left: 25 },
      { id: 'pos_ccb', label: 'DC', top: 80, left: 50 },
      { id: 'pos_rcb', label: 'DC', top: 75, left: 75 },
      { id: 'pos_lm', label: 'AE', top: 45, left: 10 },
      { id: 'pos_lcm', label: 'MC', top: 50, left: 35 },
      { id: 'pos_cdm', label: 'MDC', top: 60, left: 50 },
      { id: 'pos_rcm', label: 'MC', top: 50, left: 65 },
      { id: 'pos_rm', label: 'AD', top: 45, left: 90 },
      { id: 'pos_lst', label: 'PL', top: 20, left: 35 },
      { id: 'pos_rst', label: 'PL', top: 20, left: 65 },
    ]
  }
];

export const FUTSAL_TACTICS: Tactic[] = [
  {
    name: '1-2-1 (Losango)',
    positions: [
      { id: 'fut_gk', label: 'GR', top: 88, left: 50 },
      { id: 'fut_fixo', label: 'FX', top: 65, left: 50 },
      { id: 'fut_ala_e', label: 'AE', top: 40, left: 15 },
      { id: 'fut_ala_d', label: 'AD', top: 40, left: 85 },
      { id: 'fut_pivo', label: 'PV', top: 20, left: 50 },
    ]
  },
  {
    name: '2-2 (Quadrado)',
    positions: [
      { id: 'fut_gk', label: 'GR', top: 88, left: 50 },
      { id: 'fut_def_e', label: 'DE', top: 60, left: 25 },
      { id: 'fut_def_d', label: 'DD', top: 60, left: 75 },
      { id: 'fut_av_e', label: 'AE', top: 25, left: 25 },
      { id: 'fut_av_d', label: 'AD', top: 25, left: 75 },
    ]
  },
  {
    name: '1-1-2 (Y)',
    positions: [
      { id: 'fut_gk', label: 'GR', top: 88, left: 50 },
      { id: 'fut_fixo', label: 'FX', top: 65, left: 50 },
      { id: 'fut_ala', label: 'AL', top: 45, left: 50 },
      { id: 'fut_av_e', label: 'AE', top: 20, left: 20 },
      { id: 'fut_av_d', label: 'AD', top: 20, left: 80 },
    ]
  },
  {
    name: '4-0 (Linha)',
    positions: [
      { id: 'fut_gk', label: 'GR', top: 88, left: 50 },
      { id: 'fut_l1', label: 'L1', top: 50, left: 20 },
      { id: 'fut_l2', label: 'L2', top: 50, left: 40 },
      { id: 'fut_l3', label: 'L3', top: 50, left: 60 },
      { id: 'fut_l4', label: 'L4', top: 50, left: 80 },
    ]
  }
];

export const REFEREE_TACTIC: Tactic = {
  name: 'Arbitragem',
  positions: [
    { id: 'ref_main', label: 'AP', top: 40, left: 50 },
    { id: 'ref_as1', label: 'AA1', top: 50, left: 20 },
    { id: 'ref_as2', label: 'AA2', top: 50, left: 80 },
  ]
};

export const REFEREE_KIT: KitStyle = {
  id: 'kit_referee',
  name: 'Árbitro',
  primaryColor: '#1a1a1a', // Black
  secondaryColor: '#333333',
  pattern: 'solid',
  shortsColor: '#1a1a1a',
  numberColor: '#ffffff'
};

export const INITIAL_TEAM: Team = {
  id: 'team_001',
  name: 'Dream Team FC',
  manager: 'Jose Mourinho',
  sport: 'football',
  players: [
    { id: 'p1', name: 'De Gea', number: 1, position: 'GK' },
    { id: 'p2', name: 'James', number: 24, position: 'DEF' },
    { id: 'p3', name: 'Silva', number: 6, position: 'DEF', isCaptain: true },
    { id: 'p4', name: 'Martinez', number: 5, position: 'DEF' },
    { id: 'p5', name: 'Shaw', number: 23, position: 'DEF' },
    { id: 'p6', name: 'Casemiro', number: 18, position: 'MID' },
    { id: 'p7', name: 'Eriksen', number: 14, position: 'MID' },
    { id: 'p8', name: 'Fernandes', number: 8, position: 'MID' },
    { id: 'p9', name: 'Rashford', number: 10, position: 'FWD' },
    { id: 'p10', name: 'Antony', number: 21, position: 'FWD' },
    { id: 'p11', name: 'Martial', number: 9, position: 'FWD' },
    { id: 'p12', name: 'Heaton', number: 22, position: 'GK' },
    { id: 'p13', name: 'Maguire', number: 4, position: 'DEF' },
    { id: 'p14', name: 'Fred', number: 17, position: 'MID' },
    { id: 'p15', name: 'Sancho', number: 25, position: 'FWD' },
  ],
  kits: [
    {
      id: 'k1',
      name: 'Principal',
      primaryColor: '#c70000',
      secondaryColor: '#ffffff',
      pattern: 'solid',
      shortsColor: '#ffffff',
      numberColor: '#ffffff'
    },
    {
      id: 'k2',
      name: 'Alternativo',
      primaryColor: '#ffffff',
      secondaryColor: '#000000',
      pattern: 'stripes',
      shortsColor: '#000000',
      numberColor: '#000000'
    }
  ],
  activeKitId: 'k1'
};

export const LEAGUES: League[] = [
  {
    id: 'pl',
    name: 'Premier League',
    teams: [
      INITIAL_TEAM,
      {
        id: 'team_city',
        name: 'Manchester City',
        manager: 'Pep Guardiola',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        sport: 'football',
        players: [
          { id: 'mc1', name: 'Ederson', number: 31, position: 'GK' },
          { id: 'mc2', name: 'Walker', number: 2, position: 'DEF', isCaptain: true },
          { id: 'mc3', name: 'Dias', number: 3, position: 'DEF' },
          { id: 'mc4', name: 'Stones', number: 5, position: 'DEF' },
          { id: 'mc5', name: 'Gvardiol', number: 24, position: 'DEF' },
          { id: 'mc6', name: 'Rodri', number: 16, position: 'MID' },
          { id: 'mc7', name: 'De Bruyne', number: 17, position: 'MID' },
          { id: 'mc8', name: 'Silva', number: 20, position: 'MID' },
          { id: 'mc9', name: 'Foden', number: 47, position: 'FWD' },
          { id: 'mc10', name: 'Haaland', number: 9, position: 'FWD' },
          { id: 'mc11', name: 'Doku', number: 11, position: 'FWD' },
          { id: 'mc12', name: 'Ortega', number: 18, position: 'GK' },
          { id: 'mc13', name: 'Ake', number: 6, position: 'DEF' },
          { id: 'mc14', name: 'Kovacic', number: 8, position: 'MID' },
          { id: 'mc15', name: 'Grealish', number: 10, position: 'FWD' },
        ],
        kits: [
          {
            id: 'mc_home',
            name: 'Principal',
            primaryColor: '#6CABDD',
            secondaryColor: '#ffffff',
            pattern: 'solid',
            shortsColor: '#ffffff',
            numberColor: '#ffffff'
          },
          {
            id: 'mc_away',
            name: 'Alternativo',
            primaryColor: '#000000',
            secondaryColor: '#F7C600',
            pattern: 'stripes',
            shortsColor: '#000000',
            numberColor: '#F7C600'
          }
        ],
        activeKitId: 'mc_home'
      },
      {
        id: 'team_ars',
        name: 'Arsenal',
        manager: 'Mikel Arteta',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        sport: 'football',
        players: [
          { id: 'ar1', name: 'Raya', number: 22, position: 'GK' },
          { id: 'ar2', name: 'White', number: 4, position: 'DEF' },
          { id: 'ar3', name: 'Saliba', number: 2, position: 'DEF' },
          { id: 'ar4', name: 'Gabriel', number: 6, position: 'DEF' },
          { id: 'ar5', name: 'Zinchenko', number: 35, position: 'DEF' },
          { id: 'ar6', name: 'Rice', number: 41, position: 'MID' },
          { id: 'ar7', name: 'Odegaard', number: 8, position: 'MID', isCaptain: true },
          { id: 'ar8', name: 'Havertz', number: 29, position: 'MID' },
          { id: 'ar9', name: 'Saka', number: 7, position: 'FWD' },
          { id: 'ar10', name: 'Jesus', number: 9, position: 'FWD' },
          { id: 'ar11', name: 'Martinelli', number: 11, position: 'FWD' },
          { id: 'ar12', name: 'Ramsdale', number: 1, position: 'GK' },
          { id: 'ar13', name: 'Trossard', number: 19, position: 'FWD' },
          { id: 'ar14', name: 'Jorginho', number: 20, position: 'MID' },
        ],
        kits: [
          {
            id: 'ars_home',
            name: 'Principal',
            primaryColor: '#EF0107',
            secondaryColor: '#ffffff',
            pattern: 'solid',
            shortsColor: '#ffffff',
            numberColor: '#ffffff'
          }
        ],
        activeKitId: 'ars_home'
      }
    ]
  },
  {
    id: 'laliga',
    name: 'La Liga',
    teams: [
      {
        id: 'team_rm',
        name: 'Real Madrid',
        manager: 'Carlo Ancelotti',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
        sport: 'football',
        players: [
          { id: 'rm1', name: 'Courtois', number: 1, position: 'GK' },
          { id: 'rm2', name: 'Carvajal', number: 2, position: 'DEF', isCaptain: true },
          { id: 'rm3', name: 'Militao', number: 3, position: 'DEF' },
          { id: 'rm4', name: 'Rudiger', number: 22, position: 'DEF' },
          { id: 'rm5', name: 'Mendy', number: 23, position: 'DEF' },
          { id: 'rm6', name: 'Valverde', number: 15, position: 'MID' },
          { id: 'rm7', name: 'Tchouameni', number: 18, position: 'MID' },
          { id: 'rm8', name: 'Bellingham', number: 5, position: 'MID' },
          { id: 'rm9', name: 'Rodrygo', number: 11, position: 'FWD' },
          { id: 'rm10', name: 'Mbappe', number: 9, position: 'FWD' },
          { id: 'rm11', name: 'Vinicius', number: 7, position: 'FWD' },
          { id: 'rm12', name: 'Lunin', number: 13, position: 'GK' },
          { id: 'rm13', name: 'Modric', number: 10, position: 'MID' },
          { id: 'rm14', name: 'Camavinga', number: 12, position: 'MID' },
          { id: 'rm15', name: 'Endrick', number: 16, position: 'FWD' },
        ],
        kits: [
          {
            id: 'rm_home',
            name: 'Principal',
            primaryColor: '#ffffff',
            secondaryColor: '#000000',
            pattern: 'solid',
            shortsColor: '#ffffff',
            numberColor: '#000000'
          }
        ],
        activeKitId: 'rm_home'
      },
      {
        id: 'team_barca',
        name: 'FC Barcelona',
        manager: 'Hansi Flick',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%29crest%29.svg',
        sport: 'football',
        players: [
          { id: 'fcb1', name: 'Ter Stegen', number: 1, position: 'GK', isCaptain: true },
          { id: 'fcb2', name: 'Kounde', number: 23, position: 'DEF' },
          { id: 'fcb3', name: 'Araujo', number: 4, position: 'DEF' },
          { id: 'fcb4', name: 'Cubarsi', number: 33, position: 'DEF' },
          { id: 'fcb5', name: 'Balde', number: 3, position: 'DEF' },
          { id: 'fcb6', name: 'De Jong', number: 21, position: 'MID' },
          { id: 'fcb7', name: 'Pedri', number: 8, position: 'MID' },
          { id: 'fcb8', name: 'Gavi', number: 6, position: 'MID' },
          { id: 'fcb9', name: 'Yamal', number: 27, position: 'FWD' },
          { id: 'fcb10', name: 'Lewandowski', number: 9, position: 'FWD' },
          { id: 'fcb11', name: 'Raphinha', number: 11, position: 'FWD' },
          { id: 'fcb12', name: 'Pena', number: 13, position: 'GK' },
          { id: 'fcb13', name: 'Olmo', number: 20, position: 'MID' },
          { id: 'fcb14', name: 'Fermín', number: 16, position: 'MID' },
        ],
        kits: [
          {
            id: 'fcb_home',
            name: 'Principal',
            primaryColor: '#A50044',
            secondaryColor: '#004D98',
            pattern: 'stripes',
            shortsColor: '#004D98',
            numberColor: '#F7C600'
          }
        ],
        activeKitId: 'fcb_home'
      }
    ]
  }
];