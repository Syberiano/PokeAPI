import { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { getPokemonDetails } from '../services/pokeApi';
import { colors, spacing } from '../theme/colors';

export default function DetailScreen({ route, navigation }) {
  const pokemonId = route?.params?.pokemonId;

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pokemonId) {
      setLoading(false);
      setError('No se pudo abrir la ficha de este Pokémon.');
      return;
    }

    const controller = new AbortController();

    const loadDetails = async () => {
      try {
        const data = await getPokemonDetails(pokemonId, controller.signal);
        setPokemon(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No se pudo cargar la ficha del Pokémon.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDetails();
    return () => controller.abort();
  }, [pokemonId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando ficha...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Pokémon no encontrado.'}</Text>
        <Pressable style={[styles.button, { marginTop: spacing.md }]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver a la lista</Text>
        </Pressable>
      </View>
    );
  }

  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const types = pokemon.types || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerCard}>
        <Image source={{ uri: pokemon.image }} style={styles.image} />
        <Text style={styles.id}>{formattedId}</Text>
        <Text style={styles.title}>{capitalizedName}</Text>

        <View style={styles.typesContainer}>
          {types.map((typeName, index) => {
            const badgeColor = colors.types[typeName] || colors.textMuted;
            return (
              <View key={`${typeName}-${index}`} style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={styles.badgeText}>{typeName.toUpperCase()}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.physiqueRow}>
          <View style={styles.physiqueItem}>
            <Text style={styles.physiqueValue}>{pokemon.height} m</Text>
            <Text style={styles.physiqueLabel}>Altura</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.physiqueItem}>
            <Text style={styles.physiqueValue}>{pokemon.weight} kg</Text>
            <Text style={styles.physiqueLabel}>Peso</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Estadísticas Base</Text>
        {pokemon.stats.map((stat, index) => {
          const percentage = Math.min((stat.value / 255) * 100, 100); // Máximo 255[cite: 4]
          return (
            <View key={index} style={styles.statRow}>
              <Text style={styles.statName}>{stat.name.toUpperCase()}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <View style={styles.statBarBackground}>
                <View style={[styles.statBarFill, { width: `${percentage}%` }]} />
              </View>
            </View>
          );
        })}
      </View>

      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver a la lista</Text> {/*[cite: 4] */}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: spacing.md, paddingBottom: spacing.lg },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: spacing.lg },
  loadingText: { marginTop: spacing.sm, color: colors.textMuted },
  errorText: { textAlign: 'center', color: colors.danger, fontSize: 16 },
  headerCard: { backgroundColor: colors.card, borderRadius: 16, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  image: { width: 180, height: 180 }, //[cite: 5]
  id: { fontSize: 14, fontWeight: 'bold', color: colors.textMuted, marginTop: spacing.sm },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.text, marginVertical: 4 },
  typesContainer: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  sectionCard: { backgroundColor: colors.card, borderRadius: 16, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primaryDark, marginBottom: spacing.md },
  physiqueRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  physiqueItem: { alignItems: 'center' },
  physiqueValue: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  physiqueLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  separator: { width: 1, height: 30, backgroundColor: colors.border },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  statName: { width: 90, fontSize: 12, fontWeight: 'bold', color: colors.textMuted },
  statValue: { width: 35, fontSize: 14, fontWeight: 'bold', color: colors.text, textAlign: 'right', marginRight: spacing.sm },
  statBarBackground: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  statBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  button: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: 12, alignItems: 'center', marginTop: spacing.sm },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});