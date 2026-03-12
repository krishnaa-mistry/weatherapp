import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import IconGrid from "./components/IconGrid";
import About from "./components/About";
import WeatherCard from "./components/WeatherCard";
import Favourites from "./components/Favourites";
import HourlyForecast from "./components/HourlyForecast";
import fetchWeather from "./utils/fetchWeather";
import "./App.css";
import { useUnit } from "./context/UnitContext";
import { useTheme } from "./context/ThemeContext";

const MAX_HISTORY = 6;

function capitalize(str) {
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ── Spinner ────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"5rem 1rem", gap:"1rem" }}>
      <div style={{ width:48, height:48, border:"3px solid rgba(96,165,250,0.2)", borderTop:"3px solid #60a5fa", borderRadius:"50%", animation:"appSpin 0.8s linear infinite" }} />
      <p style={{ fontFamily:"'Sora',sans-serif", fontSize:"0.88rem", color:"rgba(200,220,255,0.45)", margin:0 }}>Fetching weather…</p>
      <style>{`@keyframes appSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Search Bar with history dropdown ──────────────────────────────
function SearchBar({ inputCity, setInputCity, onSubmit, onLocate, isDark, history, onSelectHistory, onClearHistory }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowDropdown(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = history.filter(c => c.toLowerCase().includes(inputCity.toLowerCase()) && c.toLowerCase() !== inputCity.toLowerCase());

  return (
    <form onSubmit={onSubmit} style={{
      display:"flex", gap:"0.6rem", padding:"1.5rem 1.5rem 0",
      flexWrap:"wrap", justifyContent:"center",
      maxWidth:860, margin:"0 auto", width:"100%",
    }}>
      {/* Input with dropdown */}
      <div ref={wrapRef} style={{ position:"relative", flex:"1 1 240px", maxWidth:380 }}>
        <span style={{ position:"absolute", left:"0.9rem", top:"50%", transform:"translateY(-50%)", fontSize:"0.95rem", opacity:0.4, pointerEvents:"none" }}>🔍</span>
        <input
          type="text"
          placeholder="Search city…"
          value={inputCity}
          onChange={e => { setInputCity(e.target.value); setShowDropdown(true); }}
          style={{
            width:"100%", padding:"0.65rem 1rem 0.65rem 2.5rem",
            borderRadius:"50px",
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.55)",
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.55)",
            backdropFilter:"blur(12px)",
            color: isDark ? "#e2e8f0" : "#0f2744",
            fontFamily:"'Sora',sans-serif", fontSize:"0.88rem",
            outline:"none", boxSizing:"border-box",
            transition:"border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={e => { setShowDropdown(true); e.target.style.borderColor="rgba(56,189,248,0.5)"; e.target.style.boxShadow="0 0 0 3px rgba(56,189,248,0.1)"; }}
          onBlur={e => { e.target.style.borderColor=isDark?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.55)"; e.target.style.boxShadow="none"; }}
        />

        {/* Dropdown */}
        {showDropdown && history.length > 0 && (
          <div style={{
            position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:100,
            background: isDark ? "rgba(15,35,80,0.97)" : "rgba(255,255,255,0.97)",
            border: isDark ? "1px solid rgba(100,160,255,0.25)" : "1px solid rgba(180,210,255,0.6)",
            borderRadius:"16px", overflow:"hidden",
            boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.5)" : "0 12px 32px rgba(100,160,255,0.2)",
            backdropFilter:"blur(20px)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.6rem 0.9rem 0.4rem", borderBottom: isDark?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(180,210,255,0.3)" }}>
              <span style={{ fontSize:"0.68rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color: isDark?"rgba(180,210,255,0.5)":"rgba(15,39,68,0.4)", fontFamily:"'Sora',sans-serif" }}>Recent</span>
              <button type="button" onClick={onClearHistory} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"0.7rem", color: isDark?"rgba(180,210,255,0.5)":"rgba(15,39,68,0.4)", fontFamily:"'Sora',sans-serif", padding:"0.1rem 0.3rem" }}>Clear</button>
            </div>
            {(inputCity.trim() ? filtered : history).map((city, i) => (
              <div key={i} onMouseDown={() => { onSelectHistory(city); setShowDropdown(false); }} style={{
                padding:"0.6rem 0.9rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.6rem",
                fontFamily:"'Sora',sans-serif", fontSize:"0.85rem",
                color: isDark?"#e2e8f0":"#0f2744",
                transition:"background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = isDark?"rgba(100,160,255,0.1)":"rgba(100,160,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ opacity:0.45, fontSize:"0.8rem" }}>🕐</span>
                {city}
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" style={{
        padding:"0.65rem 1.35rem", borderRadius:"50px", border:"none",
        background: isDark?"linear-gradient(135deg,#1e6fba,#3b3fa8)":"linear-gradient(135deg,#0ea5e9,#4f46e5)",
        color:"#fff", fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.9rem",
        cursor:"pointer", letterSpacing:"0.03em",
        boxShadow: isDark?"0 4px 14px rgba(30,111,186,0.4)":"0 4px 18px rgba(14,165,233,0.6)",
        transition:"transform 0.15s",
      }}
        onMouseEnter={e => e.target.style.transform="translateY(-2px)"}
        onMouseLeave={e => e.target.style.transform="none"}
      >Search</button>

      <button type="button" onClick={onLocate} style={{
        padding:"0.65rem 1.1rem", borderRadius:"50px",
        border: isDark?"1px solid rgba(255,255,255,0.13)":"1px solid rgba(255,255,255,0.85)",
        background: isDark?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.60)",
        backdropFilter:"blur(12px)",
        color: isDark?"#e2e8f0":"#0f2744",
        fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:"0.87rem",
        cursor:"pointer", whiteSpace:"nowrap", transition:"transform 0.15s",
      }}
        onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
        onMouseLeave={e => e.currentTarget.style.transform="none"}
      >📍 Use My Location</button>
    </form>
  );
}

// ── Error banner ───────────────────────────────────────────────────
function ErrorBanner({ message }) {
  return (
    <div style={{
      maxWidth:480, margin:"1.5rem auto",
      background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)",
      borderRadius:"16px", padding:"1rem 1.5rem",
      display:"flex", alignItems:"center", gap:"0.75rem",
      fontFamily:"'Sora',sans-serif", color:"#f87171", fontSize:"0.9rem",
    }}>
      <span style={{ fontSize:"1.2rem" }}>⚠️</span>
      {message}
    </div>
  );
}

// ── Mobile Bottom Nav ──────────────────────────────────────────────
function MobileBottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const items = [
    { path: "/",           icon: "🏠", label: "Home"  },
    { path: "/favourites", icon: "⭐", label: "Saved" },
    { path: "/about",      icon: "ℹ️",  label: "About" },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map(({ path, icon, label }) => (
        <Link key={path} to={path} className={"mobile-nav-item" + (isActive(path) ? " active" : "")}>
          <span className="mobile-nav-icon">{icon}</span>
          <span className="mobile-nav-label">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

// ── Main routes ────────────────────────────────────────────────────
function AppRoutes({ favourites, setFavourites }) {
  const [inputCity,  setInputCity]  = useState("");
  const [searchCity, setSearchCity] = useState("Mumbai");
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [weather,    setWeather]    = useState(null);
  const [history,    setHistory]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("searchHistory") || "[]"); } catch { return []; }
  });

  const location               = useLocation();
  const { unit }               = useUnit();
  const { isDarkMode: isDark } = useTheme();

  useEffect(() => {
    if (location.state?.city) {
      setSearchCity(location.state.city);
      setInputCity(location.state.city);
    }
  }, [location]);

  useEffect(() => {
    if (!searchCity) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchWeather({ city: searchCity, unit });
        if (!cancelled) { setWeather(data); setError(""); }
      } catch (err) {
        if (!cancelled) { setError(err.message || "City not found. Try again."); setWeather(null); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [searchCity, unit]);

  const saveToHistory = (city) => {
    const updated = [city, ...history.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, MAX_HISTORY);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const handleAddFavourite = (city) => {
    const key = city.toLowerCase();
    if (!favourites.includes(key)) {
      const updated = [...favourites, key];
      setFavourites(updated);
      localStorage.setItem("favourites", JSON.stringify(updated));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      const cap = capitalize(inputCity.trim());
      setSearchCity(cap);
      setInputCity(cap);
      setError("");
      saveToHistory(cap);
    }
  };

  const handleSelectHistory = (city) => {
    setInputCity(city);
    setSearchCity(city);
    setError("");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          setLoading(true);
          const data = await fetchWeather({ coords: { lat: latitude, lon: longitude }, unit });
          const isNearAnand = Math.abs(latitude - 22.5645) < 0.1 && Math.abs(longitude - 72.9289) < 0.1;
          const cityName = isNearAnand ? "Anand" : data.city;
          setWeather(data);
          setInputCity(cityName);
          setSearchCity(cityName);
          setError("");
          saveToHistory(capitalize(cityName));
        } catch (err) {
          setError("Failed to fetch weather for your location.");
        } finally {
          setLoading(false);
        }
      },
      () => alert("Unable to retrieve your location.")
    );
  };

  return (
    <>
      <SearchBar
        inputCity={inputCity} setInputCity={setInputCity}
        onSubmit={handleSubmit} onLocate={handleUseMyLocation}
        isDark={isDark} history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
      />

      <div style={{ padding:"1.25rem 1.5rem 3rem" }}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorBanner message={error} />
        ) : weather ? (
          <div style={{ maxWidth:1200, margin:"0 auto", animation:"appFadeIn 0.45s ease both" }}>

            {/* ── 2-column dashboard ── */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"1fr 360px",
              gap:"1rem",
              alignItems:"start",
            }} className="dashboard-grid">

              {/* LEFT */}
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                <WeatherCard
                  city={searchCity}
                  current={weather.current}
                  localtime={weather.localtime}
                  favourites={favourites}
                  addToFavourites={handleAddFavourite}
                  darkMode={isDark}
                  astro={weather.astro}
                  cardWidth="100%"
                />
              </div>

              {/* RIGHT */}
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                <IconGrid city={searchCity} darkMode={isDark} hourlyData={weather.hourly} />
                <Link to={`/hourly/${searchCity}`} state={{ city: searchCity }} style={{ textDecoration:"none" }}>
                  <button style={{
                    width:"100%", padding:"0.7rem", borderRadius:"14px", border:"none",
                    background:"linear-gradient(135deg, #0ea5e9, #4f46e5)", color:"#fff",
                    fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.85rem",
                    cursor:"pointer", letterSpacing:"0.03em",
                    boxShadow:"0 4px 14px rgba(14,165,233,0.45)",
                    transition:"transform 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform="none"}
                  >View Full Hourly Forecast →</button>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes appFadeIn {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

// ── Root ──
export default function App() {
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("favourites") || "[]"); } catch { return []; }
  });

  const handleRemoveFavourite = (city) => {
    const updated = favourites.filter(c => c !== city);
    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <BrowserRouter>
        <Navbar />
        <MobileBottomNav />
        <Routes>
          <Route path="/"            element={<AppRoutes favourites={favourites} setFavourites={setFavourites} />} />
          <Route path="/favourites"  element={<Favourites favourites={favourites} removeFromFavourites={handleRemoveFavourite} />} />
          <Route path="/hourly/:city" element={<HourlyForecast />} />
          <Route path="/about"       element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}