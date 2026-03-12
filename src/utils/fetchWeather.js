import axios from "axios";

const KEY  = process.env.REACT_APP_WEATHER_API_KEY;
const BASE = "https://api.weatherapi.com/v1";

// ── Retry helper ─────────────────────────────────────────────────
async function withRetry(fn, retries = 2, delayMs = 600) {
  try {
    return await fn();
  } catch (err) {
    // Don't retry on abort or auth errors
    if (err.name === "AbortError" || err.response?.status === 401 || retries === 0) throw err;
    await new Promise((r) => setTimeout(r, delayMs));
    return withRetry(fn, retries - 1, delayMs * 1.5);
  }
}

// ── Friendly error messages ───────────────────────────────────────
function parseError(err) {
  if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
    const abortErr = new Error("Request cancelled");
    abortErr.name = "AbortError";
    throw abortErr;
  }

  const status  = err.response?.status;
  const apiCode = err.response?.data?.error?.code;

  if (status === 401 || apiCode === 2006 || apiCode === 2007) throw new Error("Invalid API key.");
  if (status === 400 || apiCode === 1006)                     throw new Error("City not found. Please check the name and try again.");
  if (status === 403)                                         throw new Error("API key has been disabled.");
  if (status >= 500)                                          throw new Error("WeatherAPI server error. Try again shortly.");
  if (!navigator.onLine)                                      throw new Error("No internet connection.");

  throw new Error(err.message || "Failed to fetch weather data.");
}

// ── Main fetch function ───────────────────────────────────────────
export default async function fetchWeather(opts = {}) {
  if (!KEY) throw new Error("Missing REACT_APP_WEATHER_API_KEY in .env");

  const unit = opts.unit || "metric";

  // Build query — city string or lat,lon coords
  let query = "";
  if (opts.city?.trim()) {
    query = opts.city.trim();
  } else if (opts.coords?.lat != null && opts.coords?.lon != null) {
    query = `${opts.coords.lat},${opts.coords.lon}`;
  } else {
    throw new Error("A city name or coordinates are required.");
  }

  // Fetch with auto-retry (skipped when signal is already aborted)
  let data;
  try {
    const response = await withRetry(() =>
      axios.get(`${BASE}/forecast.json`, {
        params: {
          key:    KEY,
          q:      query,
          days:   1,
          aqi:    "no",
          alerts: "no",
        },
        signal: opts.signal,
      })
    );
    data = response.data;
  } catch (err) {
    parseError(err);
  }

  // ── Derived values ────────────────────────────────────────────
  const c    = data.current;
  const loc  = data.location;
  const day0 = data.forecast.forecastday[0];

  const currentEpoch = c.last_updated_epoch;

  const next12Hours = day0.hour
    .filter((h) => h.time_epoch >= currentEpoch)
    .slice(0, 12);

  // ── Normalised return shape ───────────────────────────────────
  return {
    // Location
    city:      loc.name,
    country:   loc.country,
    region:    loc.region,
    localtime: loc.localtime,
    timezone:  loc.tz_id,

    // Current conditions
    current: {
      temp:        unit === "metric" ? c.temp_c        : c.temp_f,
      feelslike_c: c.feelslike_c,
      feelslike_f: c.feelslike_f,
      desc:        c.condition.text,
      icon:        `https:${c.condition.icon}`,
      humidity:    c.humidity,
      wind_kph:    c.wind_kph,
      wind_mph:    c.wind_mph,
      wind:        unit === "metric" ? c.wind_kph      : c.wind_mph,
      uv:          c.uv,
      pressure_mb: c.pressure_mb,
      vis_km:      c.vis_km,
      cloud:       c.cloud,
      is_day:      c.is_day,
    },

    // Astronomy
    astro: {
      sunrise: day0.astro.sunrise,
      sunset:  day0.astro.sunset,
    },

    // Next 12 hours
    hourly: next12Hours.map((h) => ({
      dt:        h.time_epoch,
      time:      h.time,
      temp:      unit === "metric" ? h.temp_c : h.temp_f,
      icon:      `https:${h.condition.icon}`,
      condition: h.condition.text,
      is_day:    h.is_day,
    })),

    // Daily forecast
    daily: data.forecast.forecastday.map((d) => ({
      day:  new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
      date: d.date,
      temp: unit === "metric" ? d.day.avgtemp_c : d.day.avgtemp_f,
      high: unit === "metric" ? d.day.maxtemp_c : d.day.maxtemp_f,
      low:  unit === "metric" ? d.day.mintemp_c : d.day.mintemp_f,
      icon: `https:${d.day.condition.icon}`,
      desc: d.day.condition.text,
    })),
  };
}