// Edit current user profile
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { UsersApi } from '../../../src/api/services';
import { useAuth } from '../../../src/context/AuthContext';

const COLORS = {
  inkBlack: '#01161E',
  darkTeal: '#124559',
  airForceBlue: '#598392',
  ashGrey: '#AEC3B0',
  beige: '#EFF6E0',
};

export default function EditProfile() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setProfilePicture(user.profilePicture || '');
    }
  }, [user]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setProfilePicture(res.assets[0].uri);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await UsersApi.updateMe({
        fullName: fullName.trim() || undefined,
        username: username.trim() || undefined,
        bio: bio.trim(),
        profilePicture: profilePicture || undefined,
      });
      await refreshUser();
      Alert.alert('Saved', 'Profile updated successfully');
      router.back();
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.inkBlack} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 28 }} />
        </View>

        <TouchableOpacity style={styles.avatarWrap} onPress={pickImage}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={50} color={COLORS.beige} />
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={16} color={COLORS.beige} />
          </View>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="John Doe"
            placeholderTextColor={COLORS.ashGrey}
          />
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="johndoe"
            autoCapitalize="none"
            placeholderTextColor={COLORS.ashGrey}
          />
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell travelers about yourself"
            placeholderTextColor={COLORS.ashGrey}
            multiline
          />

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={save}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.beige} />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.beige },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.inkBlack },
  avatarWrap: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  avatarFallback: {
    backgroundColor: COLORS.inkBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.darkTeal,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.beige,
  },
  form: { paddingHorizontal: 20 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkTeal,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.ashGrey,
    padding: 12,
    fontSize: 15,
    color: COLORS.inkBlack,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: COLORS.darkTeal,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: { color: COLORS.beige, fontSize: 16, fontWeight: '700' },
});
