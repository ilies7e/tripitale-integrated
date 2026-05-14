import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import VerifiedBadge from '../../components/VerifiedBadge';
import { ActivityIndicator, FlatList, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { UsersApi } from '../../src/api/services';
import { resolveMediaUrl } from '../../src/api/config';

const COLORS = {
  inkBlack: '#01161E',
  darkTeal: '#124559',
  airForceBlue: '#598392',
  ashGrey: '#AEC3B0',
  beige: '#EFF6E0',
};

const formatCount = (n) => {
  if (n == null) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
};

const mapTrip = (t) => ({
  id: String(t.id),
  category: (t.category?.name || '').toUpperCase(),
  title: t.title,
  location: t.location || t.country || t.region || '',
  image:
    resolveMediaUrl(
      t.coverPhoto ||
      t.media?.[0]?.mediaUrl
    ) ||
    'https://images.unsplash.com/photo-1504280390267-3310452f19d2?auto=format&fit=crop&w=800&q=80',
  createdAt: t.createdAt,
  savedCount: t._count?.savedBy || 0,
});

export default function MyProfile() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Latest');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });

  const load = useCallback(async (isRefresh = false) => {
    if (!user?.id) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [tripsRes, followersRes, followingRes] = await Promise.all([
        UsersApi.trips(user.id),
        UsersApi.followers(user.id).catch(() => ({ total: 0 })),
        UsersApi.following(user.id).catch(() => ({ total: 0 })),
      ]);
      setTrips((tripsRes?.items || []).map(mapTrip));
      setCounts({
        followers: followersRes?.total ?? 0,
        following: followingRes?.total ?? 0,
      });
      refreshUser();
    } catch (err) {
      console.warn('profile load failed', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, refreshUser]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const sortedTrips = useMemo(() => {
    const copy = [...trips];
    if (activeFilter === 'Latest') {
      copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (activeFilter === 'Oldest') {
      copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (activeFilter === 'Popular') {
      copy.sort((a, b) => (b.savedCount || 0) - (a.savedCount || 0));
    }
    return copy;
  }, [trips, activeFilter]);

  const performLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.warn('logout failed', err?.message);
    }
    // Always navigate away even if logout had a hiccup — local tokens are cleared.
    try {
      router.replace('/auth/login');
    } catch {
      /* ignore */
    }
  }, [logout, router]);

  const handleLogout = () => {
    Alert.alert('Log out?', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: performLogout,
      },
    ]);
  };

  const renderHeader = () => (
    <View style={{ backgroundColor: COLORS.beige }}>
      <View style={styles.topSection}>
        <View style={styles.profileTopRow}>
          {user?.profilePicture ? (
            <ImageBackground
              source={{ uri: user.profilePicture }}
              style={styles.profileImageContainer}
              imageStyle={{ borderRadius: 40 }}
            />
          ) : (
            <View style={styles.profileImageContainer}>
              <Ionicons name="person" size={50} color={COLORS.beige} />
            </View>
          )}
          <View style={styles.nameStatsContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'serif', color: COLORS.inkBlack }}>
                {user?.fullName || user?.username || 'Traveler'}
              </Text>
              <VerifiedBadge isVerified={user?.isVerifiedPremium} size={20} style={{ marginLeft: 6 }} />
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatCount(trips.length)}</Text>
                <Text style={styles.statLabel}>Trips</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatCount(counts.followers)}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatCount(counts.following)}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.bioText}>
          {user?.bio || "Passionate traveler sharing favorite destinations, tips, and hidden gems. Let's wander together!"}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/home/profile/edit')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
            <Ionicons name="pencil" size={14} color={COLORS.airForceBlue} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={handleLogout}>
            <Text style={styles.editButtonText}>Logout</Text>
            <Ionicons name="log-out-outline" size={16} color={COLORS.airForceBlue} />
          </TouchableOpacity>
        </View>

        {/* Premium upgrade banner */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push('/home/premium')}
          style={styles.premiumBannerWrap}
        >
          <LinearGradient
            colors={["#AEC3B0", '#68ffc804']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumBanner}
          >
            <View style={styles.premiumLeft}>
              <Ionicons name="star" size={20} color="#d49800ff" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.premiumBannerTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumBannerSub}>Unlock badges, analytics &amp; more</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d49800ff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        {['Latest', 'Popular', 'Oldest'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterPill, activeFilter === filter && styles.activeFilterPill]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cardContainer}
      onPress={() => router.push(`/trip/${item.id}`)}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 24 }}
      >
        <View style={styles.cardOverlay}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.cardDivider} />
          <View style={styles.cardFooter}>
            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={24} color={COLORS.beige} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
            <View style={styles.heartButton}>
              <Ionicons name="bookmark" size={20} color={COLORS.inkBlack} />
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingVertical: 40 }}>
              <ActivityIndicator color={COLORS.darkTeal} />
            </View>
          ) : (
            <Text
              style={{
                textAlign: 'center',
                color: COLORS.beige,
                paddingVertical: 40,
                fontSize: 14,
              }}
            >
              You have not created any trips yet.
            </Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  listContentContainer: {
    backgroundColor: COLORS.ashGrey,
    paddingBottom: 40,
  },
  topSection: {
    backgroundColor: COLORS.beige,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.inkBlack,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameStatsContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: COLORS.inkBlack,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.inkBlack,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.darkTeal,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.darkTeal,
    marginHorizontal: 12,
    opacity: 0.3,
  },
  bioText: {
    fontSize: 14,
    color: COLORS.inkBlack,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B5C4B1',
    borderWidth: 1,
    borderColor: COLORS.airForceBlue,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 30,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: COLORS.airForceBlue,
    marginRight: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  premiumBannerWrap: {
    alignSelf: 'stretch',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 4,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.airForceBlue,
  },
  premiumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#d49800ff',
    letterSpacing: 0.2,
  },
  premiumBannerSub: {
    fontSize: 12,
    color: '#404841ff',
    marginTop: 2,
  },
  filterSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.ashGrey,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  filterPill: {
    backgroundColor: COLORS.beige,
    borderWidth: 1,
    borderColor: COLORS.airForceBlue,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  activeFilterPill: {
    backgroundColor: COLORS.airForceBlue,
    borderColor: COLORS.airForceBlue,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.airForceBlue,
  },
  activeFilterText: {
    color: 'white',
  },
  cardContainer: {
    height: 400,
    marginHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    justifyContent: 'flex-end',
    padding: 20,
  },
  cardCategory: {
    color: COLORS.beige,
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardTitle: {
    color: COLORS.beige,
    fontSize: 38,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(239, 246, 224, 0.5)',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: COLORS.beige,
    fontSize: 18,
    marginLeft: 6,
  },
  heartButton: {
    backgroundColor: COLORS.beige,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 4,
    width: 40,
    backgroundColor: COLORS.airForceBlue,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 16,
    opacity: 0.8,
  },
});