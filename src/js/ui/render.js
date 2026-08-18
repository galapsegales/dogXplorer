// Funciones de renderizado de tarjetas y resultados

import { state, isFavorite, saveFavorites, updateFavoritesCount, toggleFavorite } from '../state/store.js';

// Genera una tarjeta para un perro.
export function renderCard(dog) {
  const isFav = isFavorite(dog.id);
  const starClass = isFav ? 'card__favorite--active' : '';
  
  return `
    <article class="card">
      <button type="button" class="card__favorite ${starClass}" data-dog-id="${dog.id}" aria-label="Añadir a favoritos">
        ★
      </button>
      
      <div class="card__media">
        <img src="${dog.image || 'https://images.dog.ceo/breeds/husky/n02110185_4321.jpg'}" alt="Foto de ${dog.name}" loading="lazy" width="300" height="300" />
        <span class="card__image-fallback" hidden>IMAGE NOT AVAILABLE</span>
      </div>
      
      <div class="card__body">
        <h3 class="card__title">${dog.name}</h3>
        
        <dl class="card__list">
          <div>
            <dt>Grupo</dt>
            <dd>${dog.group || '—'}</dd>
          </div>
          <div>
            <dt>Temperamento</dt>
            <dd>${dog.temperament || '—'}</dd>
          </div>
        </dl>
        
      </div>
    </article>
  `;
}

// Pinta los resultados y conecta sus botones.
export function renderResults() {
  const grid = document.getElementById('dog-grid');
  const status = document.getElementById('dog-status');
  const loadMore = document.getElementById('dog-load-more');

  if (!grid) return;

  const displayDogs = state.currentView === 'favoritos' ? state.favoriteDogs : state.dogs;
  const nextDogs = displayDogs.slice(0, state.visibleCount);
  
  grid.innerHTML = nextDogs.map(renderCard).join('');

  // Muestra una marca si la imagen no carga.
  grid.querySelectorAll('.card__media img').forEach((image) => {
    image.addEventListener('error', () => {
      image.hidden = true;
      image.nextElementSibling?.removeAttribute('hidden');
    }, { once: true });
  });
  
  // Activa o desactiva favoritos desde cada tarjeta.
  grid.querySelectorAll('.card__favorite').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const dogId = button.dataset.dogId;
      const dogObject = displayDogs.find(d => String(d.id) === String(dogId));
      
      if (dogObject) {
        toggleFavorite(dogObject);
        saveFavorites();
        updateFavoritesCount();
        renderResults();
      }
    });
  });

  // Muestra el mensaje correspondiente si no hay resultados.
  if (!displayDogs.length) {
    status.textContent = state.currentView === 'favoritos' 
      ? 'No tienes perros favoritos aún.' 
      : 'No se encontraron perros con ese término.';
    loadMore.innerHTML = '';
    return;
  }

  status.textContent = '';

  if (state.visibleCount >= displayDogs.length) {
    loadMore.innerHTML = '';
    return;
  }

  // Añade el botón para cargar más tarjetas.
  loadMore.innerHTML = '<button type="button" class="btn btn--secondary" id="load-more-btn">Cargar más</button>';
  document.getElementById('load-more-btn')?.addEventListener('click', () => {
    state.visibleCount += 8;
    renderResults();
  });
}
