# wer-zeigts.de



# 📊 Football Data Airtable Schema

Dieses Datenmodell speichert strukturierte Fußball-Daten (UEFA + Transfermarkt).  
Es ist in vier verknüpfte Tabellen aufgeteilt:

- **Competitions** → definiert Bewerbe (Champions League, Europa League, etc.)  
- **Matches** → ein Datensatz pro Spiel  
- **Teams** → ein Datensatz pro Verein  
- **Stadiums** → ein Datensatz pro Stadion  

---

## 🏆 Competitions

Infos zu den Bewerben.

**Spalten**
- `competition_id` → eindeutige ID (z. B. `UCL`, `UEL`)  
- `name` → Bewerbsname („UEFA Champions League“, „UEFA Europa League“) 
- 'kurz_name' 
- `season` → Saison (`2024/25`)  
- `organiser` → „UEFA“  
- `tier` → Quali, Hauptbewerb, KO-Phase
- `url` → offizielle Website  

## 📅 Matches

Ein Spiel. Verknüpft mit Competitions, Teams, Stadiums.

**Spalten**
- `match_id` → UEFA Match-ID  
- `competition` → Link zu **Competitions**  
- `season`  
- `stage` → Gruppe A, Achtelfinale, Viertelfinale, etc.  
- `date` → Datum (UTC)  
- `kickoff_time` → Uhrzeit (lokal oder UTC)  
- `status` → `scheduled`, `live`, `finished`  
- `home_team` → Link zu **Teams**  
- `away_team` → Link zu **Teams**  
- `stadium` → Link zu **Stadiums**  
- `referee`  
- `attendance`  
- `detail_url` → Matchdetail-Seite  

## ⚽ Teams

Ein Verein. Mit Transfermarkt-Daten anreicherbar.

**Spalten**
- `team_id` → Transfermarkt oder UEFA ID  
- `name`  
- 'kurz_name' 
- 'logo'
- `country`  
- `founded` (Jahr)  
- `league` (z. B. Bundesliga, Premier League)  
- `stadium` → Link zu **Stadiums** (Heimstadion)  
- `squad_value` (`Kaderwert`)  
- `average_value_per_player`  
- `number_of_players`  
- `foreign_players` (% Legionäre)  
- `last_5_results` (z. B. `W-W-D-L-W`)  
- `last_match_date`  
- `uefa_coefficient_points`  
- `website`  
- `social_twitter`  
- `social_instagram`  
- `url_transfermarkt`  

## 🏟 Stadiums

Ein Stadion. Wird von Matches + Teams verknüpft.

**Spalten**
- `stadium_id` → Transfermarkt ID oder Slug  
- `name`  
- `city`  
- `country`  
- `address`  
- `capacity`  
- `year_built`  
- `latitude`  
- `longitude`  
- `home_team` → Link zu **Teams**  
- `url_details`  