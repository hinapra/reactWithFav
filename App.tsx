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
import Profile from "./Screen/Profile";
import ItemDetails from "./Screen/ItemDetails";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type RootStackParamList = {
  login: undefined;
  Tabs: undefined;
  PlaceOrder: undefined;
  Profile: undefined;
  ForgotPassword: undefined;
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
          fontSize: 14,
        },
      }}
    >
      <Tab.Screen
        name="Items"
        component={Items}
        options={{
          tabBarIcon: ({ focused, size }) => (
            focused ? (
              <Feather name="list" color="#00C9E9" size={size} style={{ fontWeight: 'bold' }} /> // Bold when focused
            ) : (
              <Feather name="list" color="#3B3C3C" size={size} /> // Outline when unfocused
            )
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: '#00C9E9', fontSize: 16, fontWeight: '600' }}>Items</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: ({ focused, size }) => (
            focused ? (
              <AntDesign name="shoppingcart" color="#00C9E9" size={size} style={{ fontWeight: 'bold' }} /> // Bold when focused
            ) : (
              <AntDesign name="shoppingcart" color="#3B3C3C" size={size} /> // Outline when unfocused
            )
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: '#00C9E9', fontSize: 16, fontWeight: '600' }}>Orders</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={Favourite}
        options={{
          tabBarIcon: ({ focused, size }) => (
            focused ? (
              <MaterialIcons name="favorite" color="#00C9E9" size={size} style={{ fontWeight: 'bold' }} /> // Bold when focused
            ) : (
              <MaterialIcons name="favorite-outline" color="#3B3C3C" size={size} /> // Outline when unfocused
            )
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: '#00C9E9', fontSize: 16, fontWeight: '600' }}>Favourite</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Client"
        component={Clients}
        options={{
          tabBarIcon: ({ focused, size }) => (
            focused ? (
              <Ionicons name="person" color="#00C9E9" size={size} style={{ fontWeight: 'bold' }} /> // Bold when focused
            ) : (
              <Ionicons name="person-outline" color="#3B3C3C" size={size} /> // Outline when unfocused
            )
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: '#00C9E9', fontSize: 16, fontWeight: '600' }}>Client</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused, size }) => (
            focused ? (
              <Feather name="user" color="#00C9E9" size={size} style={{ fontWeight: 'bold' }} /> // Bold when focused
            ) : (
              <Feather name="user" color="#3B3C3C" size={size} /> // Outline when unfocused
            )
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: '#00C9E9', fontSize: 16, fontWeight: '600' }}>Profile</Text>
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

  // useEffect(() => {
  //   // Check for the token in AsyncStorage
  //   const checkToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("my-key"); // Replace 'my-key' with your actual storage key
  //       setInitialRoute(token ? "Tabs" : "login");
  //       if (fontsLoaded) {
  //         await SplashScreen.hideAsync();
  //       }
  //     } catch (error) {
  //       console.error("Error checking token:", error);
  //       setInitialRoute("login");
  //     }
  //   };

  //   checkToken();
  // }, [fontsLoaded]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("my-key");
        setInitialRoute(token ? "Tabs" : "login");
        if (fontsLoaded) {
          // Delay hiding the splash screen for 2 seconds
          setTimeout(async () => {
            await SplashScreen.hideAsync();
          }, 4000);
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
          <Stack.Screen name="login" 
          component={Login}
           />
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
           <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: true }}
          />
          <Stack.Screen name="ItemDetails" component={ItemDetails} />

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
