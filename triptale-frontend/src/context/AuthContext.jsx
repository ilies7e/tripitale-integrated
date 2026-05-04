import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadApiBaseUrl } from '../api/config';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../api/client';
import { AuthApi, UsersApi } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    try {
      await loadApiBaseUrl();
      const token = await getAccessToken();
      if (!token) {
        setUser(null);
      } else {
        try {
          const me = await UsersApi.me();
          setUser(me);
        } catch {
          await clearTokens();
          setUser(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email, password) => {
    const res = await AuthApi.login(email, password);
    await setTokens(res.accessToken, res.refreshToken);
    try {
      const me = await UsersApi.me();
      setUser(me);
    } catch {
      setUser(res.user);
    }
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await AuthApi.register(data);
    await setTokens(res.accessToken, res.refreshToken);
    try {
      const me = await UsersApi.me();
      setUser(me);
    } catch {
      setUser(res.user);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    // Clear local state FIRST so the UI exits authenticated screens immediately,
    // even if the backend is unreachable or the network is slow.
    let refreshToken = null;
    try {
      refreshToken = await getRefreshToken();
    } catch {
      /* ignore */
    }
    try {
      await clearTokens();
    } catch {
      /* ignore */
    }
    setUser(null);

    // Best-effort revoke on the backend, fire-and-forget with a short timeout.
    if (refreshToken) {
      const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
      Promise.race([AuthApi.logout(refreshToken).catch(() => {}), timeout]);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await UsersApi.me();
      setUser(me);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser, setUser }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
