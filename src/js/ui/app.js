// Lógica principal: renderizado de la app y carga de datos

import { fetchRandomDogs, searchDogs } from '../api/dogApi.js';
import { renderResults } from './render.js';
import { state } from '../state/store.js';

// Carga los perros según la vista y la búsqueda actual.
export async function loadDogs() {
  const status = document.getElementById('dog-status');
  const grid = document.getElementById('dog-grid');
  const filtersSection = document.getElementById('filters-section');
  
  if (!grid || !status) return;

  if (state.currentView === 'favoritos') {
    // Los favoritos ya están cargados en el estado.
    if (filtersSection) filtersSection.style.display = 'none';
    state.visibleCount = 8;
    renderResults();
    return;
  }

  if (filtersSection) filtersSection.style.display = 'flex';

  status.textContent = 'Cargando perros…';
  grid.innerHTML = '';

  try {
    // Sin búsqueda se muestran perros aleatorios.
    const nextDogs = state.currentQuery
      ? await searchDogs(state.currentQuery, state.currentType, 20)
      : await fetchRandomDogs(12);

    state.dogs = nextDogs;
    state.visibleCount = 8;
    renderResults();
  } catch (error) {
    status.textContent = error.message || 'No se pudieron cargar los perros.';
  }
}

// Crea la vista principal y sus eventos.
export function renderApp(onLoadDogs) {
  const viewRoot = document.getElementById('view-root');
  
  viewRoot.innerHTML = `
    <section class="page page--characters">
      <header class="page__header">
        <h1 class="page__title">El Buscador de Perros Inteligente</h1>
        <p class="page__subtitle">Explora razas de perros, descubre su información y añádelos a favoritos.</p>
      </header>

      <section class="filters" aria-label="Filtros de perros" id="filters-section">
        <div class="filters__field">
          <label class="filters__label" for="dog-query">Texto de Búsqueda</label>
          <input id="dog-query" class="input" type="search" placeholder="Ej. Labrador, Terrier…" />
        </div>

        <div class="filters__field">
          <label class="filters__label" for="dog-type">Opciones de Búsqueda</label>
          <select id="dog-type" class="input">
            <option value="raza">Raza</option>
            <option value="grupo">Grupo</option>
          </select>
        </div>

        <div class="filters__actions">
          <button type="button" class="btn btn--ghost" id="clear-dogs">Limpiar Búsqueda</button>
        </div>
      </section>

      <div class="page__status" id="dog-status"></div>
      <div class="card-grid" id="dog-grid"></div>
      <div class="page__load-more" id="dog-load-more"></div>
    </section>
  `;

  const queryInput = document.getElementById('dog-query');
  const typeSelect = document.getElementById('dog-type');
  const clearButton = document.getElementById('clear-dogs');

  // Espera un poco antes de lanzar la búsqueda mientras se escribe.
  queryInput.addEventListener('input', (event) => {
    state.currentQuery = event.target.value.trim();
    clearTimeout(state.searchTimer);
    state.searchTimer = setTimeout(() => {
      onLoadDogs();
    }, 250);
  });

  typeSelect.addEventListener('change', (event) => {
    state.currentType = event.target.value;
    onLoadDogs();
  });

  clearButton.addEventListener('click', () => {
    state.currentQuery = '';
    state.currentType = 'raza';
    queryInput.value = '';
    typeSelect.value = 'raza';
    onLoadDogs();
  });

  onLoadDogs();
}
