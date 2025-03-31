import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import { TransactionType, WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { Trash } from "phosphor-react-native";
import { Dropdown } from "react-native-element-dropdown";
import { expenseCategories, transactionTypes } from "@/constants/data";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/service/transactionService";

type ParamType = {
  id: string;
  type: string;
  amount: string;
  category?: string;
  date: string;
  description?: string;
  image?: any;
  uid?: string;
  walletId: string;
};

const TransactionModal = () => {
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    category: "",
    date: new Date(),
    description: "",
    image: null,
    walletId: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const router = useRouter();

  const { user } = useAuth();
  const oldTransaction: ParamType = useLocalSearchParams();

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  useEffect(() => {
    if (oldTransaction.id) {
      setTransaction({
        type: oldTransaction?.type as TransactionType["type"],
        amount: Number(oldTransaction.amount),
        category: oldTransaction.category,
        date: new Date(oldTransaction.date),
        description: oldTransaction.description,
        image: oldTransaction.image,
        walletId: oldTransaction.walletId,
      });
    }
  }, []);

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;

    if (!walletId || !date || !amount || (type === "expense" && !category)) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image ? image : null,
      uid: user?.uid,
    };

    if (oldTransaction.id) transaction.id = oldTransaction.id;

    setLoading(true);

    const res = await createOrUpdateTransaction(transactionData);

    setLoading(false);

    if (!res.success) {
      Alert.alert("Error", res.msg);
      return;
    }

    router.back();
  };

  const onDelete = async () => {
    if (!oldTransaction.id) return;

    setDeleting(true);

    const res = await deleteTransaction(
      oldTransaction.id,
      oldTransaction.walletId
    );

    setDeleting(false);

    if (!res.success) {
      Alert.alert(`Error`, res.msg);
      return;
    }

    router.back();
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this transaction ?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: onDelete },
      ]
    );
  };

  const onDateChange = (_: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    if (Platform.OS === "android") setShowDatePicker(false);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* FORM */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo size={14} color={colors.neutral200}>
              Type
            </Typo>

            <Dropdown
              style={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownSelectedText}
              placeholderStyle={styles.dropdownPlaceholder}
              iconStyle={styles.dropdownIcon}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.neutral700}
              placeholder="Select Type"
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo size={14} color={colors.neutral200}>
              Wallet
            </Typo>

            <Dropdown
              style={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownSelectedText}
              placeholderStyle={styles.dropdownPlaceholder}
              iconStyle={styles.dropdownIcon}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.neutral700}
              placeholder="Select Wallet"
              data={wallets.map((wallet) => ({
                label: `${wallet.name} (${wallet.amount})`,
                value: wallet.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value });
              }}
            />
          </View>

          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo size={14} color={colors.neutral200}>
                Category
              </Typo>

              <Dropdown
                style={styles.dropdownContainer}
                selectedTextStyle={styles.dropdownSelectedText}
                placeholderStyle={styles.dropdownPlaceholder}
                iconStyle={styles.dropdownIcon}
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                activeColor={colors.neutral700}
                placeholder="Select Category"
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({ ...transaction, category: item.value });
                }}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Typo size={14} color={colors.neutral200}>
              Date
            </Typo>

            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}

            {showDatePicker && (
              <View style={Platform.OS === "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  onChange={onDateChange}
                />

                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={14} fontWeight={"500"}>
                      OK
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Typo size={14} color={colors.neutral200}>
              Amount
            </Typo>
            <Input
              keyboardType="numeric"
              value={transaction.amount.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo size={14} color={colors.neutral200}>
                Description
              </Typo>
              <Typo size={12} color={colors.neutral400}>
                (Optional)
              </Typo>
            </View>

            <Input
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: verticalScale(15),
              }}
              value={transaction.description}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo size={14} color={colors.neutral200}>
                Attachment
              </Typo>
              <Typo size={12} color={colors.neutral400}>
                (Optional)
              </Typo>
            </View>

            <ImageUpload
              placeholder="Upload attachment"
              file={transaction.image}
              onSelect={(data) =>
                setTransaction({ ...transaction, image: data })
              }
              onClear={() => setTransaction({ ...transaction, image: null })}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction.id && (
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
            {oldTransaction.id ? "Update Transaction" : "Add Transaction"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

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
    paddingBottom: verticalScale(50),
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
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownIcon: {
    tintColor: colors.neutral300,
    height: verticalScale(20),
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: verticalScale(5),
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {},
  datePickerButton: {
    alignSelf: "flex-end",
    backgroundColor: colors.neutral400,
    paddingVertical: scale(5),
    paddingHorizontal: scale(10),
    borderRadius: radius._3,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
});
