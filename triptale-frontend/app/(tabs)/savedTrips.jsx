import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo, useCallback } from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useRouter } from 'expo-router';
import COLORS from '../../assets/colors/colors';
import { SavedTripsApi } from '../../src/api/services';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const fallbackImage = (trip) =>
  trip?.coverPhoto ||
  trip?.media?.[0]?.mediaUrl ||
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop';

const toDateString = (iso) => (iso ? String(iso).split('T')[0] : '');

const mapSaved = (s) => ({
  savedId: s.id,
  tripId: s.tripId,
  title: s.trip?.title || 'Trip',
  location:
    s.trip?.country ||
    s.trip?.region ||
    (s.trip?.location || '').split(',').pop()?.trim() ||
    '',
  image: fallbackImage(s.trip),
  pinned: !!s.pinned,
  visited: !!s.visited,
  date: toDateString(s.visitDate),
  comment: s.comment || '',
});

const FilterPill = ({ label, icon, active, onPress }) => (
  <TouchableOpacity 
    style={[
      styles.filterPill, 
      active ? { backgroundColor: COLORS.airForceBlue, borderColor: COLORS.airForceBlue } : { backgroundColor: COLORS.ashGrey }
    ]}
    onPress={onPress}
  >
    <Text style={[styles.filterText, active && { color: COLORS.beige }]}>{label}</Text>
    <Ionicons name={icon} size={16} color={active ? COLORS.beige : COLORS.inkBlack} style={styles.filterIcon} />
  </TouchableOpacity>
);

const TripCard = ({ item, onToggleVisited, onTogglePinned, onOpenInput, onOpen }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={() => onOpen(item)} style={styles.card}>
    <ImageBackground
      source={{ uri: item.image }}
      style={styles.cardImage}
      imageStyle={styles.cardImageStyle}
    >
      <View style={styles.cardOverlay}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={12} color={COLORS.beige} />
            <Text style={styles.cardLocation}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.visitedBadge} onPress={() => onToggleVisited(item)}>
             <Ionicons name={item.visited ? "checkbox" : "square-outline"} size={20} color={COLORS.beige} />
          </TouchableOpacity>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => onTogglePinned(item)}>
              <Ionicons name={item.pinned ? "attach" : "attach-outline"} size={20} color={COLORS.beige} style={item.pinned ? { transform: [{ rotate: '45deg' }] } : undefined} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onOpenInput(item, 'comment', item.comment)}>
              <Ionicons name={item.comment ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={20} color={COLORS.beige} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onOpenInput(item, 'date', item.date)}>
              <Ionicons name={item.date ? "calendar" : "calendar-outline"} size={20} color={COLORS.beige} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

export default function SavedTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({ date: false, visited: false });

  const [modalVisible, setModalVisible] = useState(false);
  const [inputType, setInputType] = useState('date');
  const [activeTrip, setActiveTrip] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await SavedTripsApi.list();
      setTrips((data?.items || []).map(mapSaved));
    } catch (err) {
      console.warn('load savedTrips failed', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const patchTrip = useCallback(async (tripId, patch) => {
    try {
      const saved = await SavedTripsApi.upsert(tripId, patch);
      setTrips((prev) => prev.map((t) => (t.tripId === tripId ? mapSaved(saved) : t)));
    } catch (err) {
      console.warn('patch savedTrip failed', err?.message);
    }
  }, []);

  const openTrip = (trip) => router.push(`/trip/${trip.tripId}`);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleVisited = (trip) => patchTrip(trip.tripId, { visited: !trip.visited });
  const togglePinned = (trip) => patchTrip(trip.tripId, { pinned: !trip.pinned });

  const openInputModal = (trip, type, currentValue) => {
    setActiveTrip(trip);
    if (type === 'date' && Platform.OS !== 'web') {
      const parsedDate = currentValue ? new Date(currentValue) : new Date();
      setDatePickerDate(parsedDate);
      setShowDatePicker(true);
    } else {
      setInputType(type);
      setInputValue(currentValue || '');
      setModalVisible(true);
    }
  };

  const saveInput = async () => {
    if (!activeTrip) return setModalVisible(false);
    if (inputType === 'date') {
      const iso = inputValue ? new Date(inputValue).toISOString() : null;
      await patchTrip(activeTrip.tripId, { visitDate: iso });
    } else {
      await patchTrip(activeTrip.tripId, { comment: inputValue });
    }
    setModalVisible(false);
  };

  const onDateChange = async (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate && activeTrip) {
      await patchTrip(activeTrip.tripId, { visitDate: selectedDate.toISOString() });
    }
  };

  const { pinnedTrips, unpinnedTrips } = useMemo(() => {
    const result = trips.filter((t) => {
      if (filters.date && !t.date) return false;
      if (filters.visited && !t.visited) return false;
      return true;
    });
    return {
      pinnedTrips: result.filter((t) => t.pinned),
      unpinnedTrips: result.filter((t) => !t.pinned),
    };
  }, [trips, filters]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>SAVES</Text>
            <Ionicons name="bookmark" size={24} color={COLORS.inkBlack} style={styles.headerIcon} />
          </View>
          <View style={styles.headerLine} />
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by</Text>
          <View style={styles.filterContainer}>
            <FilterPill label="Date" icon="calendar" active={filters.date} onPress={() => toggleFilter('date')} />
            <FilterPill label="Visited" icon="checkmark-done" active={filters.visited} onPress={() => toggleFilter('visited')} />
          </View>
        </View>
        
        <View style={styles.divider} />

        {loading ? (
          <View style={{ paddingVertical: 60 }}>
            <ActivityIndicator size="large" color={COLORS.darkTeal} />
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { textAlign: 'center', marginTop: 40 }]}>
              No saved trips yet. Tap the bookmark on any trip to save it.
            </Text>
          </View>
        ) : (
          <>
            {pinnedTrips.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Pinned</Text>
                <View style={styles.gridContainer}>
                  {pinnedTrips.map((item) => (
                    <TripCard
                      key={item.savedId}
                      item={item}
                      onToggleVisited={toggleVisited}
                      onTogglePinned={togglePinned}
                      onOpenInput={openInputModal}
                      onOpen={openTrip}
                    />
                  ))}
                </View>
                <View style={styles.divider} />
              </View>
            )}

            <View style={styles.sectionContainer}>
              <View style={styles.gridContainer}>
                {unpinnedTrips.map((item) => (
                  <TripCard
                    key={item.savedId}
                    item={item}
                    onToggleVisited={toggleVisited}
                    onTogglePinned={togglePinned}
                    onOpenInput={openInputModal}
                    onOpen={openTrip}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={datePickerDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {inputType === 'date' ? 'Add Trip Date' : 'Add Trip Comment'}
            </Text>
            {inputType === 'date' && Platform.OS === 'web' ? (
              <input
                type="date"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  border: `1px solid ${COLORS.ashGrey}`,
                  padding: 10,
                  minHeight: 40,
                  color: COLORS.inkBlack,
                  marginBottom: 20,
                  width: '100%',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  fontSize: 14,
                }}
              />
            ) : (
              <TextInput
                style={styles.modalInput}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={inputType === 'date' ? 'YYYY-MM-DD' : 'Write a comment...'}
                placeholderTextColor={COLORS.ashGrey}
                multiline={inputType === 'comment'}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonSave} onPress={saveInput}>
                <Text style={styles.modalButtonTextSave}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: COLORS.inkBlack,
    letterSpacing: 2,
  },
  headerIcon: {
    marginLeft: 10,
  },
  headerLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.inkBlack,
    opacity: 0.2,
    marginBottom: 10,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterLabel: {
    fontSize: 12,
    color: COLORS.inkBlack,
    opacity: 0.6,
    marginBottom: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  filterText: {
    fontSize: 14,
    color: COLORS.inkBlack,
    fontWeight: '500',
  },
  filterIcon: {
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.inkBlack,
    opacity: 0.2,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: COLORS.inkBlack,
    opacity: 0.6,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    flex: 1,
  },
  cardImageStyle: {
    borderRadius: 15,
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: COLORS.beige,
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLocation: {
    color: COLORS.beige,
    fontSize: 12,
    marginLeft: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 4,
  },
  visitedBadge: {
    // Styling for the checkbox area
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: COLORS.beige,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.inkBlack,
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.ashGrey,
    padding: 10,
    minHeight: 40,
    maxHeight: 100,
    color: COLORS.inkBlack,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButtonCancel: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.ashGrey,
  },
  modalButtonSave: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.darkTeal,
  },
  modalButtonTextCancel: {
    color: COLORS.inkBlack,
    fontWeight: 'bold',
  },
  modalButtonTextSave: {
    color: COLORS.beige,
    fontWeight: 'bold',
  },
});