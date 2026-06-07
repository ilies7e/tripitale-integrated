import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { ImageBackground } from 'expo-image';

const COLORS = {
  inkBlack: '#01161E',
  darkTeal: '#124559',
  airForceBlue: '#598392',
  ashGrey: '#AEC3B0',
  beige: '#EFF6E0',
  gold: '#C9A84C',
  goldLight: '#F0D080',
  goldDark: '#8B6914',
};

const FEATURES = [
  {
    icon: 'star',
    title: 'Verified Premium Badge',
    description: 'Stand out with a golden badge on your profile and posts, showing you are a trusted creator.',
    color: '#C9A84C',
  },
  {
    icon: 'analytics-outline',
    title: 'Advanced Trip Analytics',
    description: 'Track your impact. See views, saves, and engagement rate for all your adventures.',
    color: '#598392',
  },
  {
    icon: 'images-outline',
    icon: 'shield-checkmark-outline',
    title: 'Ad-Free Experience',
    description:
      'Browse and create completely without ads, for a clean, distraction-free experience.',
    color: '#AEC3B0',
  },
];

function FeatureCard({ icon, title, description, color, index }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.featureCard, { transform: [{ scale }] }]}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={[styles.featureIconWrap, { backgroundColor: color + '22' }]}>
          <Ionicons name={icon} size={26} color={color} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function PremiumScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Hero banner */}
      {/* Hero banner with Image */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' }}
        style={styles.heroImage}
      >
        <View style={styles.darkOverlay}>
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={COLORS.beige} />
          </TouchableOpacity>

          <View style={styles.crownWrap}>
            <Ionicons name="star" size={38} color={COLORS.gold} />
          </View>
          <Text style={styles.heroTitle}>TripTale Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlock the full traveller experience and grow your audience faster.
          </Text>

          {/* Pricing pill */}
          <View style={styles.pricingPill}>
            <Text style={styles.pricingAmount}>£4.99</Text>
            <Text style={styles.pricingPer}> / month</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Features list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>WHAT YOU GET</Text>
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} {...f} index={i} />
        ))}
        {/* Bottom breathing room for the fixed footer */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.returnBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={18} color={COLORS.darkTeal} />
          <Text style={styles.returnBtnText}>Go Back</Text>
        </TouchableOpacity>

        <LinearGradient
          colors={[COLORS.gold, COLORS.goldLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.upgradeGradient}
        >
          <TouchableOpacity
            style={styles.upgradeBtn}
            activeOpacity={0.85}
            onPress={() => {/* TODO: handle upgrade */ }}
          >
            <Ionicons name="star" size={16} color={COLORS.inkBlack} />
            <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },

  /* ── Hero ── */
  heroImage: {
    width: '100%',
    height: 320,
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingTop: 54,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 54,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  crownWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(201,168,76,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gold + '55',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'serif',
    color: COLORS.beige,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.ashGrey,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  pricingPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(201,168,76,0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.gold + '66',
  },
  pricingAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.goldLight,
  },
  pricingPer: {
    fontSize: 14,
    color: COLORS.ashGrey,
  },

  /* ── Scroll ── */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.airForceBlue,
    marginBottom: 14,
    paddingLeft: 4,
  },

  /* ── Feature card ── */
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.inkBlack,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    color: COLORS.airForceBlue,
    lineHeight: 19,
  },

  /* ── Footer ── */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.beige,
    borderTopWidth: 1,
    borderTopColor: COLORS.ashGrey + '66',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: COLORS.airForceBlue,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 18,
  },
  returnBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkTeal,
  },
  upgradeGradient: {
    flex: 1,
    borderRadius: 14,
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  upgradeBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.inkBlack,
  },
});
