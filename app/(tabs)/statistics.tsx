import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart } from "react-native-gifted-charts";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/service/transactionService";
import TransactionList from "@/components/TransactionList";

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (activeIndex === 0) getWeeklyStats();
    if (activeIndex === 1) getMonthlyStats();
    if (activeIndex === 2) getYearlyStats();
  }, [activeIndex]);

  const getWeeklyStats = async () => {
    setChartLoading(true);

    let res = await fetchWeeklyStats(user?.uid as string);

    setChartLoading(false);

    if (!res.success) {
      Alert.alert("Error", res.msg);
      return;
    }

    setChartData(res?.data?.stats);
    setTransactions(res?.data?.transactions);
  };

  const getMonthlyStats = async () => {
    setChartLoading(true);

    let res = await fetchMonthlyStats(user?.uid as string);

    setChartLoading(false);

    if (!res.success) {
      Alert.alert("Error", res.msg);
      return;
    }

    setChartData(res?.data?.stats);
    setTransactions(res?.data?.transactions);
  };

  const getYearlyStats = async () => {
    setChartLoading(true);

    let res = await fetchYearlyStats(user?.uid as string);

    setChartLoading(false);

    if (!res.success) {
      Alert.alert("Error", res.msg);
      return;
    }

    setChartData(res?.data?.stats);
    setTransactions(res?.data?.transactions);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <Header title="Statistics" />
        </View>

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
          />

          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(12)}
                spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                roundedTop
                roundedBottom
                hideRules
                yAxisLabelPrefix="$"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={
                  [1, 2].includes(activeIndex) ? scale(35) : scale(38)
                }
                yAxisTextStyle={{ color: colors.neutral350 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(12),
                }}
                noOfSections={4}
                minHeight={5}
              />
            ) : (
              <View style={styles.noChart}></View>
            )}

            {chartLoading && (
              <View style={styles.chartLoading}>
                <Loading />
              </View>
            )}
          </View>

          {/* Transactions */}
          <View>
            <TransactionList
              title="Transaction"
              emptyListMessage="No transactions found"
              data={transactions}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  segmentStyle: {
    height: verticalScale(37),
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  noChart: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210),
  },
  chartLoading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
});
