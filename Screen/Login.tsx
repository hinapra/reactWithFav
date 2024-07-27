import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import { Domain } from "../Domain";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    // const url = `${Domain}/api/auth/login?email=${encodeURIComponent(
    //   email
    // )}&password=${encodeURIComponent(Password)}`;

    const url = `${Domain}/api/auth/login?email=${email}&password=${Password}`;

    console.log("url", url);
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((respo) => respo.json())
        .then(async (res) => {
          // console.log("res", res);
          await AsyncStorage.setItem("my-key", res.token);
          console.log("login", res.token);
          if (res.token) {
            navigation.navigate("Tabs");
          }
        });
      // navigation.navigate("Tabs");
    } catch (error: any) {
      console.error("Error:", error.message);
    }
    // navigation.navigate("Tabs");
  };

  //   const handleLogin = async () => {
  //     const url = `${Domain}/api/auth/login?email=${email}&password=${Password}`;

  //     console.log("url", url);

  //     try {
  //       const response = await fetch(url, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const data = await response.json();
  //       console.log("res", data);

  //       // Handle your response data here
  //     } catch (error: any) {
  //       console.error("Error:", error.message);
  //     }
  //   };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  input: {
    // height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 8,
    padding: 10,
    width: "80%",
  },
  mainContainer: {
    width: "100%",
    // alignItems: "center",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
