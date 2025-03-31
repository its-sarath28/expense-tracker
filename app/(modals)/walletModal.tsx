import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import { WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateWallet, deleteWallet } from "@/service/walletService";
import { Trash } from "phosphor-react-native";

const WalletModal = () => {
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const router = useRouter();

  const { user } = useAuth();
  const { id, name, image } = useLocalSearchParams();

  useEffect(() => {
    if (id && name) {
      setWallet({ name: name as string, image });
    }
  }, []);

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

    if (id) {
      data.id = id as string;
    }

    const res = await createOrUpdateWallet(data);

    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const onDelete = async () => {
    if (!id) return;
    setDeleting(true);

    const res = await deleteWallet(id as string);

    setDeleting(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert(`Error`, res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this wallet ? \nThis will remove all transactions related to this wallet",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: onDelete },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={id ? "Update Wallet" : "New Wallet"}
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
        {id && (
          <Button
            onPress={showDeleteAlert}
            loading={deleting}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}

        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} size={16} fontWeight={"700"}>
            {id ? "Update Wallet" : "Add Wallet"}
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
