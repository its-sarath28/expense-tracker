import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FC } from "react";
import { ImageUploadProps } from "@/types";
import { UploadSimple, XCircle } from "phosphor-react-native";
import { colors, radius } from "@/constants/theme";
import Typo from "./Typo";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { getFilePath } from "@/service/imageService";
import * as ImagePicker from "expo-image-picker";

const ImageUpload: FC<ImageUploadProps> = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder,
}) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  };

  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.inputContainer, containerStyle && containerStyle]}
        >
          <UploadSimple color={colors.neutral200} />
          {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}

      {file && (
        <View style={[styles.image, imageStyle && imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />

          <TouchableOpacity onPress={onClear} style={styles.deleteIcon}>
            <XCircle size={scale(24)} weight="fill" color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(10),
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderStyle: "dashed",
  },
  image: {
    height: verticalScale(150),
    width: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  deleteIcon: {
    position: "absolute",
    top: verticalScale(6),
    right: scale(6),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
