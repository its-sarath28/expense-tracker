import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";
import { getProfileImage } from "@/service/imageService";
import { accountOptionType } from "@/types";
import {
  CaretRight,
  GearSix,
  Lock,
  SignOut,
  User,
} from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import { commonStyles } from "@/utils/commonStyles";

const Profile = () => {
  const { user } = useAuth();

  const router = useRouter();

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <User size={scale(26)} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366F1",
    },
    {
      title: "Settings",
      icon: <GearSix size={scale(26)} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Lock size={scale(26)} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModal",
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <SignOut size={scale(26)} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#E11D48",
    },
  ];

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancelled"),
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          await signOut(auth);
        },
        style: "destructive",
      },
    ]);
  };

  const handlePress = (item: accountOptionType) => {
    if (item.title === "Logout") {
      showLogoutAlert();
    }

    if (item.routeName) {
      router.push(item.routeName);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

        {/* User Info */}
        <View style={styles.userInfo}>
          {/* Avatar */}
          <View>
            <Image
              source={getProfileImage(user?.image)}
              style={commonStyles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>

          {/* Name & Email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* Account Options */}
        <View style={styles.accountOptions}>
          {accountOptions?.map((item, index) => (
            <Animated.View
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(14)}
              key={index.toString()}
              style={styles.listItem}
            >
              <TouchableOpacity
                onPress={() => handlePress(item)}
                style={styles.flexRow}
              >
                <View
                  style={[styles.listIcon, { backgroundColor: item.bgColor }]}
                >
                  {item.icon}
                </View>

                <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                  {item.title}
                </Typo>

                <CaretRight
                  size={scale(20)}
                  color={colors.neutral100}
                  weight="bold"
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: scale(135),
    borderRadius: 200,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  listIcon: {
    height: verticalScale(44),
    width: scale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
});
