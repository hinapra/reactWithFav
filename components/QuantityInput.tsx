import React from "react";
import { StyleSheet, TextInput } from "react-native";

// interface Props {
//   setQuantityValue: React.Dispatch<React.SetStateAction<string | undefined>>;
//   quantityValue: string | undefined;
//   setShowPlaceOrderButton: React.Dispatch<React.SetStateAction<Boolean>>;

//   handleTextChange: (
//     text: string,
//     item_id: number,
//     rate: string,
//     index: number,
//     grade: string
//   ) => void;

//   item_id: number;
//   rate: string;
//   index: number;
//   grade: string;
//   textValue: string;
//   // textValues: { [key: string]: string };
// }

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
  // setQuantityValue,
  // quantityValue,
  // setShowPlaceOrderButton,
  item_id,
  handleTextChange,
  rate,
  index,
  grade,
  textValues,
}: // textValue,
// textValues,
Props) {
  // console.log("quanty", itemId);
  return (
    <TextInput
      style={styles.inputText}
      placeholder=" Enter Quantity"
      keyboardType="numeric"
      // value={textValues[itemId]}
      value={textValues[index] || ""}
      // value={textValue}
       placeholderTextColor="#00C9E9"
      onChangeText={(text: string) => {
        // setShowPlaceOrderButton(text.trim().length > 0);

        handleTextChange(text, item_id, rate, index, grade);
      }}
    />
  );
}

export default QuantityInput;

const styles = StyleSheet.create({
  inputText: {
    // backgroundColor: "#d9dbda",
    // borderWidth: 1,
    // borderColor: "grey",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginTop: 10,
    color: "red",
    fontSize: 14
    // padding: 5,
  },
});
