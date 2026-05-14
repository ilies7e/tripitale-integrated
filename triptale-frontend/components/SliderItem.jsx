import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/assets/colors/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import VerifiedBadge from './VerifiedBadge';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';


const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=870&q=80';
const { width, height } = Dimensions.get('window');

export default function SliderItem({ item }) {
  const router = useRouter();
  const imageUri = item.image || FALLBACK_IMG;
  const authorName = item.authorName || 'Traveler';
  const authorPic = item.authorPic;
  const isPremium = item.isPremium;

  return (
    <View style={styles.cardContainer}>
      <Pressable onPress={() => router.push(`/trip/${item.id}`)} style={styles.imgPress}>
        <ImageBackground source={{ uri: imageUri }} style={styles.imgCard} resizeMode="cover">
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
            locations={[0, 0.5, 1]}
            style={styles.overlay}
          />
          <Text style={styles.title} adjustsFontSizeToFit numberOfLines={3}>
            {(item.title || '').toUpperCase()}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={48} color={COLORS.beige} style={styles.locationIcon} />
            <View>
              <Text style={styles.location1}>{item.location1}</Text>
              {!!item.location2 && <Text style={styles.location2}>{item.location2}</Text>}
            </View>
          </View>
        </ImageBackground>
      </Pressable>

      <View style={styles.profileSection}>
        {item.profileId ? (
          <Pressable
            onPress={() => router.push(`/home/profile/${item.profileId}`)}
            style={styles.profileContent}
          >
            {authorPic ? (
              <View style={{ marginRight: 16 }}>
                <VerifiedBadge isVerified={isPremium} size={24} style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 20, elevation: 20 }} />
                <Image source={{ uri: authorPic }} style={styles.profileImg} />
              </View>


            ) : (
              <View style={[styles.profileImg, { alignItems: 'center', justifyContent: 'center' }]}>
                <Ionicons name="person" size={40} color="#ccc" />
              </View>
            )}
            <View style={styles.profileTextCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.profileName}>{authorName}</Text>
                {/* Assuming item.isVerifiedPremium is passed from backend */}

              </View>
              <Text style={styles.profileRole}>professional traveler</Text>
            </View>
          </Pressable>
        ) : (
          <View style={styles.profileContent} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    width,
    height: '100%',
    paddingBottom: 10
  },
  imgPress: {
    width: width * 0.8,
    flex: 1,
    overflow: 'hidden',

  },
  imgCard: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    textAlign: 'center',
    color: COLORS.beige,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginTop: 10,
    letterSpacing: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationIcon: {
    marginRight: 10,
  },
  location1: {
    fontSize: 28,
    color: COLORS.beige,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  location2: {
    fontSize: 16,
    color: COLORS.beige,
    fontFamily: 'serif',
    opacity: 0.9,
    marginTop: 2,
  },
  profileSection: {
    width: width * 0.8,
    marginTop: 20,
    height: 80,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg: {
    borderRadius: 45,
    width: 80,
    height: 80,
    backgroundColor: COLORS.beige,

  },
  profileTextCol: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    color: COLORS.beige,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  profileRole: {
    fontSize: 16,
    color: COLORS.beige,
    fontFamily: 'serif',
    opacity: 0.8,
    marginTop: 2,
  },
});
