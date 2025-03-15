import React from "react";
import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";

const TabLayout = () => {
  return (
    <Tabs tabBar={CustomTabBar} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default TabLayout;
