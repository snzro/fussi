import type { Broadcaster, Competition, Match, Team } from './data';

type PageKind = 'team-day' | 'competition-day';

interface BasePageProps {
  baseUrl: string;
  canonicalPath: string;
  title: string;
  description: string;
  kind: PageKind;
  dayLabel: string; // Heute, Morgen, etc.
  targetDate: Date;
  competition: Competition;
  highlightedMatch?: Match;
  team?: Team;
  opponent?: Team;
  providers: Broadcaster[];
  defaultProviders: Broadcaster[];
  additionalMatches: MatchWithTeams[];
  message?: string;
  faq?: FAQEntry[];
}

export interface MatchWithTeams extends Match {
  homeTeam: Team;
  awayTeam: Team;
}

export interface FAQEntry {
  question: string;
  answer: string;
}

const baseCss = `:root {
  color-scheme: dark;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: #000;
  color: #fff;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,1) 60%, rgba(12,12,12,1) 100%);
}
a {
  color: inherit;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
.container {
  margin: 0 auto;
  max-width: min(1110px, 92vw);
}
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
  background: rgba(0,0,0,0.92);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
}
.brand {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.brand span {
  color: #16a34a;
}
.simple-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.2);
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.simple-button:hover {
  background: #fff;
  color: #000;
}
.hero {
  padding: clamp(2rem, 6vw, 3.75rem) 1.5rem 1rem;
}
.hero h1 {
  font-size: clamp(2.25rem, 6vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0;
}
.hero h1 span {
  white-space: nowrap;
}
.hero p {
  margin-top: 1rem;
  color: rgba(255,255,255,0.76);
  font-size: clamp(1.05rem, 3vw, 1.35rem);
  line-height: 1.5;
}
.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}
.cta-primary {
  background: #16a34a;
  color: #000;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.85rem 1.6rem;
  border-radius: 999px;
  transition: background 0.2s ease;
}
.cta-primary:hover {
  background: #15803d;
  color: #fff;
}
.cta-secondary {
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.85rem 1.6rem;
  font-weight: 600;
}
.ad-slot {
  margin: 0 1.5rem;
  margin-bottom: 2.5rem;
}
.ad-box {
  width: 100%;
  min-height: clamp(120px, 25vw, 260px);
  display: grid;
  place-items: center;
  color: rgba(255,255,255,0.58);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 18px;
  font-size: clamp(0.85rem, 2vw, 1.05rem);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
main {
  padding: 0 1.5rem 4rem;
}
.card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: clamp(1.5rem, 4vw, 2rem);
}
.card + .card {
  margin-top: 2rem;
}
.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
@media (min-width: 768px) {
  .card-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.card-title {
  font-size: clamp(1.65rem, 3.5vw, 2.25rem);
  font-weight: 700;
  margin: 0;
}
.meta-info {
  color: rgba(255,255,255,0.78);
  font-size: 1rem;
}
.provider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
}
.provider-card {
  background: #fff;
  color: #000;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.provider-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(22,163,74,0.15);
}
.facts {
  margin-top: 2rem;
}
.facts h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.35rem;
}
.facts ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}
.facts li {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 0.5rem;
  font-size: 1rem;
}
.facts li::before {
  content: '';
  width: 8px;
  height: 8px;
  margin-top: 0.4rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.5);
}
.list {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.25rem;
}
.list a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  transition: background 0.2s ease, transform 0.2s ease;
}
.list a:hover {
  background: rgba(255,255,255,0.08);
  transform: translateY(-2px);
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.65);
}
.faq details {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  transition: border 0.2s ease;
}
.faq summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 1.05rem;
  list-style: none;
}
.faq details[open] {
  border-color: rgba(22,163,74,0.65);
}
.faq p {
  margin-top: 0.75rem;
  color: rgba(255,255,255,0.75);
  font-size: 0.95rem;
  line-height: 1.55;
}
footer {
  border-top: 1px solid rgba(255,255,255,0.12);
  margin-top: 4rem;
}
.footer-content {
  padding: 2rem 1.5rem 3rem;
  display: grid;
  gap: 1.25rem;
}
.footer-links {
  display: grid;
  gap: 0.6rem;
  font-size: 0.95rem;
}
.footer-meta {
  color: rgba(255,255,255,0.55);
  font-size: 0.9rem;
}
@media (min-width: 720px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}
.visually-hidden {
  position: absolute;
  top: -200vh;
  left: -200vw;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
`; // end CSS

function escapeHtml(value: string | undefined | null): string {
  if (value == null) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateTimeDisplay(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function isoDate(date: Date): string {
  return date.toISOString();
}

function renderProviderList(providers: Broadcaster[]): string {
  if (!providers.length) {
    return '<p>Informationen zu den Übertragungen werden in Kürze ergänzt.</p>';
  }

  return providers
    .map((provider) => {
      const countryList = provider.countries.join(', ');
      return `<a class="provider-card" href="${escapeHtml(provider.url)}" rel="noopener" target="_blank">
        <span>${escapeHtml(provider.name)}</span>
        <span class="badge">${escapeHtml(provider.category.toUpperCase())} · ${escapeHtml(countryList)}</span>
      </a>`;
    })
    .join('');
}

function renderMatchList(matches: MatchWithTeams[]): string {
  if (!matches.length) {
    return '<p>Weitere Ansetzungen folgen.</p>';
  }

  return matches
    .map((match) => {
      const kickoffDate = new Date(match.kickoff);
      return `<a href="/heute/${escapeHtml(match.homeTeam.slug)}" aria-label="Infos zu ${escapeHtml(match.homeTeam.name)} gegen ${escapeHtml(match.awayTeam.name)}">
        <div>
          <strong>${escapeHtml(match.homeTeam.shortName)} vs. ${escapeHtml(match.awayTeam.shortName)}</strong>
          <div class="badge">${escapeHtml(match.stage)}</div>
        </div>
        <time datetime="${isoDate(kickoffDate)}">${formatDateTimeDisplay(kickoffDate)}</time>
      </a>`;
    })
    .join('');
}

function renderFAQ(entries: FAQEntry[] | undefined): string {
  if (!entries?.length) return '';
  return `<section class="card faq" id="faq">
    <h2>Häufige Fragen</h2>
    <div class="list">
      ${entries
        .map(
          (item) => `<details>
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>`,
        )
        .join('')}
    </div>
  </section>`;
}

function renderFacts(match: Match | undefined, competition: Competition, team?: Team): string {
  const facts: string[] = [];
  if (match) {
    facts.push(
      `Wettbewerb: ${escapeHtml(competition.name)} (${escapeHtml(competition.season)})`,
    );
    facts.push(`Spielort: ${escapeHtml(match.stadium)} · ${escapeHtml(match.city)}`);
    facts.push(`Anstoßzeit lokal: ${formatTime(new Date(match.kickoff))} Uhr`);
  } else {
    facts.push(`Wettbewerb: ${escapeHtml(competition.name)} (${escapeHtml(competition.season)})`);
  }
  if (team) {
    facts.push(`Team: ${escapeHtml(team.name)} (${escapeHtml(team.league)})`);
  }
  facts.push(`TV-Rechte: ${escapeHtml(competition.organiser)} · ${escapeHtml(competition.tier)}`);
  return `<section class="facts">
    <h3>Fakten</h3>
    <ul>${facts.map((fact) => `<li>${fact}</li>`).join('')}</ul>
  </section>`;
}

function renderJsonLd(props: BasePageProps): string {
  if (!props.highlightedMatch || !props.team || !props.opponent) {
    return '';
  }
  const match = props.highlightedMatch;
  const date = new Date(match.kickoff);
  const json = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${props.team.name} vs. ${props.opponent.name}`,
    sport: 'Soccer',
    startDate: date.toISOString(),
    endDate: new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    location: {
      '@type': 'Place',
      name: match.stadium,
      address: match.city,
    },
    competitor: [
      {
        '@type': 'SportsOrganization',
        name: props.team.name,
      },
      {
        '@type': 'SportsOrganization',
        name: props.opponent.name,
      },
    ],
    offers: props.providers.map((provider) => ({
      '@type': 'Offer',
      name: provider.name,
      url: provider.url,
      availability: 'https://schema.org/InStock',
      category: provider.category,
    })),
  };
  const jsonString = JSON.stringify(json).replace(/</g, '\\u003C');
  return `<script type="application/ld+json">${jsonString}</script>`;
}

export function renderPage(props: BasePageProps): string {
  const { highlightedMatch, team, opponent, providers, additionalMatches, baseUrl, canonicalPath } = props;
  const matchDate = highlightedMatch ? new Date(highlightedMatch.kickoff) : undefined;
  const canonicalUrl = `${baseUrl.replace(/\/$/, '')}${canonicalPath}`;
  const headlineTeamPart = team ? `<span>${escapeHtml(team.name)}</span>` : escapeHtml(props.competition.shortName);
  const heroHeadline = props.kind === 'competition-day'
    ? `Wer überträgt ${escapeHtml(props.dayLabel.toLowerCase())} ${escapeHtml(props.competition.shortName)}?`
    : `Wer zeigt ${escapeHtml(props.dayLabel.toLowerCase())} ${headlineTeamPart}?`;
  const heroSubline = highlightedMatch && team && opponent
    ? `${escapeHtml(team.shortName)} gegen ${escapeHtml(opponent.shortName)} · ${props.competition.shortName}`
    : `Übertragungen im Wettbewerb ${escapeHtml(props.competition.shortName)} (${escapeHtml(props.competition.season)}).`;

  const meta = {
    title: props.title,
    description: props.description,
    canonical: canonicalUrl,
  };

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <link rel="canonical" href="${escapeHtml(meta.canonical)}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:url" content="${escapeHtml(meta.canonical)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <style>${baseCss}</style>
  ${renderJsonLd(props)}
</head>
<body>
  <a class="visually-hidden" href="#main">Zum Inhalt springen</a>
  <header class="navbar">
    <div class="navbar-content container">
      <a class="brand" href="/">werzeigt<span>.de</span></a>
      <nav>
        <a class="simple-button" href="/heute/bayern">Heute Bayern</a>
      </nav>
    </div>
  </header>

  <section class="hero container">
    <h1>${heroHeadline}</h1>
    <p>${escapeHtml(heroSubline)}</p>
    <div class="cta-row">
      <a class="cta-primary" href="#anbieter">Jetzt Übertragung anzeigen</a>
      ${team ? `<a class="cta-secondary" href="/teams/${escapeHtml(team.slug)}">Teamseite ${escapeHtml(team.shortName)}</a>` : ''}
    </div>
  </section>

  <aside class="ad-slot container" aria-label="Anzeige">
    <div class="ad-box">Werbeplatz (Leaderboard)</div>
  </aside>

  <main id="main" class="container">
    <article class="card" aria-labelledby="match-heading">
      <header class="card-header">
        <div>
          <div class="badge">${escapeHtml(props.dayLabel)}</div>
          <h2 id="match-heading" class="card-title">${highlightedMatch && team && opponent
            ? `${escapeHtml(team.shortName)} vs. ${escapeHtml(opponent.shortName)}`
            : `${escapeHtml(props.competition.name)}`}</h2>
        </div>
        <div class="meta-info">
          ${matchDate ? `Anstoß: <time datetime="${isoDate(matchDate)}">${formatDateTimeDisplay(matchDate)}</time>` : escapeHtml(props.message ?? `Aktuelle Termine für ${escapeHtml(props.dayLabel)} werden bald ergänzt.`)}
        </div>
      </header>

      <section id="anbieter">
        <h3>In Deutschland streamen/sehen</h3>
        <div class="provider-grid">
          ${renderProviderList(providers.length ? providers : props.defaultProviders)}
        </div>
      </section>

      ${renderFacts(highlightedMatch, props.competition, team)}
    </article>

    <aside class="ad-slot" aria-label="Anzeige">
      <div class="ad-box">Werbeplatz (In-Article)</div>
    </aside>

    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Weitere Spiele</h2>
        <span class="meta-info">${escapeHtml(props.competition.shortName)} · ${escapeHtml(props.competition.season)}</span>
      </header>
      <div class="list">
        ${renderMatchList(additionalMatches)}
      </div>
    </section>

    ${renderFAQ(props.faq)}

    <aside class="ad-slot" aria-label="Anzeige">
      <div class="ad-box">Werbeplatz (Footer)</div>
    </aside>
  </main>

  <footer>
    <div class="footer-content container">
      <nav class="footer-links" aria-label="Service">
        <a href="/impressum">Impressum</a>
        <a href="/datenschutz">Datenschutz</a>
        <a href="/kontakt">Kontakt</a>
        <a href="/barrierefreiheit">Barrierefreiheit</a>
      </nav>
      <div class="footer-meta">© ${new Date().getFullYear()} werzeigt.de · Deutschland</div>
    </div>
  </footer>
</body>
</html>`;
}
