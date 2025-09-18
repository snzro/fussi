import {
  competitions,
  findBroadcasters,
  findCompetitionBySlug,
  findMatchesByCompetition,
  findMatchesByTeam,
  findTeamBySlug,
  getCompetition,
  getTeam,
  teams,
  type Competition,
  type Match,
  type Team,
} from './data';
import { renderPage, type FAQEntry, type MatchWithTeams } from './render';

const BASE_URL = process.env.BASE_URL ?? 'https://werzeigt.de';
const PORT = Number(process.env.PORT ?? 3000);

function normalisePath(pathname: string): string {
  if (pathname === '/') return '/';
  return pathname.replace(/\/$/, '');
}

function getDayLabel(offset: number): string {
  if (offset === 0) return 'Heute';
  if (offset === 1) return 'Morgen';
  return `In ${offset} Tagen`;
}

function offsetDate(offset: number): Date {
  const now = new Date();
  const target = new Date(now);
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + offset);
  return target;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function enrichMatch(match: Match): MatchWithTeams | undefined {
  const homeTeam = getTeam(match.homeTeamId);
  const awayTeam = getTeam(match.awayTeamId);
  if (!homeTeam || !awayTeam) return undefined;
  return { ...match, homeTeam, awayTeam };
}

function buildFaq(
  team: Team | undefined,
  competition: Competition,
  providersList: ReturnType<typeof findBroadcasters>,
  focus: 'team' | 'competition' = 'team',
): FAQEntry[] {
  const providerNames = (providersList.length ? providersList : findBroadcasters(competition.defaultBroadcasters))
    .map((p) => p.name)
    .join(', ');
  const firstQuestion = focus === 'team' && team
    ? `Wer überträgt ${team.name}?`
    : `Wer zeigt die ${competition.shortName}?`;
  const firstAnswer = providerNames
    ? `${focus === 'team' && team ? team.name : competition.shortName} wird in Deutschland bei ${providerNames} gezeigt.`
    : 'Die Übertragungspartner werden noch bestätigt.';
  return [
    {
      question: firstQuestion,
      answer: firstAnswer,
    },
    {
      question: 'Gibt es einen kostenlosen Stream?',
      answer: 'Kostenlose Streams gibt es nur, wenn Free-TV-Anbieter Rechte halten. Prüfe die Liste der Partner oben.',
    },
    {
      question: 'Wann beginnt die Vorberichterstattung?',
      answer: 'Die Sender starten ihre Vorberichte in der Regel 30 bis 60 Minuten vor dem Anstoß.',
    },
  ];
}

function handleTeamDay(pathSegments: string[], dayOffset: number): Response {
  const [prefix, teamSlug] = pathSegments;
  if (!teamSlug) return notFound();

  const team = findTeamBySlug(teamSlug);
  if (!team) return notFound();

  const dayLabel = getDayLabel(dayOffset);
  const targetDate = offsetDate(dayOffset);
  const teamMatches = findMatchesByTeam(team.id);
  const highlightedMatch = teamMatches.find((match) => sameDay(new Date(match.kickoff), targetDate));
  const fallbackMatch = highlightedMatch ?? teamMatches[0];

  const competition = fallbackMatch
    ? getCompetition(fallbackMatch.competitionId)
    : team.competitions[0]
      ? getCompetition(team.competitions[0])
      : undefined;

  if (!competition) return notFound();

  const opponent = fallbackMatch
    ? getTeam(fallbackMatch.homeTeamId === team.id ? fallbackMatch.awayTeamId : fallbackMatch.homeTeamId)
    : undefined;

  const providersList = findBroadcasters(highlightedMatch?.broadcasters ?? fallbackMatch?.broadcasters);
  const defaultProviders = findBroadcasters(competition.defaultBroadcasters);

  const otherMatches = findMatchesByCompetition(competition.id)
    .filter((match) => match.id !== fallbackMatch?.id)
    .map(enrichMatch)
    .filter((match): match is MatchWithTeams => Boolean(match))
    .slice(0, 6);

  let message: string | undefined;
  if (!highlightedMatch) {
    if (teamMatches.length && fallbackMatch) {
      message = `Keine Partie am ${formatDateGerman(targetDate)}. Nächstes Spiel: ${formatDateGerman(new Date(fallbackMatch.kickoff))}.`;
    } else {
      message = `Für ${team.name} liegen aktuell keine Termine vor.`;
    }
  }

  const title = `${dayLabel} ${team.shortName}: Wer zeigt ${team.shortName}? TV & Stream`;
  const providerNames = providersList.length ? providersList : defaultProviders;
  const description = `${team.name}: Übertragung ${dayLabel.toLowerCase()} im Wettbewerb ${competition.shortName}. Sender & Streams: ${providerNames
    .map((p) => p.name)
    .join(', ')}.`;

  const html = renderPage({
    baseUrl: BASE_URL,
    canonicalPath: `/${prefix}/${team.slug}`,
    title,
    description,
    kind: 'team-day',
    dayLabel,
    targetDate,
    competition,
    highlightedMatch,
    team,
    opponent,
    providers: providersList,
    defaultProviders,
    additionalMatches: otherMatches,
    message,
    faq: buildFaq(team, competition, providersList, 'team'),
  });

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, stale-while-revalidate=600',
    },
  });
}

function handleCompetitionDay(pathSegments: string[], dayOffset: number): Response {
  const [, competitionSlug] = pathSegments;
  if (!competitionSlug) return notFound();

  const competition = findCompetitionBySlug(competitionSlug);
  if (!competition) return notFound();

  const dayLabel = getDayLabel(dayOffset);
  const targetDate = offsetDate(dayOffset);
  const competitionMatches = findMatchesByCompetition(competition.id);
  const matchesOnDay = competitionMatches.filter((match) => sameDay(new Date(match.kickoff), targetDate));
  const highlightedMatch = matchesOnDay[0] ?? competitionMatches[0];

  const providersList = findBroadcasters(highlightedMatch?.broadcasters ?? competition.defaultBroadcasters);
  const defaultProviders = findBroadcasters(competition.defaultBroadcasters);

  const otherMatches = competitionMatches
    .filter((match) => match.id !== highlightedMatch?.id)
    .map(enrichMatch)
    .filter((match): match is MatchWithTeams => Boolean(match))
    .slice(0, 8);

  let message: string | undefined;
  if (!matchesOnDay.length) {
    if (highlightedMatch) {
      message = `Keine Partie am ${formatDateGerman(targetDate)}. Nächstes Spiel: ${formatDateGerman(new Date(highlightedMatch.kickoff))}.`;
    } else {
      message = `Termine für die ${competition.shortName} werden aktualisiert.`;
    }
  }

  const providerNames = providersList.length ? providersList : defaultProviders;
  const title = `${dayLabel} ${competition.shortName}: Spiele & TV-Übertragung`;
  const description = `${competition.shortName} (${competition.season}): Übertragung ${dayLabel.toLowerCase()} in Deutschland. Sender: ${providerNames
    .map((p) => p.name)
    .join(', ')}.`;

  const homeTeam = highlightedMatch ? getTeam(highlightedMatch.homeTeamId) : undefined;
  const awayTeam = highlightedMatch ? getTeam(highlightedMatch.awayTeamId) : undefined;

  const html = renderPage({
    baseUrl: BASE_URL,
    canonicalPath: `/${pathSegments[0]}/${competition.slug}`,
    title,
    description,
    kind: 'competition-day',
    dayLabel,
    targetDate,
    competition,
    highlightedMatch,
    team: homeTeam,
    opponent: awayTeam,
    providers: providersList,
    defaultProviders,
    additionalMatches: otherMatches,
    message,
    faq: buildFaq(undefined, competition, providersList, 'competition'),
  });

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, stale-while-revalidate=600',
    },
  });
}

function formatDateGerman(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function notFound(): Response {
  const body = `<!doctype html><html lang="de"><head><meta charset="utf-8" /><title>404 · Seite nicht gefunden</title><meta name="robots" content="noindex" /><style>${basic404Css}</style></head><body><main><h1>Seite nicht gefunden</h1><p>Leider konnten wir die gewünschte Seite nicht finden. Prüfe die URL oder starte auf <a href="/">werzeigt.de</a>.</p></main></body></html>`;
  return new Response(body, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

const basic404Css = `body{margin:0;background:#000;color:#fff;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center}main{max-width:640px;padding:2rem;text-align:center}a{color:#16a34a}`;

function handleRoot(): Response {
  const description = 'Finde heraus, welcher Sender heute und morgen deinen Lieblingsverein zeigt. Schnell, übersichtlich, werzeigt.de.';
  const heroHtml = `<!doctype html><html lang="de"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>werzeigt.de · Fußball Übertragungen</title><meta name="description" content="${description}" /><style>${basicHomeCss}</style></head><body><main><h1>werzeigt.de</h1><p>Finde die TV- und Streaming-Übertragungen für deinen Verein. Beispiele:</p><ul><li><a href="/heute/bayern">Wer überträgt heute Bayern?</a></li><li><a href="/heute/dortmund">Wer zeigt heute Dortmund?</a></li><li><a href="/morgen/champions-league">Champions League morgen im TV</a></li></ul></main></body></html>`;
  return new Response(heroHtml, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}

const basicHomeCss = `body{margin:0;background:#000;color:#fff;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center}main{max-width:640px;padding:2rem;text-align:center}a{color:#16a34a;font-weight:600}`;

function handleSitemap(): Response {
  const urls = [
    '/heute/bayern',
    '/heute/dortmund',
    '/morgen/champions-league',
    '/morgen/europa-league',
    ...teams.map((team) => `/heute/${team.slug}`),
    ...competitions.map((competition) => `/morgen/${competition.slug}`),
  ];
  const unique = Array.from(new Set(urls));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique
    .map((path) => `  <url><loc>${BASE_URL.replace(/\/$/, '')}${path}</loc></url>`)
    .join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}

function handleRobots(): Response {
  const body = `User-agent: *\nAllow: /\nSitemap: ${BASE_URL.replace(/\/$/, '')}/sitemap.xml`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(req.url);
    const path = normalisePath(url.pathname);

    if (path === '/') return handleRoot();
    if (path === '/robots.txt') return handleRobots();
    if (path === '/sitemap.xml') return handleSitemap();

    const segments = path.split('/').filter(Boolean);
    if (segments[0] === 'heute') {
      return handleTeamDay(['heute', segments[1]], 0);
    }
    if (segments[0] === 'morgen') {
      const team = segments[1] ? findTeamBySlug(segments[1]) : undefined;
      if (team) {
        return handleTeamDay(['morgen', team.slug], 1);
      }
      return handleCompetitionDay(['morgen', segments[1]], 1);
    }

    return notFound();
  },
});

console.log(`🚀 werzeigt.de server läuft auf ${server.url}`);
