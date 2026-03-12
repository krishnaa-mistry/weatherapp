import React, { useEffect, useState } from "react";
import fetchWeather from "../utils/fetchWeather";
import { useUnit } from "../context/UnitContext";
import { useTheme } from "../context/ThemeContext";
import { FaStar } from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Lora:ital,wght@0,600;1,400&display=swap');

  .fav-card-wrap { animation: favFadeUp 0.5s ease both; }
  @keyframes favFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fav-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .fav-card:hover {
    transform: translateY(-3px);
  }

  .fav-empty-pulse { animation: emptyPulse 3s ease-in-out infinite; }
  @keyframes emptyPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50%       { opacity: 0.7; transform: scale(1.05); }
  }

  .fav-skeleton {
    background: linear-gradient(90deg,
      rgba(255,255,255,0.06) 25%,
      rgba(255,255,255,0.12) 50%,
      rgba(255,255,255,0.06) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 20px;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .fav-stat-tile {
    transition: transform 0.15s ease;
  }
  .fav-stat-tile:hover { transform: translateY(-2px); }
`;

function capitalize(str) {
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getTempColor(temp, isDark) {
  const t = parseFloat(temp);
  if (isNaN(t)) return "#64748b";
  if (t >= 38)  return isDark ? "#f87171" : "#a92d2d";
  if (t >= 32)  return isDark ? "#fb923c" : "#d0653b";
  if (t >= 24)  return isDark ? "#fde68a" : "#dfc661";
  if (t >= 15)  return isDark ? "#34d399" : "#20a17d";
  if (t >= 5)   return isDark ? "#93c5fd" : "#3155b8";
  return isDark ? "#c4b5fd" : "#5b21b6";
}

function FavouriteItem({ city, idx, removeFromFavourites }) {
  const { unit }           = useUnit();
  const { isDarkMode: isDark } = useTheme();
  const [current, setCurrent] = useState(null);
  const [localtime, setLocal] = useState("");
  const [error, setError]     = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchWeather({ city, unit, signal: controller.signal })
        .then((data) => { setCurrent(data.current); setLocal(data.localtime); })
        .catch((err) => { if (err.name !== "AbortError") setError(true); });
    }, idx * 150);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [city, unit, idx]);

  const glass = {
    background: isDark ? "rgba(30,60,120,0.55)" : "rgba(255,255,255,0.65)",
    border: isDark ? "1px solid rgba(100,160,255,0.25)" : "1px solid rgba(180,210,255,0.55)",
    backdropFilter: "blur(20px)",
    boxShadow: isDark
      ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 6px 24px rgba(100,160,255,0.1)",
  };

  // ── Error ──
  if (error) {
    return (
      <div className="fav-card-wrap" style={{
        ...glass, animationDelay: `${idx * 0.08}s`,
        borderRadius: "20px",
        background: isDark ? "rgba(239,68,68,0.1)" : "rgba(254,226,226,0.8)",
        border: "1px solid rgba(239,68,68,0.3)",
        padding: "1.5rem", textAlign: "center",
        fontFamily: "'Sora',sans-serif",
      }}>
        <p style={{ color: isDark ? "#fca5a5" : "#b91c1c", fontSize: "0.88rem", margin: "0 0 0.75rem" }}>
          ⚠️ Can't load <strong>{capitalize(city)}</strong>
        </p>
        <button onClick={() => removeFromFavourites(city)} style={{
          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
          color: isDark ? "#fca5a5" : "#b91c1c", borderRadius: "50px",
          padding: "0.35rem 1rem", cursor: "pointer",
          fontSize: "0.8rem", fontWeight: 600, fontFamily: "'Sora',sans-serif",
        }}>Remove</button>
      </div>
    );
  }

  // ── Skeleton ──
  if (!current) {
    return (
      <div className="fav-skeleton" style={{
        animationDelay: `${idx * 0.08}s`, minHeight: 260,
        border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(180,210,255,0.4)",
      }} />
    );
  }

  const timeStr = localtime
    ? new Date(localtime.replace(" ", "T")).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

  const tempColor = getTempColor(current.temp, isDark);

  const stats = [
    { icon: "💧", label: "Humidity",   value: `${current.humidity}%` },
    { icon: "💨", label: "Wind",       value: current.wind != null ? (typeof current.wind === "number" ? `${current.wind} km/h` : current.wind) : "—" },
    { icon: "☀️", label: "UV",         value: current.uv ?? "—" },
    { icon: "🔵", label: "Pressure",   value: current.pressure_mb != null ? `${current.pressure_mb} mb` : "—" },
    { icon: "👁️", label: "Visibility", value: current.vis_km != null ? `${current.vis_km} km` : "—" },
    { icon: "☁️", label: "Cloud",      value: current.cloud != null ? `${current.cloud}%` : "—" },
  ].filter(s => s.value !== "—");

  return (
    <div className="fav-card-wrap fav-card" style={{
      ...glass,
      animationDelay: `${idx * 0.08}s`,
      borderRadius: "20px",
      overflow: "hidden",
      fontFamily: "'Sora',sans-serif",
      position: "relative",
    }}>


      <div style={{ padding: "1.25rem" }}>

        {/* ── Header: city + remove ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FaStar size={12} color="#fbbf24" style={{ filter: "drop-shadow(0 0 4px #fbbf2488)" }} />
              <h3 style={{
                fontFamily: "'Lora',serif", fontWeight: 600, fontSize: "1.2rem",
                margin: 0, color: isDark ? "#ffffff" : "#0f2744", letterSpacing: "-0.02em",
              }}>{capitalize(city)}</h3>
            </div>
            <p style={{
              margin: "0.15rem 0 0", fontSize: "0.72rem",
              color: isDark ? "rgba(180,210,255,0.55)" : "rgba(15,39,68,0.45)",
            }}>🕐 {timeStr}</p>
          </div>
          <button onClick={() => removeFromFavourites(city)} style={{
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
            color: "#f87171", borderRadius: "50px", padding: "0.25rem 0.75rem",
            cursor: "pointer", fontSize: "0.72rem", fontWeight: 600,
            fontFamily: "'Sora',sans-serif", flexShrink: 0,
          }}>✕ Remove</button>
        </div>

        {/* ── Temp + icon ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <img src={current.icon} alt={current.desc}
            style={{ width: 56, height: 56, objectFit: "contain",
              filter: isDark ? "drop-shadow(0 4px 8px rgba(0,0,0,0.5)) brightness(1.1)" : "drop-shadow(0 4px 8px rgba(100,160,255,0.3))" }}
          />
          <div>
            <div style={{
              fontFamily: "'Lora',serif", fontWeight: 600,
              fontSize: "2.8rem", lineHeight: 1,
              color: tempColor,
              textShadow: isDark ? `0 0 24px ${tempColor}55` : "none",
            }}>{current.temp}°</div>
            <div style={{ fontSize: "0.85rem", color: isDark ? "rgba(220,235,255,0.85)" : "rgba(15,39,68,0.65)", marginTop: "0.1rem" }}>
              {current.desc}
            </div>
            {current.feelslike_c != null && (
              <div style={{ fontSize: "0.7rem", color: isDark ? "rgba(180,210,255,0.55)" : "rgba(15,39,68,0.4)", marginTop: "0.08rem" }}>
                Feels like {current.feelslike_c}°C
              </div>
            )}
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.45rem" }}>
          {stats.map(({ icon, label, value }) => (
            <div key={label} className="fav-stat-tile" style={{
              background: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.7)",
              border: isDark ? "1px solid rgba(100,160,255,0.15)" : "1px solid rgba(180,210,255,0.4)",
              borderRadius: "12px", padding: "0.6rem 0.4rem", textAlign: "center",
            }}>
              <div style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: isDark ? "#e8f4ff" : "#0c1f3a" }}>{value}</div>
              <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "0.1rem", color: isDark ? "rgba(180,210,255,0.65)" : "rgba(12,31,58,0.5)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default function Favourites({ favourites, removeFromFavourites }) {
  const { isDarkMode: isDark } = useTheme();

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh", padding: "2.5rem 1.25rem 4rem", fontFamily: "'Sora',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.85rem",
            marginBottom: "2rem", animation: "favFadeUp 0.5s ease both",
          }}>
            <div>
              <h2 style={{
                fontFamily: "'Lora',serif", fontWeight: 600,
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                margin: 0, letterSpacing: "-0.02em",
                color: "#ffffff",
              }}>Your Saved Cities</h2>
              {favourites.length > 0 && (
                <p style={{ margin: "0.15rem 0 0", fontSize: "0.82rem", color: "rgba(255,255,255,0.75)" }}>
                  {favourites.length} {favourites.length === 1 ? "city" : "cities"} saved
                </p>
              )}
            </div>
          </div>

          {/* ── Empty state ── */}
          {favourites.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5rem 1rem", textAlign: "center" }}>
              <div className="fav-empty-pulse" style={{ fontSize: "4.5rem", marginBottom: "1.25rem" }}>🌍</div>
              <h3 style={{ fontFamily: "'Lora',serif", color: isDark ? "rgba(180,210,255,0.5)" : "rgba(15,39,68,0.45)", fontWeight: 600, fontSize: "1.2rem", margin: "0 0 0.5rem" }}>
                No favourites yet
              </h3>
              <p style={{ color: isDark ? "rgba(180,210,255,0.35)" : "rgba(15,39,68,0.35)", fontSize: "0.9rem", maxWidth: 280, lineHeight: 1.6, margin: 0 }}>
                Search for a city on the Home page and tap ⭐ to save it here.
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
              alignItems: "start",
            }}>
              {favourites.map((city, idx) => (
                <FavouriteItem key={city} city={city} idx={idx} removeFromFavourites={removeFromFavourites} />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}