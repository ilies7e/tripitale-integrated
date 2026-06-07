import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ImageBackground } from 'expo-image';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password to continue.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/categories');
    } catch (err) {
      Alert.alert('Login failed', err?.message || 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2159&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.8 }}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>

            <View style={styles.header}>
              <Text style={styles.title}>Trip Tale</Text>
              <Text style={styles.subtitle}>Find your true north</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="traveler@example.com"
                  placeholderTextColor="#AEC3B0"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#598392"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#AEC3B0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  selectionColor="#598392"
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotText}>Lost your map?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#EFF6E0" />
                ) : (
                  <Text style={styles.buttonText}>Embark</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>New explorer? </Text>
                <Link href="/auth/signup" asChild>
                  <TouchableOpacity>
                    <Text style={styles.footerLink}>Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>

              <Link href="/auth/server" asChild>
                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 14 }}>
                  <Text style={{ color: '#598392', fontSize: 13, fontWeight: '600' }}>
                    Server settings
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#01161E', // Ink Black backing
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(1, 22, 30, 0.45)', // Ink Black overlay
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#EFF6E0',
    backgroundColor: '#eff6e0b4', // Beige Card
    borderRadius: 24,
    padding: 28,
    shadowColor: '#01161E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#01161E', // Ink Black
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#124559', // Dark Teal
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#124559', // Dark Teal
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#AEC3B0', // Ash Grey
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#01161E', // Ink Black
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 28,
  },
  forgotText: {
    color: '#598392', // Air Force Blue
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#124559', // Dark Teal
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#124559',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#EFF6E0', // Beige
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#124559', // Dark Teal
    fontSize: 15,
    fontWeight: '500',
  },
  footerLink: {
    color: '#01161E', // Ink Black
    fontSize: 15,
    fontWeight: '800',
  },
});