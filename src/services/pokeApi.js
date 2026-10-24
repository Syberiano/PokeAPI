const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit = 20, offset = 0, signal) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, { signal });
  if (!response.ok) {
    throw new Error('No se pudo conectar con la PokéAPI.');
  }
  const data = await response.json();
  
  return data.results.map((pokemon) => {
    const id = pokemon.url.split('/').filter(Boolean).pop();
    return {
      id,
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });
}

export async function getPokemonDetails(nameOrId, signal) {
  const input = String(nameOrId).trim().toLowerCase();
  const query = /^#?\d+$/.test(input)
    ? String(Number(input.replace('#', '')))
    : input;
  const response = await fetch(`${BASE_URL}/pokemon/${query}`, { signal });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Pokémon no encontrado.');
    }
    throw new Error('Error al obtener los detalles.');
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    height: data.height / 10,
    weight: data.weight / 10,
    types: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
  };
}