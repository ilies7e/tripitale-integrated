// Shows: another user's profile (view + follow)
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { UsersApi } from '../../../src/api/services';
import { resolveMediaUrl } from '../../../src/api/config';
import { useAuth } from '../../../src/context/AuthContext';
import VerifiedBadge from '@/components/VerifiedBadge';

const COLORS = {
  inkBlack: '#01161E',
  darkTeal: '#124559',
  airForceBlue: '#598392',
  ashGrey: '#AEC3B0',
  beige: '#EFF6E0',
};

const FILTERS = [
  { key: 'latest', label: 'Latest' },
  { key: 'mostLiked', label: 'Most Liked' },
  { key: 'oldest', label: 'Oldest' },
];

export default function ViewProfile() {
  const router = useRouter();
  const { user: me } = useAuth();
  const { userId } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [activeFilter, setActiveFilter] = useState('latest');

  const isOwn = !!me && String(me.id) === String(userId);

  const sortedTrips = useMemo(() => {
    const copy = [...trips];
    if (activeFilter === 'latest') {
      return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (activeFilter === 'oldest') {
      return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (activeFilter === 'mostLiked') {
      return copy.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0));
    }
    return copy;
  }, [trips, activeFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, t, followers, following, followStatus] = await Promise.all([
        UsersApi.getById(userId),
        UsersApi.trips(userId).catch(() => ({ items: [] })),
        UsersApi.followers(userId).catch(() => ({ total: 0 })),
        UsersApi.following(userId).catch(() => ({ total: 0 })),
        isOwn
          ? Promise.resolve({ following: false })
          : UsersApi.followStatus(userId).catch(() => ({ following: false })),
      ]);
      setProfile(u);
      setTrips(t?.items || []);
      setCounts({ followers: followers?.total ?? 0, following: following?.total ?? 0 });
      setIsFollowing(!!followStatus?.following);
    } catch (err) {
      console.warn('profile load failed', err?.message);
    } finally {
      setLoading(false);
    }
  }, [userId, isOwn]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFollow = async () => {
    if (working) return;
    setWorking(true);
    try {
      if (isFollowing) {
        await UsersApi.unfollow(userId);
        setIsFollowing(false);
        setCounts((c) => ({ ...c, followers: Math.max(0, c.followers - 1) }));
      } else {
        await UsersApi.follow(userId);
        setIsFollowing(true);
        setCounts((c) => ({ ...c, followers: c.followers + 1 }));
      }
    } catch (err) {
      console.warn('toggleFollow failed', err?.message);
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.darkTeal} />
      </View>
    );
  }
  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text>User not found.</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={COLORS.inkBlack} />
      </TouchableOpacity>
      {profile.profilePicture ? (
        <View>
          <VerifiedBadge isVerified={profile.isPremium} size={35} style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 20, elevation: 20 }} />
          <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
        </View>
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Ionicons name="person" size={50} color={COLORS.beige} />
        </View>
      )}
      <Text style={styles.name}>
        {profile.fullName || profile.username}
      </Text>
      <Text style={styles.username}>@{profile.username}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{trips.length}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{counts.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{counts.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {!!profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

      {!isOwn && (
        <TouchableOpacity
          style={[
            styles.followBtn,
            isFollowing ? styles.followingBtn : null,
            working && { opacity: 0.7 },
          ]}
          onPress={toggleFollow}
          disabled={working}
        >
          <Text style={[styles.followBtnText, isFollowing && { color: COLORS.inkBlack }]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.pill,
              activeFilter === f.key && styles.pillActive,
            ]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.pillText,
                activeFilter === f.key && styles.pillTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }) => {
    const avg = item.rating?.average ?? 0;
    const ratingDisplay = avg > 0 ? avg.toFixed(1) : null;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.cardContainer}
        onPress={() => router.push(`/trip/${item.id}`)}
      >
        <ImageBackground
          source={{
            uri:
              resolveMediaUrl(
                item.coverPhoto ||
                item.media?.[0]?.mediaUrl
              ) ||
              'https://images.unsplash.com/photo-1504280390267-3310452f19d2?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 16 }}
        >
          <View style={styles.cardOverlay}>
            {ratingDisplay && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingBadgeText}>{ratingDisplay}</Text>
              </View>
            )}
            <Text style={styles.cardCategory}>{(item.category?.name || '').toUpperCase()}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardLocation}>
              {item.country || item.region || item.location}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: COLORS.beige }}
      contentContainerStyle={{ paddingBottom: 40 }}
      ListHeaderComponent={renderHeader}
      data={sortedTrips}
      keyExtractor={(t) => String(t.id)}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', padding: 20, color: '#666' }}>
          No trips yet.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.beige },
  header: {
    backgroundColor: COLORS.beige,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', left: 16, top: 50 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  avatarFallback: {
    backgroundColor: COLORS.inkBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: COLORS.inkBlack,
  },
  username: { fontSize: 14, color: COLORS.darkTeal, marginBottom: 10 },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginVertical: 10,
  },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 16, fontWeight: 'bold', color: COLORS.inkBlack },
  statLabel: { fontSize: 12, color: COLORS.darkTeal },
  bio: { fontSize: 14, color: COLORS.inkBlack, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  followBtn: {
    marginTop: 14,
    backgroundColor: COLORS.darkTeal,
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  followingBtn: {
    backgroundColor: COLORS.ashGrey,
  },
  followBtnText: { color: COLORS.beige, fontWeight: '700' },
  filterScroll: { marginTop: 16, alignSelf: 'stretch' },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.airForceBlue,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: COLORS.darkTeal,
    borderColor: COLORS.darkTeal,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.airForceBlue,
  },
  pillTextActive: {
    color: COLORS.beige,
  },
  cardContainer: {
    height: 300,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: { flex: 1, justifyContent: 'flex-end' },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  ratingBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  cardCategory: { color: COLORS.beige, fontSize: 12, letterSpacing: 1 },
  cardTitle: { color: COLORS.beige, fontSize: 22, fontWeight: 'bold', fontFamily: 'serif' },
  cardLocation: { color: COLORS.beige, fontSize: 13 },
});
