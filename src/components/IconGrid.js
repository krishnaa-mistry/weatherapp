import { useEffect, useState } from "react";
import fetchWeather from "../utils/fetchWeather";
import { useUnit } from "../context/UnitContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Lora:wght@600&display=swap');

  .ig-row {
    transition: background 0.18s ease, transform 0.18s ease;
    cursor: default;
  }
  .ig-row:hover {
    background: rgba(56,189,248,0.08) !important;
    transform: translateX(3px);
  }

  .ig-fade-in {
    animation: igFadeUp 0.5s ease both;
  }
  @keyframes igFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ig-skeleton {
    background: linear-gradient(90deg,
      rgba(255,255,255,0.06) 25%,
      rgba(255,255,255,0.13) 50%,
      rgba(255,255,255,0.06) 75%);
    background-size: 200% 100%;
    animation: igShimmer 1.4s infinite;
    border-radius: 14px;
  }
  @keyframes igShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .ig-scroll::-webkit-scrollbar { width: 4px; }
  .ig-scroll::-webkit-scrollbar-track { background: transparent; }
  .ig-scroll::-webkit-scrollbar-thumb {
    background: rgba(56,189,248,0.2);
    border-radius: 99px;
  }
`;

function getTempColor(temp) {
  const t = parseFloat(temp);
  if (isNaN(t)) return "#94a3b8";
  if (t >= 38)  return "#a92d2d";
  if (t >= 32)  return "#d0653b";
  if (t >= 24)  return "#dfc661";
  if (t >= 15)  return "#20a17d";
  if (t >= 5)   return "#3155b8";
  return "#5b21b6";
}

export default function IconGrid({ city, darkMode, hourlyData: externalHourly }) {
  const { unit } = useUnit();
  const [hourly, setHourly] = useState(externalHourly || null);
  const [loading, setLoading] = useState(!externalHourly);
  const isDark = darkMode;

  useEffect(() => {
    // If parent passed hourly data, use it directly
    if (externalHourly) {
      setHourly(externalHourly);
      setLoading(false);
      return;
    }

    if (!city) return;
    const controller = new AbortController();
    setLoading(true);
    setHourly(null);

    (async () => {
      try {
        const res = await fetchWeather({ city, unit, signal: controller.signal });
        setHourly(res.hourly || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("IconGrid hourly error:", err);
          setHourly([]);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [city, unit, externalHourly]);

  const glass = {
    background: isDark ? "rgba(30,60,120,0.55)" : "rgba(255,255,255,0.65)",
    border: isDark ? "1px solid rgba(100,160,255,0.25)" : "1px solid rgba(180,210,255,0.55)",
    borderRadius: "20px",
    backdropFilter: "blur(20px)",
    boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 6px 24px rgba(100,160,255,0.1)",
  };

  return (
    <>
      <style>{styles}</style>

      <div className="ig-fade-in" style={{
        ...glass,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        fontFamily: "'Sora',sans-serif",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{
          padding: "1.1rem 1.25rem 0.85rem",
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(180,210,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <h3 style={{
            fontFamily: "'Lora',serif",
            fontWeight: 600,
            fontSize: "1rem",
            margin: 0,
            color: isDark ? "#f0f8ff" : "#0f2744",
          }}>🕐 Hourly Forecast</h3>
          <span style={{
            fontSize: "0.7rem",
            color: isDark ? "rgba(180,210,255,0.6)" : "rgba(15,39,68,0.38)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}>Next 12h</span>
        </div>

        {/* Scrollable list */}
        <div className="ig-scroll" style={{ overflowY: "auto", flex: 1, padding: "0.5rem 0" }}>

          {/* Skeleton */}
          {loading && Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="ig-skeleton"
              style={{ height: 52, margin: "0.4rem 0.85rem", animationDelay: `${i * 0.07}s` }}
            />
          ))}

          {/* Rows */}
          {!loading && hourly && hourly.map((h, i) => {
            // Use WeatherAPI's local time string directly (avoids browser timezone mismatch)
            const rawTime = h.time || "";
            const timeParts = rawTime.split(" ")[1] || "";
            const [hh, mm] = timeParts.split(":").map(Number);
            const ampm = hh >= 12 ? "PM" : "AM";
            const hour12 = hh % 12 === 0 ? 12 : hh % 12;
            const timeLabel = `${String(hour12).padStart(2,"0")}:${String(mm).padStart(2,"0")} ${ampm}`;
            const tempColor = getTempColor(h.temp);

            return (
              <div
                key={i}
                className="ig-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.6rem 1.1rem",
                  gap: "0.75rem",
                  borderRadius: "12px",
                  margin: "0.15rem 0.5rem",
                  background: "transparent",
                  animationDelay: `${i * 0.04}s`,
                }}
              >
                {/* Time */}
                <div style={{
                  minWidth: 62,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: isDark ? "rgba(200,220,255,0.85)" : "rgba(15,39,68,0.55)",
                  letterSpacing: "0.03em",
                }}>
                  {timeLabel}
                </div>

                {/* Icon */}
                <img src={h.icon} alt={h.condition || ""}
                  style={{ width: 34, height: 34, objectFit: "contain", flexShrink: 0,
                    filter: isDark ? "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" : "none" }}
                />

                {/* Condition */}
                <div style={{
                  flex: 1,
                  fontSize: "0.8rem",
                  color: isDark ? "rgba(200,220,255,0.75)" : "rgba(15,39,68,0.55)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {h.condition || ""}
                </div>

                {/* Temp */}
                <div style={{
                  fontFamily: "'Lora',serif",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: tempColor,
                  minWidth: 42,
                  textAlign: "right",
                  textShadow: isDark ? `0 0 10px ${tempColor}55` : "none",
                }}>
                  {Math.round(h.temp)}°
                </div>
              </div>
            );
          })}

          {/* Empty */}
          {!loading && hourly && hourly.length === 0 && (
            <div style={{
              textAlign: "center", padding: "3rem 1rem",
              color: isDark ? "rgba(255,255,255,0.25)" : "rgba(15,39,68,0.3)",
              fontSize: "0.85rem",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📡</div>
              No hourly data available
            </div>
          )}
        </div>
      </div>
    </>
  );
}