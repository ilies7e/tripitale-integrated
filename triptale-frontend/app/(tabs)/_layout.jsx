// Tab layout for discover, profile, and saved (with create FAB in header)
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

const COLORS = {
  inkBlack: '#01161E',
  beige: '#EFF6E0',
  darkTeal: '#124559',
};

export default function TabLayout() {
  const { user, loading } = useAuth();

  // Hard guard: if the user signs out (or session expires), kick out of (tabs).
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading]);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.beige,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleAlign: 'center',
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                fontFamily: 'serif',
                color: COLORS.inkBlack,
                marginRight: 8,
              }}
            >
              TripTale
            </Text>
            <Ionicons name="earth" size={26} color={COLORS.inkBlack} />
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => router.push('/create/step1')}
          >
            <Ionicons name="add-circle" size={36} color={COLORS.darkTeal} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="savedTrips"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => (
            <Ionicons name="bookmark-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => (
            <Ionicons name="compass-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="myProfile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
