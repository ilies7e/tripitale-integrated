// Server settings screen — lets user change backend URL
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getApiBaseUrl,
  getDefaultApiBaseUrl,
  loadApiBaseUrl,
  setApiBaseUrl,
} from '../../src/api/config';

const COLORS = {
  inkBlack: '#01161E',
  darkTeal: '#124559',
  airForceBlue: '#598392',
  ashGrey: '#AEC3B0',
  beige: '#EFF6E0',
};

export default function ServerSettings() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [defaultUrl] = useState(getDefaultApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadApiBaseUrl().then(() => setUrl(getApiBaseUrl()));
  }, []);

  const testConnection = async () => {
    setStatus('');
    setTesting(true);
    const target = String(url || '').trim().replace(/\/+$/, '');
    if (!target) {
      setStatus('Please enter a URL');
      setTesting(false);
      return;
    }
    try {
      const res = await fetch(`${target}/health`, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => ({}));
      setStatus(`Connection OK ✓  ${data?.status ? `(${data.status})` : ''}`);
    } catch (err) {
      setStatus(`Failed: ${err?.message || 'unreachable'}`);
    } finally {
      setTesting(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await setApiBaseUrl(url);
      Alert.alert('Saved', 'Server URL updated.');
      router.back();
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.inkBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Server Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>Backend URL</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="http://192.168.1.10:4000"
          autoCapitalize="none"
          keyboardType="url"
          placeholderTextColor={COLORS.ashGrey}
        />
        <Text style={styles.hint}>
          Default on this device: {defaultUrl}
          {'\n'}• Web / simulator: http://localhost:4000
          {'\n'}• Android emulator: http://10.0.2.2:4000
          {'\n'}• Expo Go on phone (same WiFi): http://YOUR_PC_IP:4000
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btn, styles.secondary, testing && { opacity: 0.7 }]}
            onPress={testConnection}
            disabled={testing}
          >
            {testing ? (
              <ActivityIndicator color={COLORS.darkTeal} />
            ) : (
              <Text style={styles.secondaryText}>Test connection</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.primary, saving && { opacity: 0.7 }]}
            onPress={save}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.beige} />
            ) : (
              <Text style={styles.primaryText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {!!status && <Text style={styles.status}>{status}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.beige },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.inkBlack },
  body: { padding: 20 },
  label: { color: COLORS.darkTeal, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.ashGrey,
    padding: 12,
    fontSize: 15,
    color: COLORS.inkBlack,
    marginBottom: 12,
  },
  hint: { color: COLORS.darkTeal, fontSize: 13, marginBottom: 16, lineHeight: 18 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  primary: { backgroundColor: COLORS.darkTeal },
  primaryText: { color: COLORS.beige, fontWeight: '700' },
  secondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.ashGrey },
  secondaryText: { color: COLORS.darkTeal, fontWeight: '700' },
  status: { marginTop: 16, color: COLORS.darkTeal, fontSize: 14, textAlign: 'center' },
});
