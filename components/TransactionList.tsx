import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FC } from "react";
import {
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "@/types";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "./Typo";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import Loading from "./Loading";
import { expenseCategories, incomeCategory } from "@/constants/data";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "expo-router";

const TransactionList: FC<TransactionListType> = ({
  data,
  title,
  loading,
  emptyListMessage,
}) => {
  const router = useRouter();

  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item.id,
        type: item.type,
        amount: item.amount.toString(),
        category: item.category,
        date: (item.date as Timestamp)?.toDate().toISOString(),
        description: item.description,
        image: item.image,
        uid: item.uid,
        walletId: item.walletId,
      },
    });
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={60}
        />

        {loading && (
          <View style={{ top: verticalScale(100) }}>
            <Loading />
          </View>
        )}

        {!loading && data.length === 0 && (
          <Typo
            size={15}
            color={colors.neutral400}
            style={{ textAlign: "center", marginTop: spacingY._15 }}
          >
            {emptyListMessage}
          </Typo>
        )}
      </View>
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category =
    item?.type === "income"
      ? incomeCategory
      : expenseCategories[item.category!];
  const IconComponent = category.icon;

  const date = (item.date as Timestamp).toDate().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(index + 70)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity onPress={() => handleClick(item)} style={styles.row}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>

        <View style={styles.categoryDes}>
          <Typo size={17}>{category.label}</Typo>
          <Typo
            size={12}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {item?.description}
          </Typo>
        </View>

        <View style={styles.amountDate}>
          <Typo
            fontWeight={"500"}
            color={item.type === "income" ? colors.primary : colors.rose}
          >
            {`${item.type === "income" ? `+ $` : `- $`}${item.amount}`}
          </Typo>
          <Typo size={13} fontWeight={"500"} color={colors.neutral400}>
            {date}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
  },
  list: {
    minHeight: verticalScale(3),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3,
  },
});
