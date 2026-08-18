// API integration con The Dog API

const BASE_URL = 'https://api.thedogapi.com/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'DEMO-API-KEY';

// Imagen que se usa si la API no devuelve ninguna.
function fallbackImage() {
  return 'https://images.dog.ceo/breeds/husky/n02110185_4321.jpg';
}

// Crea la URL de una imagen de la API.
function buildImageUrl(referenceImageId) {
  return referenceImageId
    ? `https://cdn2.thedogapi.com/images/${referenceImageId}.jpg`
    : fallbackImage();
}

// Deja todos los perros con la misma estructura.
function normalizeDog(breed, image, id) {
  return {
    id: id || breed.id || Date.now() + Math.random(),
    name: breed.name || 'Perro',
    image,
    country: breed.origin || 'Desconocido',
    temperament: breed.temperament || 'Sin dato',
    group: breed.breed_group || 'Sin grupo',
    life_span: breed.life_span || 'Sin dato',
    description: breed.description || 'Raza de perro.',
    reference_image_id: breed.reference_image_id || '',
  };
}

// Normaliza un resultado que viene con una imagen.
function normalizeImageDog(dog) {
  const breed = dog?.breeds?.[0] || {};
  const image = dog?.url || buildImageUrl(dog?.reference_image_id);

  return normalizeDog(breed, image, dog?.id);
}

// Normaliza una raza cuando no se encontró una imagen.
function normalizeBreedDog(breed) {
  return normalizeDog(breed, buildImageUrl(breed.reference_image_id));
}

// Hace peticiones y muestra un error si fallan.
async function requestJson(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'x-api-key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo cargar la información de los perros.');
  }

  return response.json();
}

// Obtiene perros aleatorios.
export async function fetchRandomDogs(limit = 6) {
  const data = await requestJson(`/images/search?has_breeds=true&limit=${limit}&order=RANDOM`);
  return Array.isArray(data) ? data.map(normalizeImageDog) : [];
}

// Da más puntos a las coincidencias más exactas.
function scoreMatch(term, value = '') {
  const cleanTerm = term.trim().toLowerCase();
  if (!cleanTerm) return 0;

  const cleanValue = String(value).trim().toLowerCase();
  if (!cleanValue) return 0;

  if (cleanValue === cleanTerm) return 100;
  if (cleanValue.startsWith(cleanTerm)) return 90;
  if (cleanValue.includes(cleanTerm)) return 70;
  return 0;
}

// Busca razas por nombre o por grupo.
export async function searchDogs(query, type = 'raza', limit = 8) {
  const term = (query || '').trim();

  if (!term) {
    return fetchRandomDogs(limit);
  }

  // Para los grupos hay que consultar todas las razas y filtrar después.
  const breeds = type === 'grupo'
    ? await requestJson('/breeds')
    : await requestJson(`/breeds/search?q=${encodeURIComponent(term)}`);
  const matchedBreeds = Array.isArray(breeds) ? breeds : [];

  const scored = matchedBreeds
    .map((breed) => {
      const name = breed?.name || '';
      const group = breed?.breed_group || '';
      const target = type === 'grupo' ? group : name;
      const score = Math.max(
        scoreMatch(term, target),
        type === 'grupo' ? scoreMatch(term, name) : scoreMatch(term, group)
      );

      return { breed, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.breed.name.localeCompare(b.breed.name))
    .slice(0, limit);

  // Busca una imagen para cada raza encontrada.
  if (scored.length) {
    const results = [];
    for (const item of scored) {
      const breedId = item.breed.id;
      try {
        const images = await requestJson(`/images/search?breed_id=${breedId}&limit=1`);
        if (Array.isArray(images) && images[0]) {
          results.push(normalizeImageDog(images[0]));
        } else {
          results.push(normalizeBreedDog(item.breed));
        }
      } catch {
        results.push(normalizeBreedDog(item.breed));
      }
    }
    return results;
  }

  // La API no encontró coincidencias.
  return [];
}
