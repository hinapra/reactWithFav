import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "./Button";

interface Props {
  setSearchText?: React.Dispatch<React.SetStateAction<string>>;
  onPress?: () => Promise<void>;
  isClient?: boolean;
}

function SearchBox({ setSearchText, onPress, isClient }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={isClient ? "Search Client" : "Search Item"}
        style={styles.input}
        onChangeText={(text) => setSearchText && setSearchText(text)}
      />
      <Button title="Search" onPress={onPress} isSearch />
      {/* <Button title="Search" onPress={onPress} /> */}
    </View>
  );
}

export default SearchBox;

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    margin: 8,
    elevation: 2,
    // marginLeft: 10,
    // width: "90%",
    padding: 10,
    // borderRadius: 12,
    // borderColor: "black",
    // backgroundColor: "#d9dbda",
    backgroundColor: "#fff",
    flex: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
