import { useRouter } from 'expo-router';
import React from 'react';
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

  return (
    <View style={styles.cardContainer}>
      <Pressable onPress={() => router.push(`/trip/${item.id}`)} style={styles.imgPress}>
        <ImageBackground source={{ uri: imageUri }} style={styles.imgCard} resizeMode="cover">
          <View style={styles.overlay} />
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.locations}>
            {!!item.location1 && (
              <Text style={styles.location1}>{item.location1}</Text>
            )}
            {!!item.location2 && (
              <Text style={styles.location2}>{item.location2}</Text>
            )}
          </View>
        </ImageBackground>
      </Pressable>

      {item.profileId ? (
        <Pressable
          onPress={() => router.push(`/home/profile/${item.profileId}`)}
          style={styles.profileContent}
        >
          {authorPic ? (
            <Image source={{ uri: authorPic }} style={styles.profileImg} />
          ) : (
            <View style={styles.profileImg} />
          )}
          <Text style={styles.profileName}>{authorName}</Text>
        </Pressable>
      ) : (
        <View style={styles.profileContent} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width,
    height: height * 0.8,
  },
  imgPress: {
    width: width * 0.85,
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imgCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  locations: {
    alignItems: 'center',
  },
  location1: { fontSize: 26, color: 'white', fontWeight: '600' },
  location2: { fontSize: 18, color: 'white', opacity: 0.9 },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '12%',
    width: '85%',
  },
  profileImg: {
    borderRadius: 40,
    width: 60,
    height: 60,
    backgroundColor: '#aaa',
    marginRight: 12,
  },
  profileName: { fontSize: 20, color: 'white', fontWeight: '600' },
});
