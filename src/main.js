import './styles/main.scss';

import { loadFavorites, updateFavoritesCount } from './js/state/store.js';
import { renderApp, loadDogs } from './js/ui/app.js';
import { setupNavigation } from './js/ui/navigation.js';

// Carga los favoritos y prepara la aplicación.
loadFavorites();
updateFavoritesCount();
renderApp(loadDogs);
setupNavigation(loadDogs);

