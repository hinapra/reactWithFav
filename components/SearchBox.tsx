import React, { useState } from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  onPress: () => Promise<void>;
  isClient?: boolean;
}

function SearchBox({ setSearchText, onPress, isClient }: Props) {
  const [searchText, setLocalSearchText] = useState(""); // Track search text locally

  const clearSearch = () => {
    setLocalSearchText(""); // Clear local input
    setSearchText(""); // Clear parent input
  };

  const handleSearchTextChange = (text: string) => {
    setLocalSearchText(text);
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={isClient ? "Search Client" : "Search Item"}
        style={styles.input}
        value={searchText}
        onChangeText={handleSearchTextChange}
      />

      {searchText.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.icon}>
          <Icon name="close-circle" size={30} color="#00C9E9" />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
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
    padding: 12,
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
  button: {
    backgroundColor: '#00C9E9', // Button background color
    paddingVertical: 14, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    // borderRadius: 5, // Rounded corners
    alignItems: 'center', // Center the text inside the button
    marginVertical: 10, // Margin around the button
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Font weight
  },
  icon:{
    marginLeft:-45,
    marginRight:15
  }
});
