// Shows: Categories (Camping, Hotel, etc.) — fetched from backend
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { CategoriesApi } from '../../src/api/services';

import COLORS from '@/assets/colors/colors';

// Map each category slug (or backend `icon` string) to a FontAwesome5 icon name.
// Keeps the minimalist black-icon look from the design mockups.
const ICON_BY_SLUG = {
  camping: 'campground',
  'hotel-vacation': 'hotel',
  hiking: 'hiking',
  beach: 'umbrella-beach',
  'city-tour': 'city',
  'road-trip': 'road',
  desert: 'sun',
  mountain: 'mountain',
  cultural: 'landmark',
  'food-wine': 'utensils',
  adventure: 'compass',
  wildlife: 'paw',
  cruise: 'ship',
  festival: 'music',
  wellness: 'spa',
  'winter-sports': 'snowflake',
  'island-hopping': 'umbrella-beach',
  backpacking: 'suitcase-rolling',
};

export default function Categories() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await CategoriesApi.list();
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.rootContainer}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        }}
        style={styles.mainContainer}
        imageStyle={{ opacity: 0.3 }}
      >
        <Text style={styles.heading}>Categorize</Text>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.beige} />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => load(true)}
                tintColor={COLORS.beige}
              />
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/home/discover/[categoryId]',
                    params: {
                      categoryId: String(item.id),
                      title: item.name,
                      icon: item.icon,
                      slug: item.slug,
                    },
                  })
                }
                style={({ pressed }) => [styles.catItem, pressed && { opacity: 0.85 }]}
              >
                <Text style={styles.catItemTitle}>{(item.name || '').toUpperCase()}</Text>
                <View style={styles.catIconBox}>
                  <FontAwesome5
                    name={ICON_BY_SLUG[item.slug] || item.icon || 'map-marked-alt'}
                    size={96}
                    color={COLORS.inkBlack}
                    solid={false}
                  />
                </View>
                <View style={styles.divider} />
                <Text style={styles.catItemDescription}>
                  {item.description || 'Explore trips in this category.'}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.errorText}>No categories yet.</Text>
            }
          />
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#000' },
  mainContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  listContent: { paddingBottom: 30 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  errorText: {
    color: COLORS.beige,
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
  heading: {
    fontWeight: '700',
    fontFamily: 'serif',
    fontSize: 26,
    color: COLORS.beige,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: COLORS.beige,
    paddingBottom: 6,
    marginBottom: 20,
    marginHorizontal: 40,
  },
  catItem: {
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    marginBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  catItemTitle: {
    fontSize: 30,
    fontWeight: '900',
    fontFamily: 'serif',
    color: COLORS.inkBlack,
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
  },
  catIconBox: {
    height: 150,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.inkBlack,
    opacity: 0.2,
    marginBottom: 16,
  },
  catItemDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.inkBlack,
    lineHeight: 20,
  },
});
