import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
const [favorites, setFavorites] = useState(() => {
try {
const savedFavorites = localStorage.getItem("weather-favorites");
return savedFavorites ? JSON.parse(savedFavorites) : [];
} catch {
return [];
}
});

useEffect(() => {
localStorage.setItem("weather-favorites", JSON.stringify(favorites));
}, [favorites]);

function addFavorite(weather) {
setFavorites((currentFavorites) => {
const alreadyExists = currentFavorites.some(
(city) => city.id === weather.id
);


  if (alreadyExists) return currentFavorites;

  return [...currentFavorites, weather];
});


}

function removeFavorite(cityId) {
setFavorites((currentFavorites) =>
currentFavorites.filter((city) => city.id !== cityId)
);
}

function isFavorite(cityId) {
return favorites.some((city) => city.id === cityId);
}

return (
<FavoritesContext.Provider
value={{ favorites, addFavorite, removeFavorite, isFavorite }}
>
{children}
</FavoritesContext.Provider>
);
}

export function useFavorites() {
return useContext(FavoritesContext);
}
