import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { useState } from "react";
import { WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateWallet } from "@/service/walletService";

const WalletModal = () => {
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const { user } = useAuth();

  const onSubmit = async () => {
    let { name, image } = wallet;

    if (!name.trim()) {
      Alert.alert("Error", "Please fill all details");
      return;
    }

    setLoading(true);

    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };

    const res = await createOrUpdateWallet(data);

    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="New Wallet"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* FORM */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo size={14} color={colors.neutral200}>
              Wallet name
            </Typo>
            <Input
              placeholder="Eg: Salary"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo size={14} color={colors.neutral200}>
              Wallet icon
            </Typo>

            <ImageUpload
              placeholder="Upload image"
              file={wallet.image}
              onSelect={(data) => setWallet({ ...wallet, image: data })}
              onClear={() => setWallet({ ...wallet, image: null })}
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

export default WalletModal;

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
