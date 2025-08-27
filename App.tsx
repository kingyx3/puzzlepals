import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧩 Welcome to PuzzlePals! 🧩</Text>
      <Text style={styles.subtitle}>
        A delightful jigsaw puzzle app for kids!
      </Text>
      <Text style={styles.instruction}>
        Open up App.tsx to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B9EFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFB86B',
    marginBottom: 20,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#9AA0A6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
