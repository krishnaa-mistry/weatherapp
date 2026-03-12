import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BsSun, BsMoon } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";
import { useUnit } from "../context/UnitContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Lora:wght@600&display=swap');

  .nb-root {
    position: sticky;
    top: 0;
    z-index: 200;
    font-family: 'Sora', sans-serif;
  }

  .nb-link {
    position: relative;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.35rem 0.1rem;
    transition: color 0.2s;
  }
  .nb-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 2px;
    border-radius: 99px;
    background: linear-gradient(90deg, #38bdf8, #818cf8);
    transition: width 0.25s ease;
  }
  .nb-link:hover::after,
  .nb-link.active::after {
    width: 100%;
  }

  .nb-pill-btn {
    border-radius: 50px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s;
  }
  .nb-pill-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 14px rgba(96,165,250,0.35);
  }
  .nb-pill-btn:active {
    transform: scale(0.95);
  }

  .nb-hamburger {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.2s;
  }
  .nb-hamburger:hover { background: rgba(255,255,255,0.1); }
  .nb-hamburger span {
    display: block;
    height: 2px;
    border-radius: 99px;
    transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
  }

  .nb-mobile-menu {
    overflow: hidden;
    transition: max-height 0.35s ease, opacity 0.3s ease;
  }

  @media (min-width: 768px) {
    .nb-hamburger { display: none !important; }
    .nb-mobile-menu { display: none !important; }
    .nb-desktop-links { display: flex !important; }
  }
  @media (max-width: 767px) {
    .nb-desktop-links { display: none !important; }
  }
`;

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { unit, toggle } = useUnit();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = isDarkMode;

  const navBg = isDark
    ? "rgba(10, 15, 35, 0.85)"
    : "rgba(255,255,255,0.2)";

  const linkColor = isDark ? "rgba(220,235,255,0.82)" : "rgba(255,255,255,0.95)";
  const activeLinkColor = "#fff";

  const pillBg = isDark
    ? "rgba(255,255,255,0.09)"
    : "rgba(255,255,255,0.25)";
  const pillColor = isDark ? "#e2e8f0" : "#fff";

  const barColor = isDark ? "rgba(255,255,255,0.7)" : "#fff";

  return (
    <>
      <style>{styles}</style>

      <nav
        className="nb-root"
        style={{
          background: navBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(255,255,255,0.3)",
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(0,0,60,0.1)",
        }}
      >
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}>

          {/* ── Brand ── */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexShrink: 0,
            }}
          >
            <span style={{
              width: 34, height: 34,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(129,140,248,0.4)",
            }}>⛅</span>
            <span style={{
              fontFamily: "'Lora', serif",
              fontWeight: 600,
              fontSize: "1.25rem",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}>
              WeatherApp
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div
            className="nb-desktop-links"
            style={{ gap: "1.75rem", alignItems: "center" }}
          >
            {[
              { to: "/",            label: "Home", end: true },
              { to: "/favourites",  label: "Saved" },
              { to: "/about",       label: "About" },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                end={end}
                to={to}
                className={({ isActive }) =>
                  "nb-link" + (isActive ? " active" : "")
                }
                style={({ isActive }) => ({
                  color: isActive ? activeLinkColor : linkColor,
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* ── Right controls ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            {/* Theme toggle */}
            <button
              className="nb-pill-btn"
              onClick={toggleTheme}
              title="Toggle theme"
              style={{
                width: 38, height: 38,
                background: pillBg,
                color: pillColor,
                fontSize: "1rem",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "1px solid rgba(255,255,255,0.4)",
              }}
            >
              {isDark ? <BsSun /> : <BsMoon />}
            </button>

            {/* Unit toggle */}
            <button
              className="nb-pill-btn"
              onClick={toggle}
              title="Toggle °C / °F"
              style={{
                height: 38,
                padding: "0 0.9rem",
                background: pillBg,
                color: pillColor,
                fontSize: "0.82rem",
                letterSpacing: "0.03em",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "1px solid rgba(255,255,255,0.4)",
              }}
            >
              {unit === "metric" ? "°C" : "°F"}
            </button>

            {/* Hamburger (mobile) */}
            <button
              className="nb-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span style={{
                width: 22, background: barColor,
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }} />
              <span style={{
                width: 16, background: barColor,
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                width: 22, background: barColor,
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }} />
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className="nb-mobile-menu"
          style={{
            maxHeight: menuOpen ? 200 : 0,
            opacity: menuOpen ? 1 : 0,
            background: isDark
              ? "rgba(10,15,35,0.97)"
              : "rgba(30,80,160,0.95)",
            borderTop: isDark
              ? "1px solid rgba(255,255,255,0.07)"
              : "1px solid rgba(255,255,255,0.2)",
            paddingBottom: menuOpen ? "0.75rem" : 0,
          }}
        >
          {[
            { to: "/",           label: "Home",  end: true },
            { to: "/favourites", label: "Saved" },
            { to: "/about",      label: "About" },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              end={end}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => "nb-link" + (isActive ? " active" : "")}
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1.5rem",
                color: isActive ? "#fff" : "rgba(220,235,255,0.7)",
                fontFamily: "'Sora', sans-serif",
                fontSize: "0.95rem",
                fontWeight: isActive ? 600 : 400,
                textDecoration: "none",
                borderLeft: isActive ? "3px solid #38bdf8" : "3px solid transparent",
                transition: "all 0.2s",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}