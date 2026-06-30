import { useState, useEffect } from "react";

const API_KEY = "1efb49d2967f5274d99c83782062ff95";

const WEATHER_ICONS = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
  Smoke: "🌫️",
  Dust: "🌫️",
  Sand: "🌫️",
  Tornado: "🌪️",
};

const BG_GRADIENTS = {
  Clear: "linear-gradient(135deg, #1a6fd4 0%, #e87b1e 100%)",
  Clouds: "linear-gradient(135deg, #4a6b8c 0%, #7e9bb5 100%)",
  Rain: "linear-gradient(135deg, #1c3557 0%, #3a6186 100%)",
  Drizzle: "linear-gradient(135deg, #2c4a6e 0%, #4a7a9b 100%)",
  Thunderstorm: "linear-gradient(135deg, #0f1f38 0%, #2c3e5e 100%)",
  Snow: "linear-gradient(135deg, #5c7fa8 0%, #b8d4f0 100%)",
  default: "linear-gradient(135deg, #1a3a5c 0%, #2e6da4 100%)",
};

const MOCK_FORECASTS = [
  { day: "Mon", icon: "☀️", high: 24, low: 16 },
  { day: "Tue", icon: "⛅", high: 21, low: 14 },
  { day: "Wed", icon: "🌧️", high: 17, low: 12 },
  { day: "Thu", icon: "☁️", high: 19, low: 13 },
  { day: "Fri", icon: "☀️", high: 26, low: 17 },
];

export default function WeatherApp() {
  const [city, setCity] = useState("San Francisco");
  const [inputVal, setInputVal] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchWeather(cityName) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message === "City not found" ? "City not found. Try another name." : "Couldn't load weather. Check your API key.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchWeather(city));
  }, [city]);

  function handleSearch(e) {
    e.preventDefault();
    if (inputVal.trim()) {
      setCity(inputVal.trim());
      setInputVal("");
    }
  }

  function toF(c) { return Math.round(c * 9 / 5 + 32); }
  function displayTemp(c) {
    const val = unit === "C" ? Math.round(c) : toF(c);
    return `${val}°${unit}`;
  }

  const condition = weather?.weather?.[0]?.main || "default";
  const bg = BG_GRADIENTS[condition] || BG_GRADIENTS.default;
  const icon = WEATHER_ICONS[condition] || "🌡️";

  const formatTime = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (d) =>
    d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  const windDir = (deg) => {
    const dirs = ["N","NE","E","SE","S","SW","W","NW"];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      transition: "background 1.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Search city…"
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 12,
              padding: "10px 16px",
              color: "#fff",
              fontSize: 15,
              outline: "none",
              backdropFilter: "blur(8px)",
            }}
          />
          <button
            type="submit"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 12,
              padding: "10px 18px",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            🔍
          </button>
        </form>

        {/* Main card */}
        <div style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.2)",
          padding: "28px 28px 24px",
          marginBottom: 16,
          color: "#fff",
        }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "32px 0", fontSize: 40 }}>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
              <p style={{ fontSize: 14, marginTop: 12, opacity: 0.7 }}>Fetching weather…</p>
            </div>
          )}
          {error && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌐</div>
              <p style={{ fontSize: 15, opacity: 0.85 }}>{error}</p>
            </div>
          )}
          {!loading && !error && weather && (
            <>
              {/* Location + time */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
                    {weather.name}, {weather.sys.country}
                  </h1>
                  <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.75 }}>{formatDate(time)}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 500, letterSpacing: "-0.5px" }}>{formatTime(time)}</p>
                  <button
                    onClick={() => setUnit(u => u === "C" ? "F" : "C")}
                    style={{
                      marginTop: 4,
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      padding: "2px 10px",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    °{unit === "C" ? "F" : "C"}
                  </button>
                </div>
              </div>

              {/* Temp + icon */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "24px 0 8px" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 72, fontWeight: 200, lineHeight: 1, letterSpacing: "-4px" }}>
                    {displayTemp(weather.main.temp)}
                  </p>
                  <p style={{ margin: "8px 0 0", fontSize: 16, opacity: 0.85, textTransform: "capitalize" }}>
                    {weather.weather[0].description}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.6 }}>
                    Feels like {displayTemp(weather.main.feels_like)}
                  </p>
                </div>
                <div style={{ fontSize: 80, lineHeight: 1 }}>{icon}</div>
              </div>

              {/* Hi / Lo */}
              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <span style={{ fontSize: 13, opacity: 0.75 }}>↑ {displayTemp(weather.main.temp_max)}</span>
                <span style={{ fontSize: 13, opacity: 0.75 }}>↓ {displayTemp(weather.main.temp_min)}</span>
              </div>

              {/* Stats row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,0.15)",
              }}>
                {[
                  { label: "Humidity", value: `${weather.main.humidity}%`, icon: "💧" },
                  { label: "Wind", value: `${Math.round(weather.wind.speed)} m/s ${windDir(weather.wind.deg)}`, icon: "🌬️" },
                  { label: "Pressure", value: `${weather.main.pressure} hPa`, icon: "🧭" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{s.value}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.65 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Sunrise / Sunset */}
              <div style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.15)",
              }}>
                {[
                  { label: "Sunrise", icon: "🌅", val: new Date(weather.sys.sunrise * 1000) },
                  { label: "Sunset",  icon: "🌇", val: new Date(weather.sys.sunset  * 1000) },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 500 }}>
                      {s.val.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.65 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Demo mode (no API key) */}
          {!loading && !error && !weather && (
            <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>🌤️</div>
              <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 500 }}>Weather App</h2>
              <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>
                Add your OpenWeatherMap API key to see live data.
              </p>
            </div>
          )}
        </div>

        {/* 5-day forecast */}
        <div style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "16px 20px",
          color: "#fff",
        }}>
          <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 600, opacity: 0.65, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            5-day forecast
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {MOCK_FORECASTS.map((f, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ margin: "0 0 6px", fontSize: 12, opacity: 0.65 }}>{f.day}</p>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
                <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500 }}>
                  {unit === "C" ? f.high : toF(f.high)}°
                </p>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.55 }}>
                  {unit === "C" ? f.low : toF(f.low)}°
                </p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 16 }}>
          Powered by OpenWeatherMap
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.5); }
        input:focus { border-color: rgba(255,255,255,0.6) !important; box-shadow: 0 0 0 3px rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
