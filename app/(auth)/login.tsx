import { Alert, Pressable, StyleSheet, View } from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { At, Lock } from "phosphor-react-native";
import { useRef, useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={800}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={800}>
            Welcome Back!
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expenses
          </Typo>

          <Input
            placeholder="Email"
            icon={
              <At
                size={verticalScale(24)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            placeholder="Password"
            icon={
              <Lock
                size={verticalScale(24)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            onChangeText={(value) => (passwordRef.current = value)}
            secureTextEntry
          />

          <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
            Forgot Password?
          </Typo>

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo size={20} fontWeight={700} color={colors.black}>
              Sign In
            </Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo size={15}>Don't have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/signup")}>
            <Typo size={15} fontWeight={700} color={colors.primary}>
              Sign Up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingX._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
