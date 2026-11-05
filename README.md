# Weather Prediction Website

A responsive weather interface built with plain **HTML, CSS, and JavaScript** — search any city and see its current weather at a glance, with a focus on clear presentation and ease of use.

No frameworks, no build step: clone it, open it, search.

## What It Provides

- **City search** — type a city name and press the search button.
- **Current conditions** on a single card:
  - temperature in °C (metric units),
  - humidity (%),
  - wind speed (km/h),
  - a weather-condition icon.
- **"City not found" error state** for invalid or unknown cities.

> Despite the project name, this shows the **current weather** (it does not yet forecast future conditions).

## Data Source

The **[OpenWeatherMap Current Weather API](https://openweathermap.org/current)** (`api.openweathermap.org/data/2.5/weather`, `units=metric`), called directly from the browser with `fetch`.

`index.html` contains an OpenWeatherMap API key so the app runs out of the box; replace it with your own free key from [openweathermap.org](https://openweathermap.org/api) if needed.

## Weather Icons

Condition icons live in the repository root and are switched in JavaScript based on the OpenWeatherMap condition. Icon paths are relative to `index.html` (e.g. `./clouds.png`):

| Condition      | Icon          | Notes                                            |
| -------------- | ------------- | ------------------------------------------------ |
| Clear          | `clear.png`   |                                                  |
| Clouds         | `clouds.png`  |                                                  |
| Rain           | `rain.png`    |                                                  |
| Drizzle        | `drizzle.png` |                                                  |
| Mist           | `mist.png`    |                                                  |
| Thunderstorm   | `rain.png`    | no dedicated thunderstorm asset — rain is reused |
| Snow           | `snow.png`    | dedicated snow icon                              |
| any other      | `clouds.png`  | fallback for unmapped conditions                 |

## Tech Stack

| Component   | Technology                  |
| ----------- | ---------------------------- |
| Structure   | HTML                         |
| Styling     | CSS (custom, no frameworks)  |
| Logic       | Vanilla JavaScript (`fetch`) |
| Data source | OpenWeatherMap API           |

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
└── wind.png
```

## Installation & Running

Requirements: any modern browser. No dependencies, no build step.

```bash
git clone https://github.com/ThammannagariGangaraju/weather-prediction-.git
cd weather-prediction-
```

**Option 1 — open directly:** double-click `index.html`.

**Option 2 — local server:**

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Then type a city name (e.g. *Bangalore*, *London*) and press the search button.

## Known Issues

- **No default city on load** — the page calls `checkWeather()` without a city, so the weather card stays hidden and only appears after a successful search.
- **Search is button-only** — the search button is the only trigger (there is no Enter-key handler on the input).
- **Thunderstorm has no dedicated icon** — it currently reuses `rain.png`; a dedicated asset could be added later.
- **Hardcoded, publicly exposed API key** — the OpenWeatherMap key ships inline in `index.html` and is visible to anyone who clones or reads this repository. It should be **rotated** and moved to a server-side environment variable or backend proxy; shipping the key inside frontend code (or a frontend "environment variable") is not secure.

> This README documents the current source including the corrected icon paths and complete condition mapping in `index.html`. The icon-path and condition-mapping fix is published in the same commit as this README.

## Limitations & Future Improvements

- **Current weather only** — no multi-day forecast, which the project title hints at; the OpenWeatherMap Forecast endpoint could be added.
- **No geolocation** — location auto-detection could remove the need to type a city.
- **Dedicated thunderstorm icon** — add a matching asset instead of reusing `rain.png`.

---

Built by [Gangaraju Thammannagari](https://github.com/ThammannagariGangaraju).
