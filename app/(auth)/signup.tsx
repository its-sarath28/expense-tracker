import { Alert, Pressable, StyleSheet, View } from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { At, Lock, User } from "phosphor-react-native";
import { useRef, useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
  const nameRef = useRef<string>("");
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const { register: registerUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setIsLoading(true);

    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );

    console.log(res);

    setIsLoading(false);

    if (!res.success) {
      Alert.alert("Error", res.msg);
      return;
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={800}>
            Lets,
          </Typo>
          <Typo size={30} fontWeight={800}>
            Get Started!
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Create an account to track your expenses
          </Typo>

          <Input
            placeholder="Full name"
            icon={
              <User
                size={verticalScale(24)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            onChangeText={(value) => (nameRef.current = value)}
          />

          <Input
            placeholder="Email"
            icon={
              <At
                size={verticalScale(24)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            keyboardType="email-address"
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

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo size={20} fontWeight={700} color={colors.black}>
              Sign Up
            </Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight={700} color={colors.primary}>
              Sign In
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

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
SignUp;
