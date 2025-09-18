export type BroadcasterCategory = 'streaming' | 'pay-tv' | 'free-tv';

export interface Broadcaster {
  slug: string;
  name: string;
  url: string;
  category: BroadcasterCategory;
  countries: string[];
}

export interface Competition {
  id: string;
  slug: string;
  altSlugs?: string[];
  name: string;
  shortName: string;
  season: string;
  organiser: string;
  tier: string;
  defaultBroadcasters: string[]; // broadcaster slugs
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  colours?: {
    primary: string;
    secondary: string;
  };
  aliases?: string[];
  competitions: string[]; // competition ids
}

export interface Match {
  id: string;
  slug: string;
  competitionId: string;
  stage: string;
  kickoff: string; // ISO date with timezone
  stadium: string;
  city: string;
  detailUrl?: string;
  broadcasters?: string[]; // broadcaster slugs
  homeTeamId: string;
  awayTeamId: string;
  notes?: string;
}

export const broadcasters: Broadcaster[] = [
  {
    slug: 'dazn',
    name: 'DAZN',
    url: 'https://www.dazn.com/de-DE/home',
    category: 'streaming',
    countries: ['DE', 'AT', 'CH'],
  },
  {
    slug: 'sky-de',
    name: 'Sky Sport (DE)',
    url: 'https://www.sky.de/',
    category: 'pay-tv',
    countries: ['DE'],
  },
  {
    slug: 'prime-video',
    name: 'Prime Video',
    url: 'https://www.amazon.de/primevideo',
    category: 'streaming',
    countries: ['DE', 'AT'],
  },
  {
    slug: 'zdf',
    name: 'ZDF',
    url: 'https://sportstudio.zdf.de',
    category: 'free-tv',
    countries: ['DE'],
  },
  {
    slug: 'magenta',
    name: 'MagentaTV',
    url: 'https://www.telekom.de/magenta-tv',
    category: 'pay-tv',
    countries: ['DE'],
  },
  {
    slug: 'servustv-at',
    name: 'ServusTV (AT)',
    url: 'https://www.servustv.com',
    category: 'free-tv',
    countries: ['AT'],
  },
];

export const competitions: Competition[] = [
  {
    id: 'ucl-2025',
    slug: 'champions-league',
    altSlugs: ['cl', 'ucl'],
    name: 'UEFA Champions League',
    shortName: 'Champions League',
    season: '2025/26',
    organiser: 'UEFA',
    tier: 'Hauptbewerb',
    defaultBroadcasters: ['dazn', 'prime-video', 'sky-de'],
  },
  {
    id: 'uel-2025',
    slug: 'europa-league',
    altSlugs: ['uel'],
    name: 'UEFA Europa League',
    shortName: 'Europa League',
    season: '2025/26',
    organiser: 'UEFA',
    tier: 'Hauptbewerb',
    defaultBroadcasters: ['dazn', 'magenta'],
  },
];

export const teams: Team[] = [
  {
    id: 'fcb',
    slug: 'bayern',
    name: 'FC Bayern München',
    shortName: 'Bayern',
    country: 'Deutschland',
    league: 'Bundesliga',
    colours: { primary: '#dc2626', secondary: '#0f172a' },
    aliases: ['bayern-muenchen', 'fcb', 'fc-bayern'],
    competitions: ['ucl-2025'],
  },
  {
    id: 'psg',
    slug: 'psg',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    country: 'Frankreich',
    league: 'Ligue 1',
    colours: { primary: '#1d4ed8', secondary: '#dc2626' },
    competitions: ['ucl-2025'],
  },
  {
    id: 'dortmund',
    slug: 'dortmund',
    name: 'Borussia Dortmund',
    shortName: 'BVB',
    country: 'Deutschland',
    league: 'Bundesliga',
    colours: { primary: '#facc15', secondary: '#111827' },
    competitions: ['ucl-2025'],
  },
  {
    id: 'liverpool',
    slug: 'liverpool',
    name: 'Liverpool FC',
    shortName: 'Liverpool',
    country: 'England',
    league: 'Premier League',
    colours: { primary: '#b91c1c', secondary: '#14532d' },
    competitions: ['ucl-2025'],
  },
  {
    id: 'leverkusen',
    slug: 'leverkusen',
    name: 'Bayer 04 Leverkusen',
    shortName: 'Leverkusen',
    country: 'Deutschland',
    league: 'Bundesliga',
    colours: { primary: '#ef4444', secondary: '#1f2937' },
    competitions: ['uel-2025'],
  },
  {
    id: 'salzburg',
    slug: 'salzburg',
    name: 'FC Red Bull Salzburg',
    shortName: 'Salzburg',
    country: 'Österreich',
    league: 'Bundesliga (AUT)',
    colours: { primary: '#f87171', secondary: '#1e293b' },
    competitions: ['uel-2025'],
  },
  {
    id: 'olympiacos',
    slug: 'olympiacos',
    name: 'Olympiacos Piräus',
    shortName: 'Olympiacos',
    country: 'Griechenland',
    league: 'Super League Greece',
    competitions: ['ucl-2025'],
  },
  {
    id: 'pafos',
    slug: 'pafos',
    name: 'Pafos FC',
    shortName: 'Pafos',
    country: 'Zypern',
    league: 'First Division',
    competitions: ['ucl-2025'],
  },
  {
    id: 'slavia',
    slug: 'slavia-praha',
    name: 'Slavia Prag',
    shortName: 'Slavia',
    country: 'Tschechien',
    league: 'Fortuna Liga',
    competitions: ['ucl-2025'],
  },
  {
    id: 'bodo',
    slug: 'bodo-glimt',
    name: 'FK Bodø/Glimt',
    shortName: 'Bodø/Glimt',
    country: 'Norwegen',
    league: 'Eliteserien',
    competitions: ['ucl-2025'],
  },
  {
    id: 'paris',
    slug: 'paris',
    name: 'Paris FC',
    shortName: 'Paris',
    country: 'Frankreich',
    league: 'Ligue 1',
    competitions: ['ucl-2025'],
  },
  {
    id: 'atalanta',
    slug: 'atalanta',
    name: 'Atalanta Bergamo',
    shortName: 'Atalanta',
    country: 'Italien',
    league: 'Serie A',
    competitions: ['ucl-2025'],
  },
];

export const matches: Match[] = [
  {
    id: 'ucl-2025-09-17-fcb-psg',
    slug: 'bayern-psg',
    competitionId: 'ucl-2025',
    stage: 'Gruppenphase · Spieltag 1',
    kickoff: '2025-09-17T20:45:00+02:00',
    stadium: 'Allianz Arena',
    city: 'München (GER)',
    detailUrl: 'https://de.uefa.com/uefachampionsleague/match/0000001/',
    broadcasters: ['dazn', 'prime-video', 'sky-de'],
    homeTeamId: 'fcb',
    awayTeamId: 'psg',
    notes: 'Kommentator und Experten werden noch bekannt gegeben.',
  },
  {
    id: 'ucl-2025-09-17-bvb-liv',
    slug: 'dortmund-liverpool',
    competitionId: 'ucl-2025',
    stage: 'Gruppenphase · Spieltag 1',
    kickoff: '2025-09-17T18:45:00+02:00',
    stadium: 'SIGNAL IDUNA PARK',
    city: 'Dortmund (GER)',
    detailUrl: 'https://de.uefa.com/uefachampionsleague/match/0000002/',
    broadcasters: ['dazn', 'sky-de'],
    homeTeamId: 'dortmund',
    awayTeamId: 'liverpool',
  },
  {
    id: 'uel-2025-09-18-salzburg-lev',
    slug: 'salzburg-leverkusen',
    competitionId: 'uel-2025',
    stage: 'Gruppenphase · Spieltag 1',
    kickoff: '2025-09-18T21:00:00+02:00',
    stadium: 'Red Bull Arena',
    city: 'Salzburg (AUT)',
    detailUrl: 'https://de.uefa.com/uefaeuropaleague/match/0000003/',
    broadcasters: ['dazn', 'magenta', 'servustv-at'],
    homeTeamId: 'salzburg',
    awayTeamId: 'leverkusen',
  },
  {
    id: 'ucl-2025-09-17-olympiacos-pafos',
    slug: 'olympiacos-pafos',
    competitionId: 'ucl-2025',
    stage: 'Play-off',
    kickoff: '2025-09-17T18:45:00+02:00',
    stadium: 'Stadio Georgios Karaiskakis',
    city: 'Piräus (GRE)',
    detailUrl: 'https://de.uefa.com/uefachampionsleague/match/2045913/',
    broadcasters: ['dazn'],
    homeTeamId: 'olympiacos',
    awayTeamId: 'pafos',
  },
  {
    id: 'ucl-2025-09-17-slavia-bodo',
    slug: 'slavia-bodo',
    competitionId: 'ucl-2025',
    stage: 'Play-off',
    kickoff: '2025-09-17T18:45:00+02:00',
    stadium: 'Eden Arena',
    city: 'Prag (CZE)',
    detailUrl: 'https://de.uefa.com/uefachampionsleague/match/2045914/',
    broadcasters: ['dazn'],
    homeTeamId: 'slavia',
    awayTeamId: 'bodo',
  },
  {
    id: 'ucl-2025-09-17-paris-atalanta',
    slug: 'paris-atalanta',
    competitionId: 'ucl-2025',
    stage: 'Play-off',
    kickoff: '2025-09-17T21:00:00+02:00',
    stadium: 'Parc des Princes',
    city: 'Paris (FRA)',
    detailUrl: 'https://de.uefa.com/uefachampionsleague/match/2045909/',
    broadcasters: ['dazn'],
    homeTeamId: 'paris',
    awayTeamId: 'atalanta',
  },
];

export function findCompetitionBySlug(slug: string): Competition | undefined {
  const lower = slug.toLowerCase();
  return competitions.find((competition) =>
    competition.slug === lower || competition.altSlugs?.includes(lower),
  );
}

export function findTeamBySlug(slug: string): Team | undefined {
  const lower = slug.toLowerCase();
  return teams.find((team) =>
    team.slug === lower || team.aliases?.some((alias) => alias === lower),
  );
}

export function findMatchesByTeam(teamId: string): Match[] {
  return matches
    .filter((match) => match.homeTeamId === teamId || match.awayTeamId === teamId)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
}

export function findMatchesByCompetition(competitionId: string): Match[] {
  return matches
    .filter((match) => match.competitionId === competitionId)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
}

export function findBroadcasters(slugs: string[] | undefined): Broadcaster[] {
  if (!slugs) return [];
  const set = new Set(slugs);
  return broadcasters.filter((provider) => set.has(provider.slug));
}

export function getTeam(teamId: string): Team | undefined {
  return teams.find((team) => team.id === teamId);
}

export function getCompetition(competitionId: string): Competition | undefined {
  return competitions.find((competition) => competition.id === competitionId);
}
