// Gestión de navegación entre vistas

import { state } from '../state/store.js';

// Cambia entre la lista de perros y los favoritos.
export function setupNavigation(onNavigate) {
  const navLinks = document.querySelectorAll('.main-nav__link[data-route]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.dataset.route;
      state.visibleCount = 6;
      
      // Al volver a perros se limpian los filtros anteriores.
      if (route === 'dogs') {
        state.currentView = 'todos';
        state.currentQuery = '';
        state.currentType = 'raza';
      } else if (route === 'favorites') {
        state.currentView = 'favoritos';
      }
      
      onNavigate();
    });
  });
}
