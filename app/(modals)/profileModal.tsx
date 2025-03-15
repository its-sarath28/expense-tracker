import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { commonStyles } from "@/utils/commonStyles";
import { Image } from "expo-image";
import { getProfileImage } from "@/service/imageService";
import { Pencil } from "phosphor-react-native";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import { UserDataType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/service/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const ProfileModal = () => {
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const { user, updateUserData } = useAuth();

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let { name } = userData;

    if (!name.trim()) {
      Alert.alert("Error", "Please fill all details");
      return;
    }

    setLoading(true);

    const res = await updateUser(user?.uid as string, userData);

    setLoading(false);

    if (res.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* FORM */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={commonStyles.avatarContainer}>
            <Image
              style={[commonStyles.avatar, styles.avatar]}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />

            <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
              <Pencil size={scale(20)} color={colors.neutral800} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Typo size={14} color={colors.neutral200}>
              Name
            </Typo>
            <Input
              placeholder="Name"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} size={16} fontWeight={"700"}>
            Update
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatar: {
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
