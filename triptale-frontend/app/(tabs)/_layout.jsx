import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';

const COLORS = {
  inkBlack: '#01161E',
  darkTeal: '#124559',
  airForceBlue: '#598392',
  ashGrey: '#AEC3B0',
  beige: '#EFF6E0',
};

export default function TabLayout() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading]);

  const horizontalMargin = Math.max(12, width * 0.04);
  const tabBarHeight = 68 + insets.bottom;
  const headerTopPad = Math.max(10, insets.top);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: COLORS.beige,
          height: 56 + headerTopPad,
        },
        headerTitleAlign: 'center',
        headerTitleContainerStyle: {
          paddingTop: insets.top > 0 ? 0 : 8,
        },
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '800',
                fontFamily: 'serif',
                color: COLORS.inkBlack,
                letterSpacing: 0.2,
              }}
            >
              TripTale
            </Text>
            <Ionicons
              name="earth"
              size={22}
              color={COLORS.darkTeal}
              style={{ marginLeft: 8 }}
            />
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/create/step1')}
            style={{
              marginLeft: 16,
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: COLORS.beige,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: COLORS.ashGrey,
              shadowColor: COLORS.inkBlack,
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 4,
            }}
          >
            <Ionicons name="add" size={24} color={COLORS.darkTeal} />
          </TouchableOpacity>
        ),
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.darkTeal,
        tabBarInactiveTintColor: COLORS.airForceBlue,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
        },
        tabBarStyle: {

          left: horizontalMargin,
          right: horizontalMargin,
          bottom: 0,
          height: tabBarHeight,

          backgroundColor: COLORS.beige,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: COLORS.ashGrey,
          shadowColor: COLORS.inkBlack,
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
          paddingTop: 15,


        },
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 4,
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="savedTrips"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused
                  ? 'rgba(18, 69, 89, 0.12)'
                  : 'transparent',
              }}
            >
              <Ionicons
                name={focused ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? COLORS.darkTeal : COLORS.beige,
                marginTop: -8,
                borderWidth: focused ? 0 : 1,
                borderColor: COLORS.ashGrey,
                shadowColor: COLORS.inkBlack,
                shadowOpacity: focused ? 0.16 : 0.06,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: focused ? 6 : 2,
              }}
            >
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={24}
                color={focused ? COLORS.beige : color}
              />
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '800',
            marginTop: 2,
          },
        }}
      />

      <Tabs.Screen
        name="myProfile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused
                  ? 'rgba(18, 69, 89, 0.12)'
                  : 'transparent',
              }}
            >
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}