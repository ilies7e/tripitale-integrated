import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { getTripDraft, setTripDraft } from '../../src/store/tripDraft';

export default function Step3() {
  const router = useRouter();
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const d = getTripDraft();
    if (d.coverPhoto) setCoverPhoto(d.coverPhoto);
    if (Array.isArray(d.gallery) && d.gallery.length) {
      setGallery(d.gallery.map((g, i) => (g.id ? g : { id: String(i), ...g })));
    }
  }, []);

  const requestPerm = async () => {
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!p.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return false;
    }
    return true;
  };

  const handleAddCover = async () => {
    if (!(await requestPerm())) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [16, 9],
    });
    if (!res.canceled && res.assets?.[0]?.uri) setCoverPhoto(res.assets[0].uri);
  };

  const handleRemoveCover = () => setCoverPhoto(null);

  const handleAddGalleryPhoto = async () => {
    if (!(await requestPerm())) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });
    if (!res.canceled && res.assets?.length) {
      const newItems = res.assets.map((a) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        uri: a.uri,
      }));
      setGallery((prev) => [...prev, ...newItems]);
    }
  };

  const handleRemoveGalleryPhoto = (id) => {
    setGallery(gallery.filter((item) => item.id !== id));
  };

  const onNext = () => {
    setTripDraft({ coverPhoto, gallery });
    router.push('/create/finalStep');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <Text style={styles.headerTitle}>
          Show your{'\n'}gallery Trip 📷
        </Text>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Cover Photo Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cover photo</Text>
            {coverPhoto && (
              <TouchableOpacity onPress={handleRemoveCover} style={styles.removeCoverBtn}>
                 <Ionicons name="close-circle-outline" size={22} color="#e63946" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.coverPhotoBox} 
            onPress={handleAddCover}
            activeOpacity={0.8}
          >
            {coverPhoto ? (
              <Image source={{ uri: coverPhoto }} style={styles.coverImage} />
            ) : (
              <View style={styles.coverPlaceholderIcon}>
                 <MaterialIcons name="image" size={70} color="#a1b3a1" />
                 <View style={styles.plusOverlay}>
                   <Feather name="plus" size={28} color="#a1b3a1" />
                 </View>
              </View>
            )}
          </TouchableOpacity>

          {/* Trip Gallery Section */}
          <View style={[styles.sectionHeader, { marginTop: 30 }]}>
            <Text style={styles.sectionTitle}>Trip gallery</Text>
            <TouchableOpacity onPress={handleAddGalleryPhoto} style={styles.addGalleryBtn}>
              <Feather name="plus" size={16} color="#4a5d4e" />
            </TouchableOpacity>
          </View>

          <View style={styles.galleryBox}>
            <View style={styles.galleryGrid}>
              {gallery.map((photo) => (
                <View key={photo.id} style={styles.galleryItemContainer}>
                  <Image source={{ uri: photo.uri }} style={styles.galleryImage} />
                  <TouchableOpacity 
                    style={styles.removeGalleryBtn} 
                    onPress={() => handleRemoveGalleryPhoto(photo.id)}
                  >
                    <Feather name="x" size={10} color="#333" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
             <Text style={styles.goBackText}>GO BACK</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
             <Text style={styles.nextText}>NEXT</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#edf2e6', // App background matching screenshot
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    backgroundColor: '#edf2e6',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#132a21', // Dark blue-green text
    marginBottom: 26,
    lineHeight: 40,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'serif',
    color: '#384d41', // Darker green font
    letterSpacing: 0.5,
  },
  removeCoverBtn: {
    padding: 2,
    backgroundColor: '#e6ede0',
    borderRadius: 12,
  },
  coverPhotoBox: {
    height: 160,
    backgroundColor: '#cfdcca', // Pale greenish grey
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bacbb5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholderIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusOverlay: {
    position: 'absolute',
    bottom: -8,
    right: -14,
    backgroundColor: '#cfdcca', 
    borderRadius: 14,
    padding: 2,
  },
  addGalleryBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#bacbb5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3ebd9',
  },
  galleryBox: {
    minHeight: 220,
    backgroundColor: '#cfdcca',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bacbb5',
    padding: 12,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  galleryItemContainer: {
    width: ((100 / 3) * 0.8) + '%', // roughly 60px depending on screen
    aspectRatio: 1,
    minWidth: 60,
    maxWidth: 80,
    marginRight: 12,
    marginBottom: 12,
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#e3ebd9',
    borderWidth: 1,
    borderColor: '#bacbb5',
  },
  removeGalleryBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#e7efe1', 
    borderWidth: 1,
    borderColor: '#bacbb5',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackText: {
    color: '#3c5246',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 15,
  },
  nextButton: {
    backgroundColor: '#60868f', 
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    fontSize: 15,
  },
});
