// Preview + submit the trip
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GuidesApi, MediaApi, TripsApi } from '../../src/api/services';
import { getTripDraft, resetTripDraft } from '../../src/store/tripDraft';

const { width } = Dimensions.get('window');

export default function PreviewTrip() {
  const router = useRouter();
  const [draft, setDraft] = useState(getTripDraft());
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState('');

  useEffect(() => {
    setDraft(getTripDraft());
  }, []);

  const submit = async () => {
    if (!draft.categoryId) {
      Alert.alert('Missing', 'Please pick a category.');
      return;
    }
    if (!draft.title) {
      Alert.alert('Missing', 'Please add a title.');
      return;
    }
    setSubmitting(true);
    try {
      setStep('Creating trip…');
      const trip = await TripsApi.create({
        title: draft.title,
        description: draft.description || undefined,
        location: draft.location || undefined,
        region: draft.region || undefined,
        country: draft.country || undefined,
        budget: draft.budget != null ? draft.budget : undefined,
        categoryId: draft.categoryId,
      });

      let coverUrl = null;
      if (draft.coverPhoto && !/^https?:\/\//.test(draft.coverPhoto)) {
        setStep('Uploading cover photo…');
        const uploaded = await MediaApi.upload(trip.id, [draft.coverPhoto], 'cover');
        coverUrl = uploaded?.[0]?.mediaUrl;
      } else if (draft.coverPhoto) {
        coverUrl = draft.coverPhoto;
      }

      if (Array.isArray(draft.gallery) && draft.gallery.length) {
        setStep(`Uploading ${draft.gallery.length} photo(s)…`);
        const uris = draft.gallery.map((g) => g.uri).filter(Boolean);
        if (uris.length) await MediaApi.upload(trip.id, uris);
      }

      if (Array.isArray(draft.guides) && draft.guides.length) {
        setStep('Saving guides…');
        const guidesPayload = draft.guides.map((g) => ({
          type: g.type || g.id,
          label: g.label,
          icon: g.icon,
          text: g.text || '',
          locations: g.locations || [],
        }));
        await GuidesApi.replaceAll(trip.id, guidesPayload);
      }

      if (coverUrl) {
        setStep('Finalizing…');
        await TripsApi.update(trip.id, { coverPhoto: coverUrl });
      }

      resetTripDraft();
      Alert.alert('Published!', 'Your trip is now live.', [
        {
          text: 'View',
          onPress: () => router.replace(`/trip/${trip.id}`),
        },
      ]);
    } catch (err) {
      Alert.alert('Publish failed', err?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
      setStep('');
    }
  };

  const guideSummary = useMemo(
    () => (draft.guides || []).map((g) => `${g.icon || ''} ${g.label}`).join(' · '),
    [draft.guides],
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#EFF6E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview</Text>
        <View style={{ width: 26 }} />
      </View>

      {draft.coverPhoto ? (
        <Image source={{ uri: draft.coverPhoto }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Feather name="image" size={60} color="#EFF6E0" />
        </View>
      )}

      <View style={styles.body}>
        {!!draft.categoryTitle && (
          <Text style={styles.category}>{draft.categoryTitle.toUpperCase()}</Text>
        )}
        <Text style={styles.title}>{draft.title || '(no title)'}</Text>
        {!!draft.location && <Text style={styles.location}>📍 {draft.location}</Text>}
        {draft.budget != null && (
          <Text style={styles.budget}>Budget: ${Number(draft.budget).toFixed(0)}</Text>
        )}
        {!!draft.description && (
          <>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{draft.description}</Text>
          </>
        )}
        {!!draft.gallery?.length && (
          <>
            <Text style={styles.sectionTitle}>Gallery ({draft.gallery.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {draft.gallery.map((p) => (
                <Image key={p.id || p.uri} source={{ uri: p.uri }} style={styles.galleryImg} />
              ))}
            </ScrollView>
          </>
        )}
        {!!draft.guides?.length && (
          <>
            <Text style={styles.sectionTitle}>Guides</Text>
            <Text style={styles.guidesLine}>{guideSummary}</Text>
          </>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.goBackButton, submitting && { opacity: 0.5 }]}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Text style={styles.goBackText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.publishButton, submitting && { opacity: 0.7 }]}
          onPress={submit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.publishText}>PUBLISH</Text>
          )}
        </TouchableOpacity>
      </View>
      {!!step && <Text style={styles.stepText}>{step}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#01161E' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: { color: '#EFF6E0', fontSize: 20, fontWeight: 'bold' },
  cover: {
    width,
    height: 220,
    resizeMode: 'cover',
    backgroundColor: '#124559',
  },
  coverPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  category: { color: '#AEC3B0', fontSize: 13, letterSpacing: 1, marginBottom: 4 },
  title: {
    color: '#EFF6E0',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 6,
  },
  location: { color: '#AEC3B0', fontSize: 15, marginBottom: 6 },
  budget: { color: '#AEC3B0', fontSize: 14, marginBottom: 10 },
  sectionTitle: {
    color: '#EFF6E0',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  description: { color: '#EFF6E0', fontSize: 15, lineHeight: 22 },
  galleryImg: {
    width: 90,
    height: 90,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: '#124559',
  },
  guidesLine: { color: '#AEC3B0', fontSize: 14 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 10,
  },
  goBackButton: {
    flex: 1,
    backgroundColor: '#124559',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  goBackText: { color: '#EFF6E0', fontWeight: 'bold' },
  publishButton: {
    flex: 2,
    backgroundColor: '#60868f',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  publishText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1.5 },
  stepText: { color: '#AEC3B0', textAlign: 'center', marginTop: 12 },
});
