import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const STORAGE_KEY = 'triptale.apiBaseUrl';

// Pick a sane default based on where the app is running.
const deriveDefaultBaseUrl = () => {
  // Prefer LAN IP exposed by Metro/Expo when running via Expo Go
  const hostUri =
    Constants?.expoConfig?.hostUri ||
    Constants?.manifest2?.extra?.expoClient?.hostUri ||
    Constants?.manifest?.debuggerHost;
  if (hostUri && typeof hostUri === 'string') {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost') return `http://${host}:4000`;
  }
  if (Platform.OS === 'android') return 'http://10.0.2.2:4000'; // emulator
  return 'http://localhost:4000';
};

let currentBaseUrl = deriveDefaultBaseUrl();

export const getApiBaseUrl = () => currentBaseUrl;

export const setApiBaseUrl = async (url) => {
  const clean = String(url || '').trim().replace(/\/+$/, '');
  if (!clean) return;
  currentBaseUrl = clean;
  await AsyncStorage.setItem(STORAGE_KEY, clean);
};

export const loadApiBaseUrl = async () => {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) currentBaseUrl = stored;
  return currentBaseUrl;
};

export const getDefaultApiBaseUrl = deriveDefaultBaseUrl;

/**
 * Rewrites a media URL so it uses the current API base URL instead of
 * localhost. This is needed because the backend stores URLs like
 * "http://localhost:4000/uploads/..." but on a physical device / emulator
 * `localhost` refers to the device itself, not the backend server.
 *
 * Also handles relative paths (e.g. "/uploads/...") returned by updated
 * backend versions.
 */
export const resolveMediaUrl = (url) => {
  if (!url) return null;
  // Relative path — prepend the API base
  if (url.startsWith('/')) return `${getApiBaseUrl()}${url}`;
  // Absolute URL with localhost — replace host
  if (/https?:\/\/localhost(:\d+)?/.test(url)) {
    return url.replace(/https?:\/\/localhost(:\d+)?/, getApiBaseUrl());
  }
  // Already an absolute URL with a real host — keep as-is
  return url;
};
