import Slider from '@/components/Slider';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { TripsApi } from '../../../src/api/services';

const { width, height } = Dimensions.get('window');
const backgroundImg =
  'https://images.unsplash.com/photo-1775126679367-3057683ced2e?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0';

const mapTrip = (t) => {
  const parts = (t.location || '').split(',').map((p) => p.trim()).filter(Boolean);
  return {
    id: t.id,
    profileId: t.user?.id || t.userId,
    title: t.title,
    location1: t.region || parts[0] || '',
    location2: t.country || parts[1] || parts[0] || '',
    image: t.coverPhoto || t.media?.[0]?.mediaUrl,
    authorName: t.user?.fullName || t.user?.username || 'Traveler',
    authorPic: t.user?.profilePicture,
  };
};

export default function TripList() {
  const params = useLocalSearchParams();
  const title = params.title;
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
    <ImageBackground source={{ uri: backgroundImg }} style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.mainContainer}>
        <Text style={styles.mainTitle}>{title}</Text>
        <Slider trips={trips} loading={loading} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    opacity: 0.5,
    width,
    height,
    backgroundColor: 'black',
    position: 'absolute',
  },
  mainTitle: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginTop: 20,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
