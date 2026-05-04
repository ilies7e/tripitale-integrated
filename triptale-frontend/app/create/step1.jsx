// Step 1 — choose category
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CategoriesApi } from '../../src/api/services';
import { getTripDraft, resetTripDraft, setTripDraft } from '../../src/store/tripDraft';

const { width } = Dimensions.get('window');

// Map backend slugs to FontAwesome icon names
const ICONS = {
  camping: 'campground',
  'hotel-vacation': 'hotel',
  hiking: 'hiking',
  beach: 'umbrella-beach',
  'city-tour': 'city',
};

export default function Step1() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await CategoriesApi.list();
      setCategories(Array.isArray(data) ? data : []);
      const current = getTripDraft();
      if (current.categoryId) setSelectedId(current.categoryId);
    } catch (err) {
      console.warn('step1 load failed', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    resetTripDraft();
    load();
  }, [load]);

  const onNext = () => {
    if (!selectedId) return;
    const selected = categories.find((c) => c.id === selectedId);
    setTripDraft({
      categoryId: selectedId,
      categorySlug: selected?.slug,
      categoryTitle: selected?.name,
    });
    router.push('/create/step2');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Where does{'\n'}your Trip{'\n'}belong?
        </Text>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#60868f" />
          ) : (
            <ScrollView contentContainerStyle={styles.gridWrapper} showsVerticalScrollIndicator={false}>
              {categories.map((item) => {
                const active = selectedId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.itemContainer, active && styles.selectedItem]}
                    onPress={() => setSelectedId(item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconContainer}>
                      <FontAwesome5
                        name={ICONS[item.slug] || 'map-marker-alt'}
                        size={50}
                        color={active ? '#60868f' : '#000'}
                      />
                    </View>
                    <View style={[styles.separator, active && styles.selectedSeparator]} />
                    <Text style={[styles.itemTitle, active && styles.selectedText]}>
                      {(item.name || '').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !selectedId && { opacity: 0.5 }]}
          onPress={onNext}
          disabled={!selectedId}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#edf2e6' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#edf2e6',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textAlign: 'right',
    color: '#000',
    marginBottom: 28,
    lineHeight: 36,
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 8,
    width: width * 0.85,
  },
  itemContainer: {
    width: '46%',
    aspectRatio: 0.85,
    backgroundColor: '#edf2e6',
    borderRadius: 8,
    margin: '2%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#60868f',
    backgroundColor: '#e6ebd8',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  separator: {
    height: 1,
    width: '75%',
    backgroundColor: '#cdd4c5',
    marginBottom: 8,
  },
  selectedSeparator: { backgroundColor: '#a3b5b8' },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'serif',
    letterSpacing: 0.5,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  selectedText: { color: '#60868f' },
  nextButton: {
    backgroundColor: '#60868f',
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.85,
    alignSelf: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1.5 },
});
