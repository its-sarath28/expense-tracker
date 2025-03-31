import { Platform, StyleSheet, View } from "react-native";
import { FC } from "react";
import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import { verticalScale } from "@/utils/styling";

const isIOS: boolean = Platform.OS === "ios";

const ModalWrapper: FC<ModalWrapperProps> = ({
  style,
  children,
  bgColor = colors.neutral800,
}) => {
  return (
    <View
      style={[styles.container, { backgroundColor: bgColor }, style && style]}
    >
      {children}
    </View>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIOS ? spacingY._15 : verticalScale(50),
    paddingBottom: isIOS ? spacingY._20 : spacingY._10,
  },
});
