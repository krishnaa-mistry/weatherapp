import { useState } from "react";
import fetchWeather from "./utils/fetchWeather";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Lora:wght@600&family=JetBrains+Mono:wght@400;500&display=swap');

  .tw-root * { box-sizing: border-box; }

  .tw-input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    color: #e2e8f0;
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .tw-input::placeholder { color: rgba(200,220,255,0.3); }
  .tw-input:focus {
    border-color: rgba(56,189,248,0.5);
    box-shadow: 0 0 0 3px rgba(56,189,248,0.12);
  }

  .tw-fetch-btn {
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    border: none;
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    color: #fff;
    box-shadow: 0 4px 14px rgba(56,189,248,0.35);
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .tw-fetch-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(56,189,248,0.45);
  }
  .tw-fetch-btn:active:not(:disabled) { transform: scale(0.97); }
  .tw-fetch-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .tw-copy-btn {
    font-family: 'Sora', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 0.3rem 0.75rem;
    background: rgba(255,255,255,0.06);
    color: rgba(200,220,255,0.7);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .tw-copy-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

  .tw-pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    line-height: 1.65;
    color: #a5f3fc;
    background: rgba(0,0,0,0.35);
    border: 1px solid rgba(56,189,248,0.15);
    border-radius: 14px;
    padding: 1.25rem;
    overflow-x: auto;
    max-height: 420px;
    overflow-y: auto;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .tw-pre::-webkit-scrollbar { width: 5px; height: 5px; }
  .tw-pre::-webkit-scrollbar-track { background: transparent; }
  .tw-pre::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.25); border-radius: 99px; }

  .tw-fade-in {
    animation: twFadeUp 0.4s ease both;
  }
  @keyframes twFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .tw-spin {
    animation: twSpin 0.75s linear infinite;
  }
  @keyframes twSpin { to { transform: rotate(360deg); } }

  .tw-status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

function syntaxHighlight(json) {
  return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "color:#a5f3fc"; // number
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "color:#818cf8;font-weight:600" : "color:#86efac";
        } else if (/true|false/.test(match)) {
          cls = "color:#fb923c";
        } else if (/null/.test(match)) {
          cls = "color:#f87171";
        }
        return `<span style="${cls}">${match}</span>`;
      });
}

export default function TestWeather() {
  const [city, setCity]       = useState("");
  const [raw, setRaw]         = useState(null);
  const [err, setErr]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [duration, setDuration] = useState(null);

  const testCall = async () => {
    if (!city.trim()) return;
    setLoading(true); setRaw(null); setErr(null); setDuration(null);
    const t0 = performance.now();
    try {
      const data = await fetchWeather({ city });
      const ms = Math.round(performance.now() - t0);
      console.log("✅ API success ⇒", data);
      setRaw(data);
      setDuration(ms);
    } catch (e) {
      console.error("❌ API failed ⇒", e.message);
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!raw) return;
    navigator.clipboard.writeText(JSON.stringify(raw, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonStr = raw ? JSON.stringify(raw, null, 2) : "";
  const lineCount = jsonStr.split("\n").length;

  return (
    <>
      <style>{styles}</style>

      <div
        className="tw-root"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "3rem 1rem 4rem",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        <div style={{ width: "100%", maxWidth: 680 }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.4rem" }}>
              <div style={{
                width: 36, height: 36,
                background: "linear-gradient(135deg,#38bdf8,#818cf8)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(129,140,248,0.4)",
              }}>🧪</div>
              <h2 style={{
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                fontSize: "1.4rem",
                margin: 0,
                color: "#f0f6ff",
                letterSpacing: "-0.02em",
              }}>API Test Console</h2>
              <span style={{
                background: "rgba(251,146,60,0.15)",
                border: "1px solid rgba(251,146,60,0.3)",
                color: "#fb923c",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "6px",
                padding: "0.15rem 0.5rem",
              }}>DEV</span>
            </div>
            <p style={{
              margin: 0,
              fontSize: "0.83rem",
              color: "rgba(200,220,255,0.4)",
              paddingLeft: "3rem",
            }}>
              Test the WeatherAPI fetchWeather utility directly
            </p>
          </div>

          {/* ── Main card ── */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "22px",
            padding: "1.75rem",
            backdropFilter: "blur(16px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}>

            {/* Search row */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{
                  position: "absolute", left: "0.9rem", top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1rem", opacity: 0.5, pointerEvents: "none",
                }}>🌍</span>
                <input
                  className="tw-input"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && testCall()}
                  placeholder="Try Mumbai, London, Tokyo…"
                />
              </div>
              <button
                className="tw-fetch-btn"
                onClick={testCall}
                disabled={loading || !city.trim()}
              >
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="tw-spin" style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block" }} />
                      Fetching…
                    </span>
                  : "⚡ Fetch"}
              </button>
            </div>

            {/* Status bar */}
            {(raw || err) && (
              <div className="tw-fade-in" style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div className="tw-status-dot" style={{
                    background: raw ? "#34d399" : "#f87171",
                    boxShadow: raw ? "0 0 6px #34d39988" : "0 0 6px #f8717188",
                  }} />
                  <span style={{
                    fontSize: "0.8rem", fontWeight: 600,
                    color: raw ? "#34d399" : "#f87171",
                  }}>
                    {raw ? `✓ Success` : `✗ Error`}
                  </span>
                  {duration && (
                    <span style={{
                      fontSize: "0.75rem",
                      color: "rgba(200,220,255,0.35)",
                      marginLeft: "0.25rem",
                    }}>
                      · {duration}ms · {lineCount} lines
                    </span>
                  )}
                </div>

                {raw && (
                  <button className="tw-copy-btn" onClick={handleCopy}>
                    {copied ? "✓ Copied!" : "Copy JSON"}
                  </button>
                )}
              </div>
            )}

            {/* JSON output */}
            {raw && (
              <div className="tw-fade-in">
                <pre
                  className="tw-pre"
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonStr) }}
                />
              </div>
            )}

            {/* Error output */}
            {err && (
              <div className="tw-fade-in" style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: "14px",
                padding: "1.1rem 1.25rem",
                display: "flex", alignItems: "flex-start", gap: "0.75rem",
              }}>
                <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 600, color: "#f87171", fontSize: "0.88rem", marginBottom: "0.25rem" }}>
                    API Error
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.8rem",
                    color: "rgba(252,165,165,0.8)",
                    lineHeight: 1.5,
                  }}>
                    {err}
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!raw && !err && !loading && (
              <div style={{
                textAlign: "center",
                padding: "2.5rem 1rem",
                color: "rgba(200,220,255,0.2)",
                fontSize: "0.85rem",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", opacity: 0.4 }}>📡</div>
                Enter a city name and press Fetch or hit Enter
              </div>
            )}
          </div>

          {/* ── Footer hint ── */}
          <p style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.75rem",
            color: "rgba(200,220,255,0.2)",
            fontStyle: "italic",
          }}>
            Dev only · Results logged to console
          </p>
        </div>
      </div>
    </>
  );
}