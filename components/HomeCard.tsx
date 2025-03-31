import { ImageBackground, StyleSheet, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Typo from "./Typo";
import { ArrowDown, ArrowUp, DotsThreeOutline } from "phosphor-react-native";
import { commonStyles } from "@/utils/commonStyles";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const HomeCard = () => {
  const { user } = useAuth();

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotals = () => {
    return (
      wallets?.reduce(
        (
          totals: { balance: number; income: number; expense: number },
          item: WalletType
        ) => {
          totals.balance += Number(item.amount);
          totals.income += Number(item.totalIncome);
          totals.expense += Number(item.totalExpenses);
          return totals;
        },
        { balance: 0, income: 0, expense: 0 }
      ) || { balance: 0, income: 0, expense: 0 }
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          {/* Total Balance */}
          <View style={styles.totalBalanceRow}>
            <Typo color={colors.neutral800} size={17} fontWeight={"500"}>
              Total Balance
            </Typo>

            <DotsThreeOutline
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>

          <Typo color={colors.black} size={30} fontWeight={"500"}>
            $ {walletLoading ? "----" : getTotals()?.balance?.toFixed(2)}
          </Typo>
        </View>

        {/* Total Expense & Income */}
        <View style={commonStyles.flexBetween}>
          {/* Income */}
          <View style={{ gap: scale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statIcon}>
                <ArrowDown
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight="500">
                Income
              </Typo>
            </View>

            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.green} fontWeight={"600"}>
                $ {walletLoading ? "----" : getTotals()?.income?.toFixed(2)}
              </Typo>
            </View>
          </View>
          {/* Expense */}
          <View style={{ gap: scale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statIcon}>
                <ArrowUp
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight="500">
                Expense
              </Typo>
            </View>

            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.rose} fontWeight={"600"}>
                $ {walletLoading ? "----" : getTotals()?.expense?.toFixed(2)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: verticalScale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(20),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
  statIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
});
