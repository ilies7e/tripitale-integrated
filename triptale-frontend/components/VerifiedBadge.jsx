import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function VerifiedBadge({ isVerified, size = 16, style }) {
  if (!isVerified) return null;

  return (
    <View style={[styles.badgeContainer, style]}>
      <Ionicons name="checkmark-circle" size={size} color="#C9A84C" />
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
