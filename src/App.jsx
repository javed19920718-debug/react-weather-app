import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import { useFavorites } from "./context/FavoritesContext";

function Home() {
const [city, setCity] = useState("");
const [weather, setWeather] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const { addFavorite, removeFavorite, isFavorite } = useFavorites();

async function handleSearch(cityName) {
setLoading(true);
setError("");
setWeather(null);


try {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("API key nahi mili. .env file check karein.");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityName
    )}&appid=${apiKey}&units=metric`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Weather data nahi mila.");
  }

  setWeather(data);
} catch (err) {
  setError(err.message || "Kuch ghalat ho gaya.");
} finally {
  setLoading(false);
}


}

function handleFavorite() {
if (!weather) return;


if (isFavorite(weather.id)) {
  removeFavorite(weather.id);
} else {
  addFavorite(weather);
}


}

return ( <div className="mt-10 text-center text-white"> <div className="text-7xl">🌤️</div>


  <h2 className="mt-4 text-3xl font-bold">Weather App</h2>

  <p className="mt-3 text-white/80">Search for your city</p>

  <SearchBar
    city={city}
    setCity={setCity}
    onSearch={handleSearch}
  />

  {loading && <p className="mt-6">Loading weather...</p>}

  {error && (
    <p className="mt-6 rounded-xl bg-red-500/30 p-4" role="alert">
      {error}
    </p>
  )}

  {weather && (
    <div className="mt-6 rounded-2xl bg-white/20 p-6 shadow-lg">
      <h3 className="text-2xl font-bold">
        {weather.name}, {weather.sys.country}
      </h3>

      <div className="mt-3 text-6xl">
        {Math.round(weather.main.temp)}°C
      </div>

      <p className="mt-2 text-xl capitalize">
        {weather.weather[0].description}
      </p>

      
<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
  <div className="rounded-xl bg-white/10 p-4">
    <p className="text-sm text-white/80">🤗 Feels Like</p>
    <p className="mt-2 text-xl font-bold">
      {Math.round(weather.main.feels_like)}°C
    </p>
  </div>

  <div className="rounded-xl bg-white/10 p-4">
    <p className="text-sm text-white/80">💧 Humidity</p>
    <p className="mt-2 text-xl font-bold">
      {weather.main.humidity}%
    </p>
  </div>

  <div className="rounded-xl bg-white/10 p-4">
    <p className="text-sm text-white/80">💨 Wind Speed</p>
    <p className="mt-2 text-xl font-bold">
      {weather.wind.speed} m/s
    </p>
  </div>

  <div className="rounded-xl bg-white/10 p-4">
    <p className="text-sm text-white/80">🌡️ Pressure</p>
    <p className="mt-2 text-xl font-bold">
      {weather.main.pressure} hPa
    </p>
  </div>

  <div className="rounded-xl bg-white/10 p-4">
    <p className="text-sm text-white/80">🌅 Sunrise</p>
    <p className="mt-2 text-xl font-bold">
      {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  </div>

  <div className="rounded-xl bg-white/10 p-4">
    <p className="text-sm text-white/80">🌇 Sunset</p>
    <p className="mt-2 text-xl font-bold">
      {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  </div>
</div>

      <button
        type="button"
        onClick={handleFavorite}
        className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-blue-900 transition hover:bg-sky-100"
      >
        {isFavorite(weather.id)
          ? "❤️ Remove from Favorites"
          : "🤍 Add to Favorites"}
      </button>
    </div>
  )}
</div>


);
}

function About() {
return ( <div className="mt-10 text-center text-white"> <h2 className="text-3xl font-bold">About Us</h2> <p className="mt-3">
This app helps you explore weather information. </p> </div>
);
}

function Favorites() {
const { favorites, removeFavorite } = useFavorites();

return ( <div className="mt-10 text-center text-white"> <h2 className="text-3xl font-bold">Favorite Cities ❤️</h2>


  {favorites.length === 0 ? (
    <p className="mt-4 text-white/80">
      No favorite cities yet. Search for a city and add it to your favorites!
    </p>
  ) : (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {favorites.map((weather) => (
        <div
          key={weather.id}
          className="rounded-2xl bg-white/20 p-5 shadow-lg"
        >
          <h3 className="text-xl font-bold">
            {weather.name}, {weather.sys.country}
          </h3>

          <p className="mt-3 text-4xl">
            {Math.round(weather.main.temp)}°C
          </p>

          <p className="mt-2 capitalize">
            {weather.weather[0].description}
          </p>

          <p className="mt-2 text-sm">
            Humidity: {weather.main.humidity}%
          </p>

          <button
            type="button"
            onClick={() => removeFavorite(weather.id)}
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
          >
            Remove ❤️
          </button>
        </div>
      ))}
    </div>
  )}
</div>


);
}

function App() {
return ( <div className="min-h-screen bg-gradient-to-br from-sky-400 to-blue-700 p-6"> <Navbar />


  <main className="mx-auto max-w-3xl">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  </main>
</div>


);
}

export default App;
