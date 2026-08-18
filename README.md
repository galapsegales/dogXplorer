# Plantilla Sass + Vite

Plantilla de proyecto frontend con Sass, Vite y estructura modular de estilos.

## Instalación

1. **Clonar el repositorio**
```bash
git clone <URL-del-repositorio>
cd 00_plantilla_sass_vite
```

2. **Instalar dependencias**
```bash
npm install
```

## Scripts disponibles

- **`npm run dev`** - Inicia el servidor de desarrollo con hot reload
- **`npm run build`** - Compila el proyecto para producción
- **`npm run preview`** - Previsualiza la build de producción
- **`npm run deploy`** - Despliega a GitHub Pages

## Estructura del proyecto

```
src/
├── main.js           # Punto de entrada JavaScript
├── style.css         # Estilos compilados
└── styles/
    ├── main.scss     # Archivo principal Sass
    ├── abstracts/    # Variables y mixins
    ├── base/         # Reset y estilos base
    ├── components/   # Componentes reutilizables
    ├── layout/       # Layouts principales
    ├── pages/        # Estilos específicos de páginas
    ├── themes/       # Temas
    └── vendors/      # Librerías externas
```

## Tecnologías

- **Vite** - Build tool y dev server
- **Sass** - Preprocesador CSS
- **Node.js** - Runtime de JavaScript

## Desarrollo

```bash
# Iniciar servidor local
npm run dev
```

El proyecto estará disponible en `http://localhost:xxxx`

## Despliegue

Para desplegar a GitHub Pages:
```bash
npm run deploy
```

Nota: Actualiza la propiedad `base` en `vite.config.js` con tu nombre de repositorio.
