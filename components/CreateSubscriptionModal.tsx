import { icons } from "@/constants/icons";
import { clsx } from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#f5c542",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#b8e8d0",
  Productivity: "#ffd6a5",
  Cloud: "#a8dadc",
  Music: "#ffb3c6",
  Other: "#d4d4d4",
};

type Frequency = "Monthly" | "Yearly";

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (sub: Subscription) => void;
}

const DEFAULT_FREQUENCY: Frequency = "Monthly";
const DEFAULT_CATEGORY: Category = "Entertainment";

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>(DEFAULT_FREQUENCY);
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);

  const parsedPrice = parseFloat(price);
  const isValid =
    name.trim().length > 0 && !isNaN(parsedPrice) && parsedPrice > 0;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency(DEFAULT_FREQUENCY);
    setCategory(DEFAULT_CATEGORY);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid) return;
    const startDate = dayjs().toISOString();
    const renewalDate = dayjs()
      .add(1, frequency === "Monthly" ? "month" : "year")
      .toISOString();

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      price: parsedPrice,
      currency: "USD",
      billing: frequency,
      category,
      status: "active",
      startDate,
      renewalDate,
      icon: icons.wallet,
      color: CATEGORY_COLORS[category],
    };

    onSubmit(newSubscription);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="modal-overlay">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View className="modal-container">
            {/* Header */}
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="modal-body">
                {/* Name */}
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    className="auth-input"
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Netflix"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    returnKeyType="next"
                    autoCapitalize="words"
                  />
                </View>

                {/* Price */}
                <View className="auth-field">
                  <Text className="auth-label">Price (USD)</Text>
                  <TextInput
                    className="auth-input"
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0.00"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </View>

                {/* Frequency */}
                <View className="auth-field">
                  <Text className="auth-label">Frequency</Text>
                  <View className="picker-row">
                    {(["Monthly", "Yearly"] as Frequency[]).map((freq) => {
                      const active = frequency === freq;
                      return (
                        <Pressable
                          key={freq}
                          className={clsx(
                            "picker-option",
                            active && "picker-option-active",
                          )}
                          onPress={() => setFrequency(freq)}
                        >
                          <Text
                            className={clsx(
                              "picker-option-text",
                              active && "picker-option-text-active",
                            )}
                          >
                            {freq}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Category */}
                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {CATEGORIES.map((cat) => {
                      const active = category === cat;
                      return (
                        <Pressable
                          key={cat}
                          className={clsx(
                            "category-chip",
                            active && "category-chip-active",
                          )}
                          onPress={() => setCategory(cat)}
                        >
                          <Text
                            className={clsx(
                              "category-chip-text",
                              active && "category-chip-text-active",
                            )}
                          >
                            {cat}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Submit */}
                <Pressable
                  className={clsx(
                    "auth-button",
                    !isValid && "auth-button-disabled",
                  )}
                  disabled={!isValid}
                  onPress={handleSubmit}
                >
                  <Text className="auth-button-text">Add Subscription</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
