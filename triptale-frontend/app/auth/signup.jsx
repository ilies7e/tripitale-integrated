import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function Signup() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields to continue.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Your passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({ fullName: fullName.trim(), email: email.trim(), password });
      router.replace('/(tabs)/categories');
    } catch (err) {
      Alert.alert('Signup failed', err?.message || 'Could not create account.');
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
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>

              <View style={styles.header}>
                <Text style={styles.title}>Trip Tale</Text>
                <Text style={styles.subtitle}>Begin your journey</Text>
              </View>

              <View style={styles.form}>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor="#AEC3B0"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    selectionColor="#598392"
                  />
                </View>

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

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#AEC3B0"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    selectionColor="#598392"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={handleSignup}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#EFF6E0" />
                  ) : (
                    <Text style={styles.buttonText}>Set Sail</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already an explorer? </Text>
                  <Link href="/auth/login" asChild>
                    <TouchableOpacity>
                      <Text style={styles.footerLink}>Log In</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>

            </View>
          </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
    marginTop: 8,
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