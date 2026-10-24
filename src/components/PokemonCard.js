import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';

export default function PokemonCard({ pokemon, onPress }) {
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.id}>{formattedId}</Text>
        <Text style={styles.name} numberOfLines={1}>{capitalizedName}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: spacing.sm,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '46%',
  },
  pressed: { opacity: 0.7 },
  image: { width: 100, height: 100 },
  info: { alignItems: 'center', marginTop: spacing.sm },
  id: { fontSize: 12, color: colors.textMuted, fontWeight: 'bold' },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 2 },
});
