/**
 * Cloudflare Pages Function — weather proxy.
 *
 *   GET /api/weather?city=<name>
 *
 * The OpenWeatherMap key is read from the server environment only
 * (OPENWEATHER_API_KEY, configured in the Cloudflare Pages dashboard).
 * It is never embedded in, returned by, or logged from this code.
 *
 * Response contract (preserved from the previous direct-browser calls):
 *   - success  -> HTTP 200 with the OpenWeatherMap data JSON (same shape the UI parses)
 *   - unknown/invalid city -> HTTP 404 ("City not found" state in the UI)
 *   - upstream/outage/misconfiguration -> HTTP 5xx with a generic message
 *     (provider error payloads and account metadata are never forwarded)
 */

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

// City names: unicode letters/digits, spaces, and the punctuation real
// city names use (dots, commas, apostrophes, hyphens). Max 100 chars.
const CITY_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} .,'’\-]{0,99}$/u;

const UPSTREAM_BASE = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

export async function onRequestGet(context) {
  const { request, env } = context;

  const apiKey = env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return json(502, { error: 'Weather service is not configured.' });
  }

  let city = '';
  try {
    city = (new URL(request.url).searchParams.get('city') ?? '').trim();
  } catch {
    return json(404, { error: 'City not found.' });
  }

  if (!CITY_PATTERN.test(city)) {
    return json(404, { error: 'City not found.' });
  }

  let upstream;
  try {
    upstream = await fetch(
      `${UPSTREAM_BASE}${encodeURIComponent(city)}&appid=${encodeURIComponent(apiKey)}`,
    );
  } catch {
    return json(502, { error: 'Weather service is unavailable.' });
  }

  if (upstream.status === 200) {
    // Forward the successful data payload unchanged — the UI already
    // understands this shape, and it contains no secret material.
    return json(200, await upstream.json());
  }

  // 400/404 from the provider mean the city query was not found.
  if (upstream.status === 400 || upstream.status === 404) {
    return json(404, { error: 'City not found.' });
  }

  // Everything else (unauthorized key, rate limit, provider outage):
  // generic 5xx, no provider payload forwarded.
  return json(502, { error: 'Weather service is unavailable.' });
}
