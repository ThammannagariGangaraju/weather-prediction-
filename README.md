# Weather Prediction Website

A responsive weather interface built with plain **HTML, CSS, and JavaScript** — search any city and see its current weather at a glance, with a focus on clear presentation and ease of use.

No frameworks, no build step. Weather requests run through a small server-side proxy (a Cloudflare Pages Function) so the API key never touches the browser.

## What It Provides

- **City search** — type a city name and press the search button or press **Enter** in the field.
- **Default city** — the app opens showing current weather for **Bangalore** (plain constant, documented; no geolocation permission is ever requested).
- **Current conditions** on a single card:
  - temperature in °C (metric units),
  - humidity (%),
  - wind speed (km/h),
  - a weather-condition icon.
- **"City not found" error state** for invalid or unknown cities.
- **Safe error feedback** — provider/server outages surface a generic "Weather service is unavailable. Please try again." message; raw provider payloads are never shown.
- **Loading state** — the search button is disabled while a lookup is in flight; repeated clicks during the request are ignored.

> Despite the project name, this shows the **current weather** (it does not yet forecast future conditions).

## Data Source

The **[OpenWeatherMap Current Weather API](https://openweathermap.org/current)** (`api.openweathermap.org/data/2.5/weather`, `units=metric`) — called through a **server-side proxy**, never directly from the browser:

- The frontend sends its search to `GET /api/weather?city=<name>` (a [Cloudflare Pages Function](https://developers.cloudflare.com/pages/functions/) in `functions/api/weather.js`).
- The proxy adds the OpenWeatherMap key server-side from the `OPENWEATHER_API_KEY` environment secret and returns the same data JSON the UI parses.
- The key is never present in the browser, the response bodies, or this repository.

**Configuration:** set `OPENWEATHER_API_KEY` as an environment variable on your Cloudflare Pages project (Production *and* Preview). To get a key, sign up (free) at [openweathermap.org](https://openweathermap.org/api). See [.env.example](.env.example) for the variable name; the file contains a placeholder only.

## Weather Icons

Condition icons live in the repository root and are switched in JavaScript based on the OpenWeatherMap condition. Icon paths are relative to `index.html` (e.g. `./clouds.png`):

| Condition      | Icon          | Notes                                            |
| -------------- | ------------- | ------------------------------------------------ |
| Clear          | `clear.png`   |                                                  |
| Clouds         | `clouds.png`  |                                                  |
| Rain           | `rain.png`    |                                                  |
| Drizzle        | `drizzle.png` |                                                  |
| Mist (family)  | `mist.png`    | includes Fog, Haze, Smoke, Dust, Sand, Ash       |
| Thunderstorm   | `rain.png`    | no dedicated thunderstorm asset — rain is reused |
| Snow           | `snow.png`    | dedicated snow icon                              |
| any other      | `clouds.png`  | fallback for unmapped conditions                 |

## Tech Stack

| Component   | Technology                                 |
| ----------- | -------------------------------------------- |
| Structure   | HTML                                         |
| Styling     | CSS (custom, no frameworks)                  |
| Logic       | Vanilla JavaScript (`fetch`)                 |
| Data source | OpenWeatherMap API via `/api/weather` proxy  |
| Proxy       | Cloudflare Pages Function (`functions/api`)  |

## Repository Structure

```
├── index.html    # Page structure + inline application logic
├── style.css     # Card layout and styling
├── clear.png     # Weather-condition / UI icons
├── clouds.png
├── drizzle.png
├── humidity.png
├── mist.png
├── rain.png
├── search.png
├── snow.png
├── wind.png
├── functions/
│   └── api/
│       └── weather.js    # Cloudflare Pages Function — server-side weather proxy
├── .env.example          # documents the OPENWEATHER_API_KEY variable (placeholder only)
└── .gitignore            # keeps .env / .dev.vars and other local secrets out of git
```

## Installation & Running

Requirements: any modern browser for the UI — plus the deployed proxy for weather data, because the OpenWeatherMap key lives server-side. **Opening `index.html` directly from the filesystem will load the page but weather lookups will not work** without the `/api/weather` endpoint behind it.

### Deploy on Cloudflare Pages

1. Push this repository to GitHub (it already is).
2. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **Workers & Pages → Create → Pages → Connect to Git** and select this repository.
3. Build settings: no build command, output directory `/` (root). Functions in `functions/` are picked up automatically and exposed at `/api/weather`.
4. Under the Pages project, open **Settings → Environment variables** and add `OPENWEATHER_API_KEY` (your own free OpenWeatherMap key) for **Production** and **Preview**.
5. Deploy. The site is then served by Cloudflare with the working proxy.

### Local development (optional)

```bash
git clone https://github.com/ThammannagariGangaraju/weather-prediction-.git
cd weather-prediction-
# put your own key in .dev.vars (git-ignored; see .env.example for the name):
#   OPENWEATHER_API_KEY=your_own_key_here
npx wrangler pages dev .
# then open the printed localhost URL and search a city
```

Then type a city name (e.g. *Bangalore*, *London*) and press the search button or press **Enter**.

## Known Issues

- **Thunderstorm has no dedicated icon** — it currently reuses `rain.png`; a dedicated asset could be added later.
- **Legacy key exposure in Git history** — an earlier revision of this app embedded an OpenWeatherMap key directly in `index.html`, and that value remains in the repository's commit history. The key is **rotated/revocable only in the OpenWeatherMap dashboard** — the server-side move does not undo the historical exposure. Anyone who already saw the old key can keep using it until it is revoked; rotating the key is the property owner's manual step and is not done by code changes.

> This README documents the current source, including the corrected icon paths and complete condition mapping in `index.html` (published together with this README's first version) and the server-side weather proxy.

## Limitations & Future Improvements

- **Current weather only** — no multi-day forecast, which the project title hints at; the OpenWeatherMap Forecast endpoint could be added.
- **No geolocation** — location auto-detection could remove the need to type a city.
- **Dedicated thunderstorm icon** — add a matching asset instead of reusing `rain.png`.

---

Built by [Gangaraju Thammannagari](https://github.com/ThammannagariGangaraju).
