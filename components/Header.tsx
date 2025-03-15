import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { HeaderProps } from "@/types";
import Typo from "./Typo";

const Header: FC<HeaderProps> = ({ title = "", leftIcon, style }) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && (
        <Typo
          size={22}
          fontWeight={"600"}
          style={{ textAlign: "center", width: leftIcon ? "82%" : "100%" }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcon: {
    alignSelf: "flex-start",
  },
});
