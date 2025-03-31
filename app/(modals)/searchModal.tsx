import { ScrollView, StyleSheet, View } from "react-native";
import { colors, spacingY } from "@/constants/theme";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import { useState } from "react";
import { TransactionType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import TransactionList from "@/components/TransactionList";

const SearchModal = () => {
  const [search, setSearch] = useState<string>("");

  const router = useRouter();

  const { user } = useAuth();

  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];

  const { data, loading } = useFetchData<TransactionType>(
    "transactions",
    constraints
  );

  const filteredTransactions = data.filter((item) => {
    if (search.length > 1) {
      if (
        item?.category
          ?.toLocaleLowerCase()
          ?.includes(search?.toLocaleLowerCase()) ||
        item?.type
          ?.toLocaleLowerCase()
          ?.includes(search?.toLocaleLowerCase()) ||
        item?.description
          ?.toLocaleLowerCase()
          ?.includes(search?.toLocaleLowerCase())
      ) {
        return true;
      }

      return false;
    }

    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* FORM */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Search here..."
              value={search}
              containerStyle={{ backgroundColor: colors.neutral800 }}
              placeholderTextColor={colors.neutral400}
              onChangeText={(value) => setSearch(value)}
            />
          </View>

          <View>
            <TransactionList
              loading={loading}
              data={filteredTransactions}
              emptyListMessage="No transaction match your search"
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
