import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const router = useRouter();
  // const goToDetailss = () => {
  //   router.push('/explore');
  // };
  return (
    // <View>
    //   <Text>s</Text>
    //   <Text onPress={goToDetailss}>ss</Text>
    //   <Text onPress={goToDetailss}>ss</Text>
    // </View>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home s',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ay"
        options={{
          title: 'ay',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}

      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
