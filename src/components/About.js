import React from "react";
import { useTheme } from "../context/ThemeContext";

const features = [
  { icon: "🌍", title: "City Search",        desc: "Instantly search weather info for any city across the globe." },
  { icon: "📍", title: "Use My Location",    desc: "Fetch real-time weather using your current location (with permission)." },
  { icon: "🕒", title: "Hourly Forecast",    desc: "Next 12-hour forecast with icons and temperature insights." },
  { icon: "📌", title: "Favourites",         desc: "Save your favorite cities for quick access and monitoring." },
  { icon: "🌗", title: "Light / Dark Theme", desc: "Toggle manually between light and dark modes anytime." },
  { icon: "🌡️", title: "°C / °F Toggle",    desc: "Choose your preferred temperature unit." },
  { icon: "🧠", title: "Extra Info",         desc: "Visibility, pressure, cloud %, and other useful details." },
  { icon: "💾", title: "Local Storage",      desc: "Your saved cities stay stored even after you close the app." },
];

export default function About() {
  const { isDarkMode: isDark } = useTheme();

  const glass = {
    background: isDark ? "rgba(30,60,120,0.55)" : "rgba(255,255,255,0.72)",
    border: isDark ? "1px solid rgba(100,160,255,0.25)" : "1px solid rgba(180,210,255,0.6)",
    backdropFilter: "blur(20px)",
    boxShadow: isDark
      ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 8px 32px rgba(100,160,255,0.12)",
  };

  return (
    <div style={{ minHeight: "100vh", padding: "3rem 1rem 4rem", fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Lora:ital,wght@0,600;1,400&display=swap');
        .about-feature-card { transition: transform 0.2s ease; cursor: default; }
        .about-feature-card:hover { transform: translateY(-3px); }
        .about-fade-in { animation: aboutFadeUp 0.6s ease both; }
        @keyframes aboutFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* ── Hero ── */}
        <div className="about-fade-in" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "2.2rem", lineHeight: 1 }}>⛅</span>
            <h1 style={{
              fontFamily: "'Lora', serif", fontWeight: 600,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              margin: 0, letterSpacing: "-0.02em",
              color: "#ffffff",
            }}>About This Weather App</h1>
          </div>

        </div>

        {/* ── Intro Card ── */}
        <div className="about-fade-in" style={{
          ...glass, animationDelay: "0.1s",
          borderRadius: "20px", padding: "2rem 2.25rem", marginBottom: "1.5rem",
        }}>
          <p style={{
            fontSize: "1.05rem", lineHeight: 1.8, margin: "0 0 1rem",
            color: isDark ? "rgba(220,235,255,0.95)" : "#1e3a5f",
          }}>
            Welcome to{" "}
            <strong style={{ color: isDark ? "#7dd3fc" : "#0369a1" }}>WeatherApp</strong>{" "}
            — your personal meteorologist built with <em>React JS</em> and the{" "}
            <strong style={{ color: isDark ? "#7dd3fc" : "#0369a1" }}>WeatherAPI</strong>.
            Our goal is to provide fast, accurate, and visually appealing weather updates
            through a smooth and responsive interface.
          </p>
          <p style={{
            fontSize: "1.05rem", lineHeight: 1.8, margin: 0,
            color: isDark ? "rgba(200,225,255,0.85)" : "#334e6e",
          }}>
            Designed with simplicity and speed in mind, WeatherApp lets you check current
            conditions, hourly forecasts, and extra atmospheric details for any city worldwide
            — right from your phone or desktop.
          </p>
        </div>

        {/* ── Features ── */}
        <div className="about-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 style={{
            fontFamily: "'Lora', serif", fontWeight: 600, fontSize: "1.3rem",
            color: "#ffffff",
            margin: "0 0 1rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32,
              background: "linear-gradient(135deg,#38bdf8,#818cf8)",
              borderRadius: "8px", fontSize: "1rem",
            }}>⚙️</span>
            Key Features
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "0.75rem",
          }}>
            {features.map(({ icon, title, desc }, i) => (
              <div key={title} className="about-feature-card about-fade-in" style={{
                ...glass,
                animationDelay: `${0.25 + i * 0.06}s`,
                borderRadius: "16px", padding: "1.1rem 1.25rem",
                display: "flex", gap: "1rem", alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "1.5rem", lineHeight: 1, flexShrink: 0, marginTop: "2px" }}>{icon}</span>
                <div>
                  <div style={{
                    fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem",
                    color: isDark ? "#93c5fd" : "#0c4a6e",
                  }}>{title}</div>
                  <div style={{
                    fontSize: "0.85rem", lineHeight: 1.55,
                    color: isDark ? "rgba(200,225,255,0.85)" : "#334e6e",
                  }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}