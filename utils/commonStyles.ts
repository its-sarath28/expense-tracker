import { StyleSheet } from "react-native";
import { scale, verticalScale } from "./styling";
import { colors } from "@/constants/theme";

export const commonStyles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: scale(135),
    borderRadius: 200,
  },
  flexBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
