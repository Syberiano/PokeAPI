# PokeAPI
Taller de consumo de API - Desarrollo Movil

**PokéDex Explorer** es una aplicación móvil desarrollada con **React Native** y **Expo** que consume la **PokéAPI** v2. Permite explorar una lista paginada de Pokémon, realizar búsquedas por nombre o ID, y consultar la ficha técnica detallada de cada Pokémon con sus tipos, medidas y estadísticas base.

---

## Arquitectura y Estructura del Proyecto

El proyecto está organizado siguiendo una separación estricta de responsabilidades entre la lógica de red, los componentes reutilizables y la interfaz gráfica.

```text
pokedex-explorer/
├── App.js                     # Configuración del Stack Navigator y la navegación general.
├── app.json                   # Configuración del proyecto Expo.
├── package.json               # Dependencias e historial de versiones del proyecto.
├── README.md                  # Documentación principal del repositorio.
└── src/
    ├── theme/
    │   └── colors.js          # Sistema de colores globales y paleta temática para tipos de Pokémon.
    ├── services/
    │   └── pokeApi.js         # Lógica de consumo de API (fetch), manejo de errores y conversión de unidades.
    ├── components/
    │   └── PokemonCard.js     # Componente visual para cada Pokémon en la lista (formato de ID y texto).
    └── screens/
        ├── HomeScreen.js      # Pantalla principal: barra de búsqueda, cuadrícula y scroll infinito.
        └── DetailScreen.js    # Pantalla de detalle: ficha técnica, tipos, peso/altura y barras de stats.
```

### Responsabilidad de cada archivo

- **`src/services/pokeApi.js`**: Aísla totalmente las peticiones HTTP (`fetch`) de la interfaz de usuario. Administra los errores 404 (cuando no se encuentra un Pokémon) y realiza la conversión de decímetros a metros y de hectogramos a kilogramos.
- **`src/theme/colors.js`**: Mantiene la paleta de colores de la aplicación y define los colores asignados a los tipos de Pokémon (fuego, agua, planta, etc.).
- **`src/components/PokemonCard.js`**: Tarjeta reutilizable para rendirizar ítems en la cuadrícula de 2 columnas de la lista principal. Aplica el formato de 3 dígitos (`#025`) al ID y capitaliza el nombre del Pokémon.
- **`src/screens/HomeScreen.js`**: Gestiona el flujo principal con estados de **Cargando**, **Error**, **Sin Resultados** y **Éxito**. Controla el scroll infinito mediante `FlatList` (`onEndReached`).
- **`src/screens/DetailScreen.js`**: Muestra la ficha detallada del Pokémon seleccionado, incluyendo sus badges de tipo, medidas físicas y barras de estadísticas proporcionales (con un máximo base de 255).
- **`App.js`**: Punto de entrada de la aplicación que inicializa el `NavigationContainer` y configura el `NativeStackNavigator`.

---

## Tecnologías y Conceptos Aplicados

- **Framework**: React Native / Expo (Plantilla Blank)
- **Navegación**: React Navigation (Native Stack)
- **Consumo de API**: PokéAPI (`fetch` con `async/await` y soporte para `AbortController`)
- **Componentes Core**: `View`, `Text`, `TextInput`, `Pressable`, `FlatList`, `Image`, `ActivityIndicator`, `ScrollView`, `StyleSheet`
- **Gestión de Estado**: Hooks de React (`useState`, `useEffect`)

---

## Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Syberiano/PokeAPI.git
   cd PokeAPI
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```

4. **Visualizar la aplicación:**
   - Escanea el código QR mostrado en la terminal desde la aplicación **Expo Go** en tu dispositivo móvil.
   - Presiona `a` para abrir en un emulador de Android o `i` para un simulador de iOS.

---

## Reglas de Negocio Implementadas

- **Normalización de búsquedas**: Los nombres o IDs buscados son convertidos a minúsculas y se remueven espacios iniciales/finales.
- **Formato de datos**:
  - Altura convertida de decímetros a metros ($m = \text{decímetros} / 10$).
  - Peso convertido de hectogramos a kilogramos ($kg = \text{hectogramos} / 10$).
  - IDs mostrados con formato de 3 dígitos (`padStart(3, '0')`).
- **Control de Peticiones**: AbortController implementado en los `useEffect` para cancelar peticiones pendientes cuando los componentes se desmontan o cambian sus parámetros.