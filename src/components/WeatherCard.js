import React from "react";
import { FaStar } from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Lora:wght@400;600&display=swap');

  .wc-star {
    cursor: pointer;
    transition: transform 0.2s ease, filter 0.2s ease;
    flex-shrink: 0;
  }
  .wc-star:hover  { transform: scale(1.3) rotate(10deg); }
  .wc-star.fav    { filter: drop-shadow(0 0 5px #fbbf2499); }

  .wc-stat-tile {
    transition: transform 0.18s ease;
    cursor: default;
  }
  .wc-stat-tile:hover { transform: translateY(-2px); }

  @keyframes wcFadeIn {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .wc-animate { animation: wcFadeIn 0.45s ease both; }
`;

function getTempColor(temp) {
  const t = parseFloat(temp);
  if (isNaN(t)) return "#64748b";
  if (t >= 38)  return "#a92d2d";  // deep red
  if (t >= 32)  return "#d0653b";  // burnt orange
  if (t >= 24)  return "#dfc661";  // yellow & readable
  if (t >= 15)  return "#20a17d";  // deep emerald
  if (t >= 5)   return "#3155b8";  // strong blue
  return "#5b21b6";                // deep violet
}

function SunArc({ sunrise, sunset, isDark }) {
  const glass = {
    background: isDark ? "rgba(30,60,120,0.55)" : "rgba(255,255,255,0.65)",
    border: isDark ? "1px solid rgba(100,160,255,0.25)" : "1px solid rgba(180,210,255,0.5)",
    borderRadius: "16px",
    padding: "1rem 1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    backdropFilter: "blur(20px)",
    boxShadow: isDark
      ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 6px 24px rgba(100,160,255,0.1)",
  };

  return (
    <div style={glass}>
      {/* Sunrise */}
      <div style={{ textAlign: "center", fontFamily: "'Sora',sans-serif", minWidth: 60 }}>
        <div style={{ fontSize: "1.3rem" }}>🌅</div>
        <div style={{
          fontWeight: 700, fontSize: "0.85rem", marginTop: "0.2rem",
          color: isDark ? "#fde68a" : "#b45309",
        }}>{sunrise}</div>
        <div style={{
          fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em",
          color: isDark ? "rgba(180,210,255,0.65)" : "rgba(15,39,68,0.4)",
        }}>Sunrise</div>
      </div>

      {/* Arc SVG */}
      <div style={{ flex: 1, height: 54 }}>
        <svg viewBox="0 0 200 65" style={{ width: "100%", height: "100%" }}>
          <path d="M 8 58 Q 100 -5 192 58" fill="none"
            stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(100,160,255,0.2)"}
            strokeWidth="2" strokeDasharray="4 3" />
          <path d="M 8 58 Q 100 -5 192 58" fill="none"
            stroke="url(#sg)" strokeWidth="2.5"
            strokeDasharray="300" strokeDashoffset="120" />
          <circle cx="145" cy="20" r="5.5" fill="#fbbf24"
            style={{ filter: "drop-shadow(0 0 6px #fbbf24bb)" }} />
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Sunset */}
      <div style={{ textAlign: "center", fontFamily: "'Sora',sans-serif", minWidth: 60 }}>
        <div style={{ fontSize: "1.3rem" }}>🌇</div>
        <div style={{
          fontWeight: 700, fontSize: "0.85rem", marginTop: "0.2rem",
          color: isDark ? "#fda4af" : "#be123c",
        }}>{sunset}</div>
        <div style={{
          fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em",
          color: isDark ? "rgba(180,210,255,0.65)" : "rgba(15,39,68,0.4)",
        }}>Sunset</div>
      </div>
    </div>
  );
}

export default function WeatherCard({
  city, current, localtime,
  favourites = [], addToFavourites, removeFromFavourites,
  showRemoveButton = false, cardWidth = "100%",
  darkMode, astro,
}) {
  const isDark = darkMode;
  const isFav  = city ? favourites.includes(city.toLowerCase()) : false;

  if (!current) {
    return (
      <>
        <style>{styles}</style>
        <div style={{
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
          borderRadius: "20px", padding: "1.5rem", textAlign: "center",
          color: "#f87171", fontFamily: "'Sora',sans-serif",
          maxWidth: cardWidth, width: "100%",
        }}>⚠️ Unable to fetch weather data</div>
      </>
    );
  }

  const timeStr = localtime
    ? new Date(localtime.replace(" ", "T")).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

  const tempColor = getTempColor(current.temp);

  // Glassmorphism card style — lighter in dark mode for visibility
  const glass = (extra = {}) => ({
    background: isDark ? "rgba(30,60,120,0.55)" : "rgba(255,255,255,0.65)",
    border: isDark ? "1px solid rgba(100,160,255,0.25)" : "1px solid rgba(180,210,255,0.55)",
    borderRadius: "18px",
    backdropFilter: "blur(20px)",
    boxShadow: isDark
      ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 6px 24px rgba(100,160,255,0.1)",
    ...extra,
  });

  const stats = [
    { icon: "💧", label: "Humidity",   value: `${current.humidity}%` },
    { icon: "💨", label: "Wind",       value: current.wind != null ? (typeof current.wind === "number" ? `${current.wind} km/h` : current.wind) : "—" },
    { icon: "☀️", label: "UV Index",   value: current.uv ?? "—" },
    { icon: "🔵", label: "Pressure",   value: current.pressure_mb != null ? `${current.pressure_mb} mb` : "—" },
    { icon: "👁️", label: "Visibility", value: current.vis_km != null ? `${current.vis_km} km` : "—" },
    { icon: "☁️", label: "Cloud",      value: current.cloud != null ? `${current.cloud}%` : "—" },
  ].filter(s => s.value !== "—");

  return (
    <>
      <style>{styles}</style>

      <div className="wc-animate" style={{
        width: cardWidth,
        fontFamily: "'Sora',sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}>

        {/* ── Current weather card ── */}
        <div style={{ ...glass(), padding: "1.5rem", position: "relative", overflow: "hidden" }}>


          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h2 style={{
                  fontFamily: "'Lora',serif", fontWeight: 600, fontSize: "1.55rem",
                  margin: 0, letterSpacing: "-0.02em",
                  color: isDark ? "#ffffff" : "#0f2744",
                }}>{city}</h2>
                {addToFavourites && (
                  <FaStar
                    className={"wc-star" + (isFav ? " fav" : "")}
                    size={14}
                    color={isFav ? "#fbbf24" : (isDark ? "rgba(255,255,255,0.5)" : "rgba(15,39,68,0.2)")}
                    title={isFav ? "Saved" : "Save city"}
                    onClick={() => !isFav && addToFavourites(city.toLowerCase())}
                    style={{ cursor: isFav ? "default" : "pointer", marginTop: 2 }}
                  />
                )}
              </div>
              <p style={{
                margin: "0.2rem 0 0", fontSize: "0.78rem",
                color: isDark ? "rgba(180,210,255,0.65)" : "rgba(15,39,68,0.4)",
              }}>
                🕐 Current Weather · {timeStr}
              </p>
            </div>
            {showRemoveButton && removeFromFavourites && (
              <button onClick={() => removeFromFavourites(city.toLowerCase())} style={{
                background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                color: "#f87171", borderRadius: "50px", padding: "0.28rem 0.8rem",
                cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, fontFamily: "'Sora',sans-serif",
              }}>✕ Remove</button>
            )}
          </div>

          {/* Temp + icon */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <img src={current.icon} alt={current.desc}
              style={{
                width: 68, height: 68, objectFit: "contain",
                filter: isDark
                  ? "drop-shadow(0 4px 12px rgba(0,0,0,0.5)) brightness(1.1)"
                  : "drop-shadow(0 4px 10px rgba(100,160,255,0.3))",
              }}
            />
            <div>
              <div style={{
                fontFamily: "'Lora',serif", fontWeight: 600,
                fontSize: "3.6rem", lineHeight: 1,
                color: tempColor,
                textShadow: isDark ? `0 0 32px ${tempColor}66` : "none",
              }}>{current.temp}°</div>
              <div style={{
                fontSize: "0.95rem", marginTop: "0.2rem",
                color: isDark ? "rgba(220,235,255,0.90)" : "rgba(15,39,68,0.65)",
              }}>
                {current.desc}
              </div>
              {current.feelslike_c != null && (
                <div style={{
                  fontSize: "0.75rem", marginTop: "0.12rem",
                  color: isDark ? "rgba(180,210,255,0.65)" : "rgba(15,39,68,0.38)",
                }}>
                  Feels like {current.feelslike_c}°C
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats grid ── */}
        {stats.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.55rem" }}>
            {stats.map(({ icon, label, value }) => (
              <div key={label} className="wc-stat-tile" style={{ ...glass(), padding: "0.85rem 0.6rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>{icon}</div>
                <div style={{
                  fontWeight: 700, fontSize: "0.95rem",
                  color: isDark ? "#e8f4ff" : "#0c1f3a",
                }}>{value}</div>
                <div style={{
                  fontSize: "0.63rem", textTransform: "uppercase",
                  letterSpacing: "0.07em", marginTop: "0.15rem",
                  color: isDark ? "rgba(200,225,255,0.90)" : "rgba(12,31,58,0.55)",
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Sun arc ── */}
        {astro?.sunrise && <SunArc sunrise={astro.sunrise} sunset={astro.sunset} isDark={isDark} />}

      </div>
    </>
  );
}