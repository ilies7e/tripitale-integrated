import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TripsApi } from '../../../src/api/services';
import { useAuth } from '../../../src/context/AuthContext';
import VerifiedBadge from '../../../components/VerifiedBadge';

const COLORS = {
  inkBlack: '#01161E',
  darkTeal: '#124559',
  airForceBlue: '#598392',
  ashGrey: '#AEC3B0',
  beige: '#EFF6E0',
  gold: '#C9A84C',
};

export default function AnalyticsScreen() {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await TripsApi.analytics(tripId);
        setData(data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Premium required to view analytics');
        } else {
          setError('Failed to load analytics');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchAnalytics();
  }, [tripId, user?.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed" size={48} color={COLORS.gold} style={{ marginBottom: 16 }} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.push('/home/premium')}>
          <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
          <Text style={{ color: COLORS.airForceBlue }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.inkBlack} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Trip Analytics</Text>
        <VerifiedBadge isVerified={true} size={24} style={{ marginLeft: 8 }} />
      </View>

      <Text style={styles.subtitle}>Advanced insights for your premium journey.</Text>

      <View style={styles.grid}>
        <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.card}>
          <Ionicons name="eye" size={28} color={COLORS.gold} />
          <Text style={styles.cardValue}>{data?.views?.toLocaleString() || '0'}</Text>
          <Text style={styles.cardLabel}>Total Views</Text>
        </LinearGradient>

        <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.card}>
          <Ionicons name="bookmark" size={28} color={COLORS.gold} />
          <Text style={styles.cardValue}>{data?.saves?.toLocaleString() || '0'}</Text>
          <Text style={styles.cardLabel}>Total Saves</Text>
        </LinearGradient>

        <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.card}>
          <Ionicons name="chatbubbles" size={28} color={COLORS.gold} />
          <Text style={styles.cardValue}>{data?.comments?.toLocaleString() || '0'}</Text>
          <Text style={styles.cardLabel}>Comments</Text>
        </LinearGradient>

        <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.card}>
          <Ionicons name="star" size={28} color={COLORS.gold} />
          <Text style={styles.cardValue}>{data?.averageRating?.toFixed(1) || '0.0'}</Text>
          <Text style={styles.cardLabel}>Avg. Rating ({data?.totalRatings || 0})</Text>
        </LinearGradient>
      </View>

      <View style={styles.wideCard}>
        <View style={styles.wideCardHeader}>
          <Text style={styles.wideCardTitle}>Engagement Rate</Text>
          <Text style={styles.wideCardValue}>{data?.engagementRate || '0.00'}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={[COLORS.gold, '#fcd25f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${Math.min(data?.engagementRate || 0, 100)}%` }]}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backBtn: {
    marginBottom: 20,
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: COLORS.inkBlack,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkTeal,
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: '47%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  wideCard: {
    marginTop: 20,
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  wideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  wideCardTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  wideCardValue: {
    fontSize: 24,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.inkBlack,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  upgradeBtn: {
    backgroundColor: COLORS.inkBlack,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  upgradeBtnText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
