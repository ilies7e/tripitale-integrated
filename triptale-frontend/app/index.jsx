// Redirect (check if logged in)
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <ActivityIndicator size="large" color="#124559" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/(tabs)/categories" />;
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF6E0',
  },
});
