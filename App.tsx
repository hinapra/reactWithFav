import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./Screen/Login";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import Items from "./Screen/BottomTabScreen/Items";
import Orders from "./Screen/BottomTabScreen/Orders";
import Favourite from "./Screen/BottomTabScreen/Favourite";
import Clients from "./Screen/BottomTabScreen/Clients";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlaceOrderScreen from "./Screen/PlaceOrderScreen";
import * as SplashScreen from "expo-splash-screen";
import OrderDetailScreen from "./Screen/OrderDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type RootStackParamList = {
  login: undefined;
  Tabs: undefined;
  PlaceOrder: undefined;

  // Add other screen names as needed
};
export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "login"
>;
type TabsScreenNavigationProp = BottomTabNavigationProp<
  RootStackParamList,
  "Tabs"
>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, "login">;

SplashScreen.preventAutoHideAsync();

function BottonTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 60 }, // Adjust the height as needed
        tabBarLabelStyle: {
          fontSize: 15,
        },
      }}
    >
      <Tab.Screen
        name="Items"
        component={Items}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" color="#3B3C3C" styles={{fontWeight: 600}} size={size} />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: '#00C9E9', fontSize: 18, fontWeight: 600 }}>Items</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="shoppingcart" color="#3B3C3C" size={size} />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: '#00C9E9', fontSize: 18, fontWeight: 600 }}>Orders</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={Favourite}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite-outline" color="#3B3C3C" size={size} />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: '#00C9E9', fontSize: 18, fontWeight: 600 }}>Favourite</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Client"
        component={Clients}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color="#3B3C3C" size={size} />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: '#00C9E9', fontSize: 18, fontWeight: 700 }}>Client</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | undefined>(
    undefined
  );

  const [fontsLoaded] = useFonts({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "Roboto-light": require("./assets/fonts/Roboto-Light.ttf"),
    "Roboto-Italic": require("./assets/fonts/Roboto-LightItalic.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    // Check for the token in AsyncStorage
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("my-key"); // Replace 'my-key' with your actual storage key
        setInitialRoute(token ? "Tabs" : "login");
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setInitialRoute("login");
      }
    };

    checkToken();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (initialRoute === undefined) {
    // Loading state or any other logic
    return null;
  }
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen
            name="PlaceOrder"
            options={{ title: "Place Order" }}
            component={PlaceOrderScreen}
          />
          <Stack.Screen
            name="OrderDetail"
            options={{ title: "Orders Detail" }}
            component={OrderDetailScreen}
          />
          <Stack.Screen
            name="Tabs"
            component={BottonTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
