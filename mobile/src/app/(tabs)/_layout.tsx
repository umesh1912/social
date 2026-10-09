import { Tabs } from 'expo-router';
import React from 'react';
import { TabBar, TopBar } from '../../components/chrome';
import type { Tab } from '../../store';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: () => <TopBar tab={route.name as Tab} />,
        sceneStyle: { backgroundColor: '#fff' },
        animation: 'none',
      })}
      tabBar={({ state, navigation }) => (
        <TabBar active={state.routes[state.index].name as Tab} onPress={t => navigation.navigate(t)} />
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="chats" />
      <Tabs.Screen name="nearby" />
      <Tabs.Screen name="groups" />
      <Tabs.Screen name="jobs" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
