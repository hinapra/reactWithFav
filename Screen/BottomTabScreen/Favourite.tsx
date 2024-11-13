import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView,TouchableOpacity,StyleSheet, Alert } from "react-native";
import { Domain } from "../../Domain";
import ItemList from "../../components/ItemList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBox from "../../components/SearchBox";
import { useFocusEffect } from "@react-navigation/native";
import { FavoritesItem } from "../../components/Types";
import { QuantityItem } from "./Items";
import Button from "../../components/Button";
import { debounce } from 'lodash';

function Favourite({ navigation }: { navigation: any }) {
  const [favouriteItem, setFavouriteItem] = useState<FavoritesItem[]>([]);
  const [textValues, setTextValues] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<QuantityItem[]>([]);
  const [quantityValue, setQuantityValue] = useState<string | undefined>(
    undefined
  );
  const [showPlaceOrderButton, setShowPlaceOrderButton] =
    useState<Boolean>(false);
  const [isButtonVisible, setButtonVisible] = useState(true);
  
  const fetchData = async () => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      fetch(`${Domain}/api/get-favorites`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
        .then((respo) => respo.json())
        .then((res) => {
          // console.log("res", res);
          setFavouriteItem(res);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    setTextValues(Array(favouriteItem.length).fill(""));
  }, [favouriteItem]);

  useFocusEffect(
    React.useCallback(() => {
      setTextValues(Array(favouriteItem.length).fill(""));
      setQuantities([]);
      setButtonVisible(true);
      setQuantityValue("");
    }, [favouriteItem.length])
  );
  // Define the removeFromFavorites function with debouncing
    const removeFromFavorites = useCallback(
        debounce(async (items_id) => {
            try {
                const value = await AsyncStorage.getItem("my-key"); // Get your token
                const response = await fetch(`http://54.172.193.2/api/remove-favorites?items_id=${items_id}`, {
                    method: "GET", // Use GET method (if necessary)
                    headers: {
                        Authorization: `Bearer ${value}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    Alert.alert("Success", "Item removed successfully");
                    // Update the state to remove the item
                    setFavouriteItem((prevItems) => 
                        prevItems.filter((item) => item.items_id !== items_id)
                    );
                } else {
                    const errorData = await response.json();
                    console.error("Error removing item from favorites:", errorData);
                }
            } catch (error) {
                console.error("Error removing item from favorites:", error);
            }
        }, 300), // Adjust the delay as needed
        []
    );



  // useEffect(() => {
  //   fetchData();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      setButtonVisible(true);
    }, [isButtonVisible])
  );

  const handleTextChange = (
    text: string,
    item_id: number,
    rate: string,
    index: number,
    grade: string
  ) => {
    const newTextValues = [...textValues];
    newTextValues[index] = text;
    setTextValues(newTextValues);

    setQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      const quantityIndex = updatedQuantities.findIndex(
        (qi) => qi.item_id === item_id
      );

      if (quantityIndex !== -1) {
        updatedQuantities[quantityIndex] = {
          item_id: item_id,
          quantity: text,
          rate: rate,
          grade: grade,
        };
      } else {
        updatedQuantities.push({
          item_id: item_id,
          quantity: text,
          rate: rate,
          grade: grade,
        });
      }

      return updatedQuantities;
    });
  };

  const shouldShowButton =
    isButtonVisible && textValues.some((value) => value.length > 0);

  const handlePlaceOrder = () => {
    const filteredArray = quantities.filter((obj) => obj.quantity !== "");
    setButtonVisible(false);
    setQuantities([]);
    setTextValues(Array(favouriteItem.length).fill("red"));

    navigation.navigate("PlaceOrder", {
      data: filteredArray,
    });
  };
  return (
    <ScrollView>
      <View>
        {/* <SearchBox /> */}
        { 
          // Conditionally render the Place Order button
          shouldShowButton && (
            <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
          )
        }
        <FlatList
          data={favouriteItem}
          keyExtractor={(item) => item.favorites_id.toString()}
          renderItem={({ item, index }) => (
            <ItemList
              item={item}
              isFavourite
              setQuantityValue={setQuantityValue}
              quantityValue={quantityValue}
              setShowPlaceOrderButton={setShowPlaceOrderButton}
              handleTextChange={handleTextChange}
              index={index}
              textValues={textValues}
              removeFromFavorites={() => removeFromFavorites(item.items_id)} // Pass items_id here
              />
          )}
        />
      </View>
    </ScrollView>
  );  
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00C9E9', // Background color of the button
    paddingVertical: 14, // Vertical padding inside the button
    paddingHorizontal: 20, // Horizontal padding inside the button
    // borderRadius: 8, // Rounded corners
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    marginVertical: 4, // Vertical margin
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 2, // Shadow blur radius for iOS
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Font weight
  },
});


export default Favourite;
