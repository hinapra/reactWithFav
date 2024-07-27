import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableHighlight
} from "react-native";
import { Domain } from "../../Domain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ItemList from "../../components/ItemList";
//Demo Data
import { DUMMY_DATA } from "../../components/DummyData";
import SearchBox from "../../components/SearchBox";
import ModalComp from "../../components/ModalComp";
import { ApiClient } from "./Clients";
import { ApiItem } from "../../components/Types";
import Button from "../../components/Button";
import { useFocusEffect } from "@react-navigation/native";

export interface OrderData {
  grade: string;
  category: string;
  rate: string;
  itemId: number;
}

export interface QuantityItem {
  item_id: number;
  quantity: string;
  rate: string;
  grade: string;
}

function Items({ navigation }: { navigation: any }) {
  const [dataItems, setDataItems] = useState<ApiItem[]>([]);

  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ApiItem[]>([]);

  const [visibleModal, setVisibleModal] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>();
  const [quantityValue, setQuantityValue] = useState<string | undefined>(
    undefined
  );
  const [dataOfClient, setDataofClient] = useState<ApiClient[]>([]);
  const [showPlaceOrderButton, setShowPlaceOrderButton] =
    useState<Boolean>(false);

  const [quantities, setQuantities] = useState<QuantityItem[]>([]);

  // const [textValues, setTextValues] = useState<string[]>(
  //   Array(dataItems.length).fill("")
  // );
  const [textValues, setTextValues] = useState<string[]>([]);
  const [isButtonVisible, setButtonVisible] = useState(true);
  const [isFavouriteButton, setIsFavouriteButton] = useState(false);

  useEffect(() => {
    // Initialize textValues based on the length of the data array
    setTextValues(Array(dataItems.length).fill(""));
  }, [dataItems]);

  async function fetchData() {
    try {
      const url = `${Domain}/api/get-item`;
      const value = await AsyncStorage.getItem("my-key");
      // console.log(value);

      // console.log(url);

      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
        .then((respo) => respo.json())
        .then((res) => {
          // console.log("items", res);
          setDataItems(res);
          // const initialValues: { [key: string]: string } = {};
          // res.forEach((item: ApiItem) => {
          //   initialValues[item.items_id] = "";
          // });
          // setTextValues(initialValues);
        });
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }

  useEffect(() => {
    fetchData();
    setButtonVisible(true);
    // setQuantities([]);
  }, [isButtonVisible, isFavouriteButton]);

  useFocusEffect(
    React.useCallback(() => {
      setTextValues(Array(dataItems.length).fill(""));
      setQuantities([]);
      setButtonVisible(true);
      setIsFavouriteButton(false);
      setQuantityValue("");
    }, [dataItems.length])
  );

  const AddFavourite = async (id: number) => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      fetch(`${Domain}/api/add-favorites?items_id=${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${value}`,
          "Content-Type": "application/json",
        },
      })
        .then((respo) => respo.json())
        .then(() => {
          Alert.alert("Alert", "Add to Favourite Tab", [
            {
              text: "OK",
              onPress: () => setIsFavouriteButton(() => !isFavouriteButton),
              style: "default",
            },
          ]);
          //   console.log("res", res);
        });
    } catch (error: any) {
      console.log("Error", error);
    }

    // console.log("id", id);
  };

  const Search = async () => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      const url = `${Domain}/api/get-item?item=${searchText}`;
      // console.log("url2", url);
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
        .then((respo) => respo.json())
        .then((res) => {
          // console.log("res", res);
          setSearchResults(res);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const ModalData = (
    grade: string,
    category: string,
    rate: string,
    itemId: number
  ) => {
    console.log(grade, category, rate);

    setOrderData({ grade, category, rate, itemId });
  };

  const renderData = searchText ? searchResults : dataItems;

  // const valueOfQuantity = quantityValue ?? 1;

  // const checkQuantityValue =
  //   quantityValue !== undefined && setCheckQuantity(true);

  const PlaceOrder = async (
    itemId: number | undefined,
    rate: string | undefined,
    // quantity: number,
    clientId: number | undefined,
    errorMessage?: string
  ) => {
    if (errorMessage) {
      // console.error(errorMessage);
      Alert.alert("Alert", "Please select a Client", [
        {
          text: "OK",
          style: "default",
        },
      ]);
    } else {
      if (!quantityValue) {
        Alert.alert("Alert", "Please fill the Quantity", [
          {
            text: "OK",
            style: "default",
          },
        ]);
      } else {
        // console.log(
        //   "working..",
        //   itemId,
        //   rate,
        //   clientId,
        //   "quantity",
        //   quantityValue
        // );
        const formData = new FormData();
        formData.append("client_id", String(clientId));
        formData.append("item_id", String(itemId));
        formData.append("rate", String(rate));
        formData.append("qauntity", String(quantityValue));

        try {
          const value = await AsyncStorage.getItem("my-key");
          // console.log(value);

          fetch(`${Domain}/api/order-create`, {
            method: "POST",
            headers: {
              // "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${value}`,
            },
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((res) => {
              setVisibleModal(false);
              Alert.alert("Alert", "Order Place SucessFull", [
                {
                  text: "OK",
                  style: "default",
                },
              ]);

              console.log("res", res);
            });
        } catch (error) {
          console.log("Error", error);
        }
      }
    }
  };

  const clientData = async () => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      fetch(`${Domain}/api/get-client`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
        .then((respo) => respo.json())
        .then((res) => {
          // console.log("res", res);
          setDataofClient(res);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handlePlaceOrder = () => {
    // console.log("test", quantities);
    const filteredArry = quantities.filter((obj) => obj.quantity !== "");
    setButtonVisible(false);
    setIsFavouriteButton(false);
    // setQuantities([]);
    setTextValues(Array(dataItems.length).fill(""));
    // setTextValues([]);
    setQuantityValue("");
    setQuantities([]);

    navigation.navigate("PlaceOrder", {
      data: filteredArry,
    });
    // console.log("navig", quantities);
  };

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

  const setFavourite = () => {
    Alert.alert("Alert", "Already Added In Favourites", [
      {
        text: "OK",
        style: "default",
      },
    ]);
  };

  const shouldShowButton =
    isButtonVisible && textValues.some((value) => value.length > 0);

  return (
  <ScrollView>
      <View style={styles.mainContainer}>
      <SearchBox setSearchText={setSearchText} onPress={Search} />
      {
        // showPlaceOrderButton
        shouldShowButton && (
          // <Button
          //   title="Place Order"
          //   onPress={handlePlaceOrder}
          //   isPlaceOrderButton
          // />
          <TouchableHighlight
          style={styles.button}
          onPress={handlePlaceOrder}
          underlayColor="#red" // Color when the button is pressed
        >
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableHighlight>
        )
      }

      {dataItems.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading....</Text>
        </View>
      ) : (
        <FlatList
          data={renderData}
          keyExtractor={(item: any) => item.items_id.toString()}
          renderItem={({ item, index }) => (
            <ItemList
              item={item}
              addFavourite={AddFavourite}
              setFavourite={setFavourite}
              setVisibleModal={setVisibleModal}
              modalData={ModalData}
              setQuantityValue={setQuantityValue}
              quantityValue={quantityValue}
              setShowPlaceOrderButton={setShowPlaceOrderButton}
              handleTextChange={handleTextChange}
              index={index}
              textValues={textValues}
            />
          )}
        />
      )}
      {visibleModal && (
        <ModalComp
          visible={visibleModal}
          setVisibleModal={setVisibleModal}
          orderData={orderData}
          // quantityValue={valueOfQuantity}
          // placeOrder={PlaceOrder}
          dataOfClient={dataOfClient}
          // setQuantityValue={setQuantityValue}
          // quantityValue={quantityValue}
        />
      )}
    </View>
  </ScrollView>
  );
}

export default Items;

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    position: "relative",
  },
  button: {
    backgroundColor: 'red', // Button background color
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 5, // Rounded corners
    alignItems: 'center', // Center text inside button
    marginVertical: 10, // Margin around the button
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Font weight
  },
});
