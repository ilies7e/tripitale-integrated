import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getTripDraft, setTripDraft } from '../../src/store/tripDraft';

const GUIDE_TYPES = [
    { id: 'budget', label: 'Budget info', icon: '💰' },
    { id: 'mustvisit', label: 'Must-visit', icon: '🧭' },
    { id: 'food', label: 'Food & Restaurants', icon: '🍔' },
    { id: 'warnings', label: 'Warnings', icon: '⚠️' },
    { id: 'extra', label: 'Extra info', icon: '➕' },
];

export default function FinalTripStep() {
    const router = useRouter();
    const [panelOpen, setPanelOpen] = useState(false);
    const [guides, setGuides] = useState([]);
    const [locationInput, setLocationInput] = useState({ guideId: null, value: '' });

    useEffect(() => {
        const d = getTripDraft();
        if (Array.isArray(d.guides) && d.guides.length) {
            setGuides(
                d.guides.map((g) => ({
                    id: g.id || g.type,
                    type: g.type || g.id,
                    label: g.label || GUIDE_TYPES.find((t) => t.id === g.id)?.label,
                    icon: g.icon || GUIDE_TYPES.find((t) => t.id === g.id)?.icon,
                    text: g.text || '',
                    locations: g.locations || [],
                })),
            );
        }
    }, []);

    const addGuide = (type) => {
        if (guides.find(g => g.id === type.id)) return;
        setGuides(prev => [
            ...prev,
            {
                id: type.id,
                label: type.label,
                icon: type.icon,
                text: '',
                locations: [],
            },
        ]);
        setPanelOpen(false);
    };

    const removeGuide = (id) => {
        setGuides(prev => prev.filter(g => g.id !== id));
    };

    const updateText = (id, value) => {
        setGuides(prev =>
            prev.map(g => (g.id === id ? { ...g, text: value } : g))
        );
    };

    const openLocationInput = (id) => {
        setLocationInput({ guideId: id, value: '' });
    };
    const submitLocation = () => {
        const { guideId, value } = locationInput;
        const name = (value || '').trim();
        if (!guideId || !name) {
            setLocationInput({ guideId: null, value: '' });
            return;
        }
        setGuides((prev) =>
            prev.map((g) =>
                g.id === guideId
                    ? { ...g, locations: [...g.locations, name] }
                    : g,
            ),
        );
        setLocationInput({ guideId: null, value: '' });
    };

    const removeLocation = (guideId, locationIndex) => {
        setGuides(prev =>
            prev.map(g =>
                g.id === guideId
                    ? { ...g, locations: g.locations.filter((_, idx) => idx !== locationIndex) }
                    : g
            )
        );
    };

    return (
        <KeyboardAvoidingView 
            style={styles.root} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>
                    Help your fellow{'\n'}travelers <Text>🤝</Text>
                </Text>

                {/* If there are no guides, show the large centered add button */}
                {guides.length === 0 && (
                    <View style={styles.addGuideCentered}>
                        <Text style={styles.addGuideText}>Add a guide</Text>
                        <TouchableOpacity style={styles.plusButtonLarge} onPress={() => setPanelOpen(true)}>
                            <Text style={styles.plusTextLarge}>＋</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Guides list */}
                {guides.map((g) => (
                    <View key={g.id} style={styles.guideCard}>
                        <View style={styles.guideCardHeader}>
                            <Text style={styles.guideHeader}>{g.icon} {g.label}</Text>
                            <TouchableOpacity onPress={() => removeGuide(g.id)} style={styles.removeGuideBtn}>
                                <Feather name="x" size={16} color="#4b5e40" />
                            </TouchableOpacity>
                        </View>

                        {(g.id === 'mustvisit' || g.id === 'food') && (
                            <View style={styles.locationsRow}>
                                {g.locations.map((loc, idx) => (
                                    <View key={idx} style={styles.locationChip}>
                                        <Text style={styles.locationText}>{loc}</Text>
                                        <TouchableOpacity 
                                            onPress={() => removeLocation(g.id, idx)}
                                            style={styles.removeLocationBtn}
                                        >
                                            <Feather name="x" size={12} color="#1f2a16" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {locationInput.guideId === g.id ? (
                                    <View style={styles.inlineInputRow}>
                                        <TextInput
                                            autoFocus
                                            placeholder="Place name"
                                            placeholderTextColor="#8a9e80"
                                            style={styles.inlineInput}
                                            value={locationInput.value}
                                            onChangeText={(v) => setLocationInput({ guideId: g.id, value: v })}
                                            onSubmitEditing={submitLocation}
                                        />
                                        <TouchableOpacity style={styles.inlineInputOk} onPress={submitLocation}>
                                            <Feather name="check" size={14} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.locationAdd}
                                        onPress={() => openLocationInput(g.id)}
                                    >
                                        <Text style={styles.locationAddText}>＋ Add location</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Write something..."
                            placeholderTextColor="#8a9e80"
                            multiline
                            value={g.text}
                            onChangeText={(t) => updateText(g.id, t)}
                        />
                    </View>
                ))}

                {/* Add guide subtly underneath if guides exist */}
                {guides.length > 0 && guides.length < GUIDE_TYPES.length && (
                    <TouchableOpacity style={styles.addGuideSmallRow} onPress={() => setPanelOpen(true)}>
                        <View style={styles.plusButtonSmall}>
                            <Text style={styles.plusTextSmall}>＋</Text>
                        </View>
                        <Text style={styles.addGuideSmallText}>Add another guide</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Buttons pinned to bottom outside ScrollView */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
                    <Text style={styles.goBackText}>GO BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {
                        const normalized = guides.map((g) => ({
                            id: g.id,
                            type: g.id,
                            label: g.label,
                            icon: g.icon,
                            text: g.text || '',
                            locations: g.locations || [],
                        }));
                        setTripDraft({ guides: normalized });
                        router.push('/create/preview');
                    }}
                >
                    <Text style={styles.nextText}>PREVIEW</Text>
                </TouchableOpacity>
            </View>

            {/* Panel modal */}
            <Modal transparent visible={panelOpen} animationType="fade">
                <Pressable style={styles.overlay} onPress={() => setPanelOpen(false)}>
                    <View style={styles.panel}>
                        <Text style={styles.panelTitle}>Choose a guide</Text>
                        {GUIDE_TYPES.map((g) => {
                            const isAdded = guides.some(active => active.id === g.id);
                            if (isAdded) return null; // Don't show already added guides

                            return (
                                <TouchableOpacity
                                    key={g.id}
                                    style={styles.panelItem}
                                    onPress={() => addGuide(g)}
                                >
                                    <Text style={styles.panelItemText}>
                                        {g.icon} {g.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Pressable>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#edf2e6', // matching previous steps dynamically aligned
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 20,
        flexGrow: 1,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#132a21', // Dark blue-green matching other steps
        marginBottom: 20,
        fontFamily: 'serif',
        lineHeight: 40,
    },
    addGuideCentered: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
        flex: 1,
    },
    addGuideText: {
        color: '#384d41',
        marginBottom: 12,
        fontSize: 16,
        fontWeight: '600',
    },
    plusButtonLarge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#dbe7d3',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#aab7a3',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    plusTextLarge: { fontSize: 26, fontWeight: 'bold', color: '#2a3a1f' },

    addGuideSmallRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: '#dbe7d3',
        borderWidth: 1,
        borderColor: '#bacbb5',
    },
    plusButtonSmall: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#edf2e6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#aab7a3',
        marginRight: 8,
    },
    plusTextSmall: { fontSize: 14, fontWeight: 'bold', color: '#2a3a1f', lineHeight: 16 },
    addGuideSmallText: {
        color: '#384d41',
        fontSize: 14,
        fontWeight: '600',
    },

    guideCard: {
        backgroundColor: '#cfdcca',
        borderWidth: 1,
        borderColor: '#bacbb5',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    guideCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    guideHeader: {
        fontWeight: '600',
        fontFamily: 'serif',
        fontSize: 18,
        color: '#2a3a1f',
    },
    removeGuideBtn: {
        padding: 6,
        backgroundColor: '#bacbb5',
        borderRadius: 16,
    },
    input: {
        backgroundColor: '#e6ede0',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#bacbb5',
        minHeight: 80,
        color: '#1f2a16',
        fontSize: 15,
        textAlignVertical: 'top',
    },
    locationsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    locationChip: {
        backgroundColor: '#e6ede0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bacbb5',
    },
    locationText: { color: '#1f2a16', fontSize: 13, marginRight: 6, fontWeight: '500' },
    removeLocationBtn: {
        marginLeft: 2,
        padding: 2,
        backgroundColor: '#d6dfd0',
        borderRadius: 10,
    },

    locationAdd: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#8d9f87',
        backgroundColor: '#e3ebd9',
        borderStyle: 'dashed',
    },
    locationAddText: { fontSize: 13, color: '#384d41', fontWeight: '500' },
    inlineInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6ede0',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#bacbb5',
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    inlineInput: { minWidth: 120, maxWidth: 180, color: '#1f2a16', fontSize: 13, paddingVertical: 4 },
    inlineInputOk: {
        backgroundColor: '#60868f',
        borderRadius: 10,
        padding: 4,
        marginLeft: 6,
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#edf2e6',
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
    goBackText: { color: '#3c5246', fontWeight: 'bold', letterSpacing: 1, fontSize: 15 },
    nextButton: {
        backgroundColor: '#60868f',
        borderRadius: 6,
        paddingVertical: 14,
        paddingHorizontal: 20,
        minWidth: 110,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1.5, fontSize: 15 },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panel: {
        width: 250,
        backgroundColor: '#6e7f6a',
        borderRadius: 12,
        padding: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    panelTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 12,
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'serif',
    },
    panelItem: {
        backgroundColor: '#f0f6ea',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    panelItemText: {
        color: '#2a3a1f',
        fontWeight: '600',
        fontSize: 15,
    },
});