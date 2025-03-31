import {
  Dimensions,
  Platform,
  StyleSheet,
  StatusBar,
  View,
} from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";
import {} from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "ios" ? height * 0.06 : 20;

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  return (
    <View
      style={[
        style,
        { paddingTop, flex: 1, backgroundColor: colors.neutral900 },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />

      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
