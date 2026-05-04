// Step 2 — title, location, description
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getTripDraft, setTripDraft } from '../../src/store/tripDraft';

export default function TripCreationStep2() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    const d = getTripDraft();
    setTitle(d.title || '');
    setRegion(d.region || '');
    setCountry(d.country || '');
    setDescription(d.description || '');
    setBudget(d.budget != null ? String(d.budget) : '');
  }, []);

  const onNext = () => {
    if (!title.trim()) {
      Alert.alert('Missing', 'Please add a title.');
      return;
    }
    const budgetNum = budget ? Number(budget) : null;
    setTripDraft({
      title: title.trim(),
      region: region.trim(),
      country: country.trim(),
      location: [region.trim(), country.trim()].filter(Boolean).join(', '),
      description: description.trim(),
      budget: Number.isFinite(budgetNum) ? budgetNum : null,
    });
    router.push('/create/step3');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.header}>
          Tell us about{'\n'}this Trip <Text style={styles.emoji}>😊</Text>
        </Text>

        <Text style={styles.label}>Title :</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Magic forest"
          placeholderTextColor="#a8a8a8"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Region / City :</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Baffin Mountains"
          placeholderTextColor="#a8a8a8"
          value={region}
          onChangeText={setRegion}
        />

        <Text style={styles.label}>Country :</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Canada"
          placeholderTextColor="#a8a8a8"
          value={country}
          onChangeText={setCountry}
        />

        <Text style={styles.label}>Budget (USD) :</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: 500"
          placeholderTextColor="#a8a8a8"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />

        <Text style={styles.label}>Describe it :</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Description..."
          placeholderTextColor="#a8a8a8"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
            <Text style={styles.goBackText}>GO BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#222' },
  container: { flex: 1, backgroundColor: '#ebf5e6', padding: 16 },
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 34,
    marginBottom: 12,
    marginTop: 40,
    fontFamily: 'serif',
    color: '#212a18',
  },
  emoji: { fontSize: 30 },
  label: { marginTop: 8, fontSize: 18, color: '#27311a', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#b6c5ab',
    borderRadius: 6,
    backgroundColor: '#eaf6ed',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 4,
    color: '#383838',
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#b6c5ab',
    borderRadius: 6,
    backgroundColor: '#eaf6ed',
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 90,
    color: '#383838',
    marginTop: 4,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  goBackButton: {
    backgroundColor: '#f2f2e2',
    borderWidth: 1,
    borderColor: '#abb7ac',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  goBackText: { color: '#383838', fontWeight: 'bold' },
  nextButton: {
    backgroundColor: '#9ab3a5',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  nextText: { color: '#fff', fontWeight: 'bold' },
});
