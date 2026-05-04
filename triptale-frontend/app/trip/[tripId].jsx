// Trip detail screen — wired to backend (guides, gallery, save, rating, comments)
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommentsApi, RatingsApi, SavedTripsApi, TripsApi } from '../../src/api/services';
import { useAuth } from '../../src/context/AuthContext';

const GUIDE_META = {
  budget: { title: 'Budget Info', icon: '💰', bg: '#E6ECD2' },
  mustvisit: { title: 'Must-Visit', icon: '🧊', bg: '#DFF2F3' },
  food: { title: 'Food & Restaurants', icon: '🍔', bg: '#F6ECD8' },
  warnings: { title: 'Warnings', icon: '⚠️', bg: '#F6DADA' },
  extra: { title: 'Extra Tips', icon: '✨', bg: '#EFE6F5' },
};
const GUIDE_ORDER = ['budget', 'mustvisit', 'food', 'warnings', 'extra'];

const Accordion = ({ title, icon, bgColor, children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={[styles.accordionContainer, { backgroundColor: bgColor }]}>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpanded((v) => !v)}>
        <Text style={styles.accordionIcon}>{icon}</Text>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
      </TouchableOpacity>
      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

export default function TripDetails() {
  const router = useRouter();
  const { user } = useAuth();
  const { tripId } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const load = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const [tripRes, savedRes, ratingRes, commentsRes] = await Promise.all([
        TripsApi.getById(tripId),
        SavedTripsApi.isSaved(tripId).catch(() => ({ saved: false })),
        RatingsApi.summary(tripId).catch(() => ({ userRating: 0 })),
        CommentsApi.list(tripId).catch(() => ({ items: [] })),
      ]);
      setTrip(tripRes);
      setSaved(!!savedRes?.saved);
      setRating(ratingRes?.userRating || 0);
      setComments(commentsRes?.items || []);
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSave = async () => {
    try {
      if (saved) {
        await SavedTripsApi.unsave(tripId);
        setSaved(false);
      } else {
        await SavedTripsApi.save(Number(tripId));
        setSaved(true);
      }
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to update');
    }
  };

  const rate = async (value) => {
    try {
      await RatingsApi.rate(tripId, value);
      setRating(value);
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to rate');
    }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const c = await CommentsApi.create(tripId, newComment.trim());
      setComments((prev) => [c, ...prev]);
      setNewComment('');
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to post comment');
    }
  };

  const guidesByType = useMemo(() => {
    const map = {};
    (trip?.guides || []).forEach((g) => {
      map[g.type] = g;
    });
    return map;
  }, [trip]);

  if (loading) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator size="large" color="#124559" />
      </View>
    );
  }
  if (!trip) {
    return (
      <View style={[styles.root, styles.centered]}>
        <Text>Trip not found.</Text>
      </View>
    );
  }

  const parts = (trip.location || '').split(',').map((p) => p.trim()).filter(Boolean);
  const region = trip.region || parts[0] || '';
  const country = trip.country || parts[parts.length - 1] || '';
  const banner = trip.coverPhoto || trip.media?.[0]?.mediaUrl;
  const author = trip.user;
  const gallery = (trip.media || []).filter((m) => m.mediaType === 'image');

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TripTale</Text>
        <Icon name="earth" size={25} />
      </View>

      <View style={styles.bannerContainer}>
        {banner ? (
          <Image source={{ uri: banner }} style={styles.bannerImage} />
        ) : (
          <View style={[styles.bannerImage, { backgroundColor: '#335' }]} />
        )}
        <View style={styles.overlayContent}>
          <Text style={styles.camping}>{(trip.category?.name || '').toUpperCase()}</Text>
          <TouchableOpacity
            onPress={() => author?.id && router.push(`/home/profile/${author.id}`)}
          >
            <Text style={styles.postedBy}>
              posted by{'\n'}{author?.fullName || author?.username || 'Traveler'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.detailsCard} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.cardHeader}>
          <Icon name="location-outline" size={22} style={{ marginRight: 6 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.destination}>{trip.title}</Text>
            {!!region && <Text style={styles.location}>{region}</Text>}
            {!!country && <Text style={styles.country}>{country}</Text>}
          </View>
          <TouchableOpacity onPress={toggleSave}>
            <Icon name={saved ? 'bookmark' : 'bookmark-outline'} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity key={n} onPress={() => rate(n)}>
              <Icon
                name={n <= rating ? 'star' : 'star-outline'}
                size={24}
                color="#E2A93A"
              />
            </TouchableOpacity>
          ))}
          <Text style={styles.ratingText}>
            {trip.rating?.average ? Number(trip.rating.average).toFixed(1) : '—'}
            {trip.rating?.count ? `  (${trip.rating.count})` : ''}
          </Text>
        </View>

        {gallery.length > 0 && (
          <>
            <View style={styles.gallery}>
              <Text style={styles.galleryTitle}>Gallery</Text>
            </View>
            <FlatList
              horizontal
              data={gallery}
              keyExtractor={(m) => String(m.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 6, marginBottom: 10 }}
              renderItem={({ item }) => (
                <Image source={{ uri: item.mediaUrl }} style={styles.galleryItem} />
              )}
            />
          </>
        )}

        <Text style={styles.sectionTitle}>About this trip</Text>
        <Text style={styles.aboutText}>{trip.description || 'No description yet.'}</Text>

        {trip.budget != null && (
          <Text style={styles.budgetLine}>Estimated budget: ${Number(trip.budget).toFixed(0)}</Text>
        )}

        <Text style={styles.beforeGo}>Before you Go ! 👇</Text>
        {GUIDE_ORDER.filter((t) => guidesByType[t]).map((t) => {
          const g = guidesByType[t];
          const meta = GUIDE_META[t];
          let locations = [];
          try {
            locations = Array.isArray(g.locations)
              ? g.locations
              : JSON.parse(g.locations || '[]');
          } catch {}
          return (
            <Accordion
              key={t}
              title={g.label || meta.title}
              icon={g.icon || meta.icon}
              bgColor={meta.bg}
            >
              {!!g.text && <Text style={styles.guideText}>{g.text}</Text>}
              {locations.map((loc, i) => (
                <Text key={i} style={styles.guideText}>• {loc}</Text>
              ))}
            </Accordion>
          );
        })}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Comments ({comments.length})
        </Text>
        <View style={styles.commentBox}>
          <TextInput
            style={styles.commentInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            placeholderTextColor="#888"
            multiline
          />
          <TouchableOpacity
            style={[styles.commentButton, !newComment.trim() && { opacity: 0.5 }]}
            onPress={postComment}
            disabled={!newComment.trim()}
          >
            <Icon name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        {comments.map((c) => {
          const avatar = c.user?.profilePicture;
          const when = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '';
          return (
            <View key={c.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.commentAvatar} />
                ) : (
                  <View style={[styles.commentAvatar, styles.commentAvatarFallback]}>
                    <Text style={styles.commentAvatarLetter}>
                      {(c.user?.username || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentAuthor}>
                    {c.user?.fullName || c.user?.username || 'User'}
                  </Text>
                  {!!c.user?.username && (
                    <Text style={styles.commentHandle}>@{c.user.username}{when ? `  ·  ${when}` : ''}</Text>
                  )}
                </View>
              </View>
              <Text style={styles.commentText}>{c.content}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#222' },
  centered: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 6,
    backgroundColor: '#fff',
  },
  headerTitle: { fontWeight: 'bold', fontSize: 26 },
  bannerContainer: { width: '100%', height: 220 },
  bannerImage: { position: 'absolute', width: '100%', height: '100%', opacity: 0.7 },
  overlayContent: {
    paddingTop: 10,
    paddingBottom: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  camping: { color: '#fff', fontWeight: 'bold', fontSize: 22 },
  postedBy: { textAlign: 'center', color: '#fff', fontSize: 16 },
  detailsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    marginTop: -24,
    padding: 16,
    minHeight: 500,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  destination: { fontWeight: '900', fontSize: 26, textAlign: 'center' },
  location: { textAlign: 'center', fontSize: 16 },
  country: { textAlign: 'center', color: '#999', fontSize: 15 },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
  },
  ratingText: { marginLeft: 8, color: '#666' },
  gallery: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  galleryTitle: { fontSize: 18, fontWeight: '600' },
  galleryItem: {
    width: 90,
    height: 90,
    backgroundColor: '#e7e7e7',
    marginRight: 8,
    borderRadius: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  aboutText: { fontSize: 15, color: '#555', lineHeight: 21 },
  budgetLine: { fontSize: 14, color: '#124559', marginTop: 8, fontWeight: '600' },
  beforeGo: { marginTop: 14, fontSize: 18, fontWeight: '600' },
  accordionContainer: {
    borderRadius: 10,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  accordionIcon: { fontSize: 18, marginRight: 6 },
  accordionTitle: { fontWeight: '700', fontSize: 16, flex: 1 },
  accordionContent: { paddingVertical: 5, paddingLeft: 8 },
  guideText: { fontSize: 14, color: '#333', marginBottom: 2 },
  commentBox: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    minHeight: 42,
    maxHeight: 120,
    color: '#000',
  },
  commentButton: {
    backgroundColor: '#124559',
    padding: 12,
    borderRadius: 10,
  },
  commentItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentAuthor: { fontWeight: '700', color: '#124559', fontSize: 14 },
  commentHandle: { color: '#888', fontSize: 11 },
  commentText: { color: '#222', marginTop: 6, lineHeight: 18 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10, backgroundColor: '#eee' },
  commentAvatarFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#124559' },
  commentAvatarLetter: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
