import Slider from '@/components/Slider';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TripsApi } from '../../../src/api/services';
import { resolveMediaUrl } from '../../../src/api/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '@/assets/colors/colors';
import { FontAwesome5 } from '@expo/vector-icons';
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


const { width, height } = Dimensions.get('window');
const backgroundImg =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';

const mapTrip = (t) => {
  const parts = (t.location || '').split(',').map((p) => p.trim()).filter(Boolean);
  return {
    id: t.id,
    profileId: t.user?.id || t.userId,
    title: t.title,
    location1: t.region || parts[0] || '',
    location2: t.country || parts[1] || parts[0] || '',
    image: resolveMediaUrl(t.coverPhoto || t.media?.[0]?.mediaUrl),
    authorName: t.user?.fullName || t.user?.username || 'Traveler',
    authorPic: resolveMediaUrl(t.user?.profilePicture),
  };
};

export default function TripList() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const title = params.title;
  const icon = params.icon;
  const slug = params.slug;
  const categoryId = params.categoryId;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await TripsApi.list({ categoryId, limit: 30 });
      setTrips((res?.items || []).map(mapTrip));
    } catch (err) {
      console.warn('discover load failed', err?.message);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={{ width: '100%', height: '100%' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerText}>TripTale</Text>
          <Ionicons name='earth' size={24} color={COLORS.inkBlack} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ImageBackground source={{ uri: backgroundImg }} style={styles.background}>
        <View style={styles.overlay} />

        <View style={styles.leftArrowContainer} pointerEvents="none">
          <Ionicons name="chevron-back" size={40} color={COLORS.beige} />
        </View>
        <View style={styles.rightArrowContainer} pointerEvents="none">
          <Ionicons name="chevron-forward" size={40} color={COLORS.beige} />
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.mainTitle} adjustsFontSizeToFit numberOfLines={1}>
              {(title || '').toUpperCase()}
            </Text>
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <FontAwesome5
                name={ICON_BY_SLUG[slug] || icon || 'map-marked-alt'}
                size={30}
                color={COLORS.beige}
                solid={false}
                style={{ paddingVertical: 8 }}
              />
            </View>
          </View>
          <Slider trips={trips} loading={loading} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.beige,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: COLORS.inkBlack
  },
  background: { flex: 1 },
  overlay: {
    opacity: 0.9,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.inkBlack,
    position: 'absolute',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'

  },
  categoryHeader: {

    alignItems: 'center',
    width: width * 0.9,
  },
  mainTitle: {
    fontSize: 40,
    color: COLORS.beige,
    fontWeight: 'bold',
    fontFamily: 'serif',
    letterSpacing: 2,
    textAlign: 'center',
  },
  separatorContainer: {
    alignItems: 'center',

  },
  separatorLine: {
    height: 1,
    backgroundColor: COLORS.beige,
    width: width * 0.85,
  },
  separatorIcon: {



  },
  leftArrowContainer: {
    position: 'absolute',
    left: 2,
    top: '50%',
    zIndex: 10,
    transform: [{ translateY: -20 }],
  },
  rightArrowContainer: {
    position: 'absolute',
    right: 2,
    top: '50%',
    zIndex: 10,
    transform: [{ translateY: -20 }],
  },
});
