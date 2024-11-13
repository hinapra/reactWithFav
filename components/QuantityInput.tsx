import React from "react";
import { StyleSheet, TextInput } from "react-native";

interface Props {
  setQuantityValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleTextChange: (
    text: string,
    item_id: number,
    rate: string,
    index: number,
    grade: string
  ) => void;
  item_id: number;
  rate: string;
  index: number;
  grade: string;
  textValues: string[];
}

function QuantityInput({
  item_id,
  handleTextChange,
  rate,
  index,
  grade,
  textValues,
}:
Props) {
  return (
    <TextInput
      style={styles.inputText}
      placeholder=" Enter Quantity"
      keyboardType="numeric"
      value={textValues[index] || ""}
       placeholderTextColor="#00C9E9"
      onChangeText={(text: string) => {

        handleTextChange(text, item_id, rate, index, grade);
      }}
    />
  );
}

export default QuantityInput;

const styles = StyleSheet.create({
  inputText: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginTop: 6,
    fontSize: 14
  },
});
