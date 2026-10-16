import { useEffect, useState } from "react";

function SearchBar({ city, setCity, onSearch }) {
const [suggestions, setSuggestions] = useState([]);
const [loading, setLoading] = useState(false);
const [showSuggestions, setShowSuggestions] = useState(false);

useEffect(() => {
const query = city.trim();

if (query.length < 3) {
  setSuggestions([]);
  return;
}

const controller = new AbortController();

const timer = setTimeout(async () => {
  try {
    setLoading(true);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&city=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      throw new Error("Suggestions load nahi huin.");
    }

    const data = await response.json();
    setSuggestions(data);
  } catch (error) {
    if (error.name !== "AbortError") {
      setSuggestions([]);
    }
  } finally {
    setLoading(false);
  }
}, 1000);

return () => {
  clearTimeout(timer);
  controller.abort();
};

}, [city]);

function handleSelect(place) {
const cityName =
place.address?.city ||
place.address?.town ||
place.address?.village ||
place.name;

setCity(cityName);
setSuggestions([]);
setShowSuggestions(false);
onSearch(cityName);

}

function handleSubmit(event) {
event.preventDefault();

if (city.trim()) {
  setShowSuggestions(false);
  setSuggestions([]);
  onSearch(city.trim());
}

}

return (
<form onSubmit={handleSubmit} className="relative mt-6">
<div className="flex gap-2">
<input
type="text"
value={city}
onChange={(event) => {
setCity(event.target.value);
setShowSuggestions(true);
}}
onFocus={() => setShowSuggestions(true)}
placeholder="Enter city name..."
autoComplete="off"
className="min-w-0 flex-1 rounded-xl bg-white px-4 py-3 text-gray-800 outline-none focus focus"
/>

    <button
      type="submit"
      className="rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white hover:bg-blue-900"
    >
      Search
    </button>
  </div>

  {loading && (
    <p className="mt-2 text-sm text-white/80">
      Searching cities...
    </p>
  )}

  {showSuggestions && suggestions.length > 0 && (
    <ul className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-xl bg-white text-left text-gray-800 shadow-xl">
      {suggestions.map((place) => (
        <li key={place.place_id}>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSelect(place)}
            className="w-full border-b border-gray-100 px-4 py-3 text-left hover:bg-sky-100"
          >
            <span className="font-semibold">
              {place.address?.city ||
                place.address?.town ||
                place.address?.village ||
                place.name}
            </span>

            <span className="block text-sm text-gray-500">
              {place.address?.state
                ? `${place.address.state}, `
                : ""}
              {place.address?.country || ""}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )}
</form>

);
}

export default SearchBar;