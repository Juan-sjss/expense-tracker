import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { colors } from '../theme/colors';

export function HomeScreen() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? colors.dark : colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} testID="home-screen">
      <Text style={[styles.title, { color: theme.text }]}>Hola Expense Tracker</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>Tu dinero, bajo control.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
  },
});
