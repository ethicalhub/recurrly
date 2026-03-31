import ListHeading from "@/components/ListHeading";
import {
  INSIGHTS_CHART,
  INSIGHTS_EXPENSES,
  INSIGHTS_HISTORY,
} from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import { styled } from "nativewind";

import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const CHART_HEIGHT = 160;
const MAX_VALUE = Math.max(...INSIGHTS_CHART.map((e) => e.value), 1);
const ROUNDED_MAX = Math.ceil(MAX_VALUE / 5) * 5;
const Y_LABELS = Array.from({ length: 5 }, (_, i) =>
  String(Math.round((ROUNDED_MAX * (4 - i)) / 4)),
);

const Insights = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
      >
        {/* Header */}
        <Text className="insights-title">Monthly Insights</Text>

        {/* Upcoming + Bar Chart */}
        <ListHeading title="Upcoming" />
        <View className="insights-chart-wrap">
          <View className="insights-chart-inner">
            {/* Y-axis */}
            <View className="insights-y-axis" style={{ height: CHART_HEIGHT }}>
              {Y_LABELS.map((label) => (
                <Text key={label} className="insights-y-label">
                  {label}
                </Text>
              ))}
            </View>

            {/* Bars */}
            <View
              className="insights-bars-area"
              style={{ height: CHART_HEIGHT }}
            >
              {INSIGHTS_CHART.map((entry) => {
                const barHeight = (entry.value / MAX_VALUE) * CHART_HEIGHT;
                return (
                  <View key={entry.day} className="insights-bar-col">
                    {/* Tooltip */}
                    {entry.active && (
                      <View
                        className="insights-tooltip"
                        style={{ marginBottom: 4 }}
                      >
                        <Text className="insights-tooltip-text">
                          ${entry.value}
                        </Text>
                      </View>
                    )}
                    {/* Spacer to push bar to bottom */}
                    {!entry.active && <View className="flex-1" />}
                    {/* Bar */}
                    <View
                      className={
                        entry.active
                          ? "insights-bar insights-bar-active"
                          : "insights-bar"
                      }
                      style={{ height: barHeight }}
                    />
                    {/* Day label */}
                    <Text className="insights-bar-day">{entry.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Expenses card */}
        <View className="insights-expenses-card">
          <View>
            <Text className="insights-expenses-label">
              {INSIGHTS_EXPENSES.label}
            </Text>
            <Text className="insights-expenses-month">
              {new Date().toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
          <View>
            <Text className="insights-expenses-amount">
              {formatCurrency(INSIGHTS_EXPENSES.amount)}
            </Text>
            <Text className="insights-expenses-change">
              +{INSIGHTS_EXPENSES.change}%
            </Text>
          </View>
        </View>

        {/* History */}
        <ListHeading title="History" />
        <View className="gap-3">
          {INSIGHTS_HISTORY.length === 0 ? (
            <Text className="py-4 text-sm font-sans-medium text-muted-foreground">
              No history yet
            </Text>
          ) : (
            INSIGHTS_HISTORY.map((item) => (
              <View
                key={item.id}
                className="insights-history-card"
                style={{ backgroundColor: item.color }}
              >
                <Image source={item.icon} className="insights-history-icon" />
                <View className="insights-history-copy">
                  <Text className="insights-history-name">{item.name}</Text>
                  <Text className="insights-history-date">{item.date}</Text>
                </View>
                <View className="insights-history-right">
                  <Text className="insights-history-price">
                    {formatCurrency(item.price)}
                  </Text>
                  <Text className="insights-history-billing">
                    {item.billing}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
