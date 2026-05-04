import SliderItem from '@/components/SliderItem';
import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Slider({ trips = [], loading = false }) {
  if (loading) {
    return (
      <View style={[styles.listContainer, styles.centered]}>
        <ActivityIndicator size="large" color="#EFF6E0" />
      </View>
    );
  }
  if (!trips.length) {
    return (
      <View style={[styles.listContainer, styles.centered]}>
        <Text style={styles.emptyText}>No trips in this category yet.</Text>
      </View>
    );
  }
  return (
    <View style={styles.listContainer}>
      <FlatList
        style={styles.list}
        horizontal
        snapToAlignment="center"
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        data={trips}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <SliderItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width,
    height: height * 0.8,
  },
  list: {},
  listContent: {},
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#EFF6E0',
    fontSize: 16,
    textAlign: 'center',
    padding: 24,
  },
});
