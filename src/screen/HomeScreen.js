import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getPokemonList, getPokemonDetails } from '../services/pokeApi';
import PokemonCard from '../components/PokemonCard';
import { colors, spacing } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const LIMIT = 20;

  const loadPokemons = async (currentOffset = 0, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    const controller = new AbortController();
    try {
      const results = await getPokemonList(LIMIT, currentOffset, controller.signal);
      setPokemonList((prev) => (append ? [...prev, ...results] : results));
      if (results.length < LIMIT) setHasMore(false);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('No se pudo conectar con la PokéAPI. Revisa tu internet.'); //[cite: 4]
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!isSearching) {
      loadPokemons(0, false);
    }
  }, [isSearching]);

  const handleSearch = async () => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      setIsSearching(false);
      setOffset(0);
      setHasMore(true);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    setError(null);
    setPokemonList([]);

    const controller = new AbortController();
    try {
      const details = await getPokemonDetails(query, controller.signal);
      setPokemonList([
        {
          id: details.id,
          name: details.name,
          image: details.image,
        },
      ]);
      setHasMore(false);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(`No se encontró ningún Pokémon con "${searchText}".`); //[cite: 4]
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isSearching && !loadingMore && hasMore && !loading) {
      const nextOffset = offset + LIMIT;
      setOffset(nextOffset);
      loadPokemons(nextOffset, true); //[cite: 3]
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>PokéDex Explorer</Text> {/*[cite: 3] */}
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Busca por nombre o número..." //[cite: 4]
          placeholderTextColor={colors.textMuted}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none" //[cite: 5]
          autoCorrect={false} //[cite: 5]
        />
        <Pressable style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text> {/*[cite: 4] */}
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando Pokémon...</Text> {/*[cite: 4] */}
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={[styles.button, { marginTop: spacing.md }]}
            onPress={() => {
              setSearchText('');
              setIsSearching(false);
              loadPokemons(0, false);
            }}
          >
            <Text style={styles.buttonText}>Reintentar</Text> {/*[cite: 4] */}
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => String(item.id)}
          numColumns={2} //[cite: 4]
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={() => navigation.navigate('Detail', { pokemonId: item.id })}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} /> {/*[cite: 4] */}
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Sin resultados encontrados.</Text> {/*[cite: 4] */}
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerContainer: { paddingTop: spacing.lg, paddingHorizontal: spacing.md, backgroundColor: colors.card, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: colors.primaryDark, textAlign: 'center' },
  searchRow: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm },
  input: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: spacing.md, height: 44, color: colors.text },
  button: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: spacing.md, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: spacing.md },
  listContainer: { paddingBottom: spacing.lg },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  loadingText: { marginTop: spacing.sm, color: colors.textMuted },
  errorText: { textAlign: 'center', color: colors.danger, fontSize: 16 },
  emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 16 },
  footerLoader: { paddingVertical: spacing.md, alignItems: 'center' },
});