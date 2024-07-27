import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import { Domain } from "../../Domain";
import ItemList from "../../components/ItemList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBox from "../../components/SearchBox";
import { useFocusEffect } from "@react-navigation/native";
import { FavoritesItem } from "../../components/Types";
import { QuantityItem } from "./Items";
import Button from "../../components/Button";

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
    setTextValues(Array(favouriteItem.length).fill("red"));
  }, [favouriteItem]);

  useFocusEffect(
    React.useCallback(() => {
      setTextValues(Array(favouriteItem.length).fill("red"));
      setQuantities([]);
      setButtonVisible(true);
      setQuantityValue("");
    }, [favouriteItem.length])
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

  // const handleTextChange = (
  //   text: string,
  //   item_id: number,
  //   rate: string,
  //   index: number,
  //   grade: string
  // ) => {
  //   const newTextValues = [...textValues];
  //   newTextValues[index] = text;
  //   setTextValues(newTextValues);
  //   setQuantities((prevQuantities) => {
  //     const updatedQuantities = [...prevQuantities];
  //     const index = updatedQuantities.findIndex((qi) => qi.item_id === item_id);

  //     if (index !== -1) {
  //       // Update existing item
  //       updatedQuantities[index] = {
  //         item_id: item_id,
  //         quantity: text,
  //         rate: rate,
  //         grade: grade,
  //       };
  //     } else {
  //       // Add new item
  //       updatedQuantities.push({
  //         item_id: item_id,
  //         quantity: text,
  //         rate: rate,
  //         grade: grade,
  //       });
  //     }

  //     return updatedQuantities;
  //   });
  // };

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
      <SearchBox />
      {
        // showPlaceOrderButton
        shouldShowButton && (
          <Button
            title="Place Order"
            onPress={handlePlaceOrder}
            // onPress={() => console.log("o")}
            isPlaceOrderButton
          />
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
          />
        )}
      />
    </View>
    </ScrollView>
  );
}

export default Favourite;
