import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Lora:ital,wght@0,600;1,400&display=swap');

  .hourly-card-item {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
  }
  .hourly-card-item:hover {
    transform: translateY(-5px) scale(1.03);
  }
  .hourly-fade-in {
    animation: hourlyFadeUp 0.55s ease both;
  }
  @keyframes hourlyFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .back-btn { transition: transform 0.18s ease; }
  .back-btn:hover { transform: translateX(-3px); }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function getTempColor(temp, isDark) {
  const t = parseFloat(temp);
  if (isNaN(t)) return "#94a3b8";
  if (t >= 38) return isDark ? "#f87171" : "#a92d2d";
  if (t >= 32) return isDark ? "#fb923c" : "#d0653b";
  if (t >= 24) return isDark ? "#fde68a" : "#dfc661";
  if (t >= 15) return isDark ? "#34d399" : "#20a17d";
  if (t >= 5)  return isDark ? "#93c5fd" : "#3155b8";
  return isDark ? "#c4b5fd" : "#5b21b6";
}

export default function HourlyForecast() {
  const { city }               = useParams();
  const { isDarkMode: isDark } = useTheme();
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);

  useEffect(() => {
    async function fetchHourlyData() {
      try {
        const res  = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=42da434465a54353bee134858252306&q=${city}&days=2`
        );
        const data = await res.json();

        const allHours = [
          ...data.forecast.forecastday[0].hour,
          ...(data.forecast.forecastday[1]?.hour || []),
        ];

        const localTimeStr = data.location.localtime;
        const [localHour, localMinute] = localTimeStr.split(" ")[1].split(":").map(Number);

        const currentIndex = allHours.findIndex((h) => {
          const [hour, minute] = h.time.split(" ")[1].split(":").map(Number);
          return hour === localHour && minute >= localMinute;
        });

        const next12Hours = allHours.slice(
          currentIndex >= 0 ? currentIndex : 0,
          (currentIndex >= 0 ? currentIndex : 0) + 12
        );

        setHourlyData(next12Hours.map((h) => ({
          time:      h.time,
          icon:      `https:${h.condition.icon}`,
          temp:      h.temp_c,
          condition: h.condition.text,
        })));
      } catch (err) {
        console.error("Error fetching hourly forecast:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchHourlyData();
  }, [city]);

  // Shared glass styles
  const glassWrap = {
    background: isDark ? "rgba(30,60,120,0.55)" : "rgba(255,255,255,0.65)",
    border: isDark ? "1px solid rgba(100,160,255,0.25)" : "1px solid rgba(180,210,255,0.55)",
    borderRadius: "28px",
    backdropFilter: "blur(20px)",
    boxShadow: isDark
      ? "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 20px 60px rgba(100,160,255,0.15)",
    padding: "2.5rem 2rem",
    maxWidth: 960,
    margin: "2.5rem auto",
    fontFamily: "'Sora', sans-serif",
  };

  const cardGlass = {
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.72)",
    border: isDark ? "1px solid rgba(100,160,255,0.2)" : "1px solid rgba(180,210,255,0.5)",
    borderRadius: "18px",
    boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(100,160,255,0.1)",
  };

  // ── Loading ──
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ padding: "0 1rem" }}>
          <div style={{ ...glassWrap, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", padding: "4rem 2rem" }}>
            <div style={{
              width: 52, height: 52,
              border: "3px solid rgba(96,165,250,0.2)",
              borderTop: "3px solid #60a5fa",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: isDark ? "rgba(200,220,255,0.7)" : "rgba(15,39,68,0.5)", fontSize: "0.95rem", margin: 0 }}>
              Loading forecast for <strong style={{ color: isDark ? "#7dd3fc" : "#0369a1" }}>{city}</strong>…
            </p>
          </div>
        </div>
      </>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ padding: "0 1rem" }}>
          <div style={{ ...glassWrap, textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <p style={{ color: isDark ? "#fca5a5" : "#b91c1c", marginBottom: "1.5rem" }}>
              Failed to load forecast for <strong>{city}</strong>.
            </p>
            <Link to="/" state={{ city }}>
              <button className="back-btn" style={backBtnStyle(isDark)}>← Back to Home</button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div style={{ padding: "0 1rem" }}>
        <div style={glassWrap} className="hourly-fade-in">

          {/* ── Header ── */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", flexWrap: "wrap",
            gap: "1rem", marginBottom: "2rem",
          }}>
            <div>
              <h2 style={{
                fontFamily: "'Lora', serif", fontWeight: 600,
                fontSize: "clamp(1.2rem, 3vw, 1.7rem)",
                margin: 0, letterSpacing: "-0.02em",
                color: isDark ? "#ffffff" : "#0f2744",
              }}>🕐 Next 12 Hours</h2>
              <p style={{
                margin: "0.3rem 0 0", fontSize: "0.85rem", fontWeight: 400,
                color: isDark ? "rgba(180,210,255,0.65)" : "rgba(15,39,68,0.5)",
              }}>
                Hourly forecast for{" "}
                <span style={{ color: isDark ? "#7dd3fc" : "#0369a1", fontWeight: 600 }}>{city}</span>
              </p>
            </div>

            <Link to="/" state={{ city }} style={{ textDecoration: "none" }}>
              <button className="back-btn" style={backBtnStyle(isDark)}>← Back to Home</button>
            </Link>
          </div>

          {/* ── Divider ── */}
          <div style={{
            height: 1,
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(100,160,255,0.3), transparent)"
              : "linear-gradient(90deg, transparent, rgba(100,160,255,0.3), transparent)",
            marginBottom: "1.75rem",
          }} />

          {/* ── Grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "0.85rem",
          }}>
            {hourlyData.map((hour, idx) => {
              // Use API time string directly to avoid timezone mismatch
              const rawTime   = hour.time || "";
              const timeParts = rawTime.split(" ")[1] || "";
              const [hh, mm]  = timeParts.split(":").map(Number);
              const ampm      = hh >= 12 ? "PM" : "AM";
              const hour12    = hh % 12 === 0 ? 12 : hh % 12;
              const timeLabel = `${String(hour12).padStart(2,"0")}:${String(mm).padStart(2,"0")} ${ampm}`;

              const tempColor = getTempColor(hour.temp, isDark);

              return (
                <div key={idx} className="hourly-card-item hourly-fade-in" style={{
                  ...cardGlass,
                  animationDelay: `${idx * 0.05}s`,
                  padding: "1.1rem 0.75rem",
                  textAlign: "center",
                }}>
                  {/* Time */}
                  <div style={{
                    fontSize: "0.78rem", fontWeight: 700,
                    color: isDark ? "rgba(200,225,255,0.85)" : "#334e6e",
                    letterSpacing: "0.04em", marginBottom: "0.6rem",
                  }}>{timeLabel}</div>

                  {/* Icon */}
                  <img src={hour.icon} alt={hour.condition} title={hour.condition}
                    style={{
                      width: 48, height: 48, objectFit: "contain",
                      filter: isDark ? "drop-shadow(0 2px 6px rgba(0,0,0,0.5)) brightness(1.1)" : "none",
                    }}
                  />

                  {/* Temp */}
                  <div style={{
                    fontFamily: "'Lora', serif", fontWeight: 600,
                    fontSize: "1.25rem", color: tempColor,
                    marginTop: "0.5rem",
                    textShadow: isDark ? `0 0 12px ${tempColor}55` : "none",
                  }}>{Math.round(hour.temp)}°C</div>

                  {/* Condition */}
                  <div style={{
                    fontSize: "0.7rem", lineHeight: 1.3, marginTop: "0.25rem",
                    color: isDark ? "rgba(180,210,255,0.70)" : "rgba(15,39,68,0.45)",
                  }}>{hour.condition}</div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}

function backBtnStyle(isDark) {
  return {
    background: isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.65)",
    border: isDark ? "1px solid rgba(100,160,255,0.3)" : "1px solid rgba(100,160,255,0.4)",
    color: isDark ? "#93c5fd" : "#0369a1",
    borderRadius: "50px",
    padding: "0.5rem 1.25rem",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    fontWeight: 600,
    fontSize: "0.88rem",
    backdropFilter: "blur(8px)",
    whiteSpace: "nowrap",
  };
}