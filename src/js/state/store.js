// State management y lógica de favoritos

export const state = {
  dogs: [],
  favoriteDogs: [],
  currentView: 'todos',
  currentQuery: '',
  currentType: 'raza',
  visibleCount: 8,
  searchTimer: null,
};

// Recupera los favoritos guardados en el navegador.
export function loadFavorites() {
  const stored = localStorage.getItem('dog-favorites');
  state.favoriteDogs = stored ? JSON.parse(stored) : [];
}

// Guarda los favoritos actuales.
export function saveFavorites() {
  localStorage.setItem('dog-favorites', JSON.stringify(state.favoriteDogs));
}

// Comprueba si un perro ya es favorito.
export function isFavorite(dogId) {
  return state.favoriteDogs.some(dog => String(dog.id) === String(dogId));
}

// Añade o quita un perro de favoritos.
export function toggleFavorite(dog) {
  const id = String(dog.id);
  const index = state.favoriteDogs.findIndex(fav => String(fav.id) === id);
  
  if (index > -1) {
    state.favoriteDogs.splice(index, 1);
    return false;
  } else {
    state.favoriteDogs.push(dog);
    return true;
  }
}

// Actualiza el número de favoritos del menú.
export function updateFavoritesCount() {
  const badge = document.getElementById('favorites-count');
  if (badge) {
    badge.textContent = state.favoriteDogs.length;
  }
}
