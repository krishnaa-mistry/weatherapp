import { useUnit }  from "../context/UnitContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Thermometer } from "react-bootstrap-icons";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&display=swap');

  .tgl-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    border-radius: 50px;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 0.02em;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s, border-color 0.2s;
    white-space: nowrap;
    outline: none;
    position: relative;
    overflow: hidden;
  }

  .tgl-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.15s;
  }
  .tgl-btn:hover::before  { background: rgba(255,255,255,0.07); }
  .tgl-btn:active::before { background: rgba(255,255,255,0.14); }

  .tgl-btn:hover  { transform: translateY(-2px); }
  .tgl-btn:active { transform: scale(0.94); }

  .tgl-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.35s ease;
  }
  .tgl-btn:hover .tgl-icon-wrap { transform: rotate(20deg); }
`;

export default function Toggles() {
  const { unit, toggleUnit }   = useUnit();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const base = {
    height: 36,
    padding: "0 0.9rem",
    background: isDark
      ? "rgba(255,255,255,0.08)"
      : "rgba(255,255,255,0.25)",
    border: isDark
      ? "1px solid rgba(255,255,255,0.14)"
      : "1px solid rgba(255,255,255,0.5)",
    color: isDark ? "#e2e8f0" : "#fff",
    boxShadow: isDark
      ? "0 2px 8px rgba(0,0,0,0.25)"
      : "0 2px 8px rgba(0,0,60,0.1)",
  };

  return (
    <>
      <style>{styles}</style>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>

        {/* ── Unit toggle ── */}
        <button
          className="tgl-btn"
          onClick={toggleUnit}
          title={`Switch to ${unit === "metric" ? "°F" : "°C"}`}
          style={base}
        >
          <span className="tgl-icon-wrap">
            <Thermometer size={14} />
          </span>
          {unit === "metric" ? "°C" : "°F"}
        </button>

        {/* ── Theme toggle ── */}
        <button
          className="tgl-btn"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
          style={{
            ...base,
            width: 36,
            padding: 0,
            fontSize: "1rem",
          }}
        >
          <span className="tgl-icon-wrap">
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </span>
        </button>

      </div>
    </>
  );
}