import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
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
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { MaterialIcons } from "@expo/vector-icons";


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
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(null);
  const [showCategories, setShowCategories] = useState(true);  // State to control categories visibility
  const [searchText, setSearchText] = useState<string>("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState<ApiItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ApiItem[]>([]);
  const [filteredData, setFilteredData] = useState([]); // Items filtered by category
  const [visibleModal, setVisibleModal] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>();
  const [quantityValue, setQuantityValue] = useState<string | undefined>(undefined);
  const [dataOfClient, setDataofClient] = useState<ApiClient[]>([]);
  const [showPlaceOrderButton, setShowPlaceOrderButton] =useState<Boolean>(false);
  const [quantities, setQuantities] = useState<QuantityItem[]>([]);
  // const [textValues, setTextValues] = useState<string[]>(
  //   Array(dataItems.length).fill("")
  // );
  const [textValues, setTextValues] = useState<string[]>([]);
  const [isButtonVisible, setButtonVisible] = useState(true);
  const [isFavouriteButton, setIsFavouriteButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [favoriteItems, setFavoriteItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Call filterData whenever the search text or selected category changes
    filterData();
  }, [searchText, selectedCategory, dataItems]);

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
          setRenderData(res);
          setNotFound(false);
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
           // Preprocess response to remove dots and normalize to lowercase
        const normalizedResults = res.map(item => ({
          ...item,
          code: item.code.replace(/\./g, '').toLowerCase(),
          rate: item.rate.replace(/\./g, '').toLowerCase(),
          size: item.size.replace(/\./g, '').toLowerCase(),
          // grade: item.grade.replace(/\./g, '').toLowerCase(),
          // category: item.category.replace(/\./g, '').toLowerCase()
        }));
        
        setSearchResults(normalizedResults);
          // setSearchResults(res);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

   // Fetch categories (You need to implement the API for categories if not available)
   const fetchCategories = async () => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      const response = await fetch(`${Domain}/api/get-category`, {
        method: "GET",
        headers: { Authorization: `Bearer ${value}` },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchItemsByCategory = async (categoryId: string) => {
    try {
      const token = await AsyncStorage.getItem("my-key");
  
      if (!token) {
        console.error("Error: Token not found");
        return []; // Return an empty array if the token is missing
      }
  
      const response = await fetch(`${Domain}/api/get-item?category_id=${categoryId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        console.error("Error fetching items by category: ", response.statusText);
        return []; // Return an empty array if the response is not OK
      }
  
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        console.error("Error: Unexpected data format", data);
        return []; // Return an empty array if the data is not an array
      }
  
      return data; // Return the parsed data if all checks pass
  
    } catch (error) {
      console.error("Error fetching items by category:", error);
      return []; // Return an empty array in case of any error
    }
  };
  

  // useEffect(() => {
  //   fetchData();
  //   fetchCategories();
  //   setButtonVisible(true);
  //   // setQuantities([]);
  // }, [isButtonVisible, isFavouriteButton]);

  const handleCategoryChange = async (value: string) => {
    setSelectedCategory(value);
    setShowCategories(false); // Hide category list when a category is selected
  
    // Set loading to true before fetching data
    setLoading(true);
  
    if (value === 'all') {
      setFilteredData(dataItems); // Show all items if 'all' is selected
    } else {
      const filteredItems = await fetchItemsByCategory(value);
      setFilteredData(filteredItems); // Update with fetched data
    }
  
    // Set loading to false after data is set
    setLoading(false);
  };

  const filterData = () => {
    const regex = new RegExp(searchText, "i");
    const filtered = dataItems.filter(item => {
      // Check for matches using regex
      return (
        regex.test(item.code) ||
        regex.test(item.size) ||
        regex.test(item.rate) ||
        regex.test(item.category)
      );
    });
    setFilteredData(filtered);
  };

  // Function to handle item press and navigate to the details
  const handleItemPress = (itemId) => {
    const selectedItem = items.find(item => item.items_id === itemId);
    
    if (selectedItem) {
      navigation.navigate('ItemDetails', {
        categoryId: selectedItem.category_id, // Assuming there's a category_id property
        itemId: selectedItem.items_id // Pass any additional data you may need
      });
    }
  };

  useEffect(() => {
    // fetchData();
    // setButtonVisible(true);
    // setQuantities([]);
  }, [isFavouriteButton]);

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
    await fetch(`${Domain}/api/add-favorites?items_id=${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${value}`,
        "Content-Type": "application/json",
      },
    });

    // Toggle favorite state locally
    setFavoriteItems((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],  // Toggle the favorite status
    }));

    Alert.alert("Alert", "Added to Favorite Tab", [{ text: "OK", style: "default" }]);

  } catch (error) {
    console.error("Error", error);
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

  // const renderData = searchText ? searchResults : dataItems;

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
    const renderData = selectedCategory ? filteredData : []; // Show 
  return (
  <ScrollView>
      <View style={styles.mainContainer}>
      <SearchBox setSearchText={setSearchText} onPress={Search} />
      {/* Displaying the list of categories outside of the dropdown */}
      {showCategories && (  // Show category list only if showCategories is true
        <View> 
        <Text style={styles.texttt}>All List Of Category</Text>
      <View style={styles.categoryListContainer}>
      
      {categories.map(category => (
        <TouchableOpacity
          key={category.category_id}
          onPress={() => handleCategoryChange(category.category_id)}
          style={[
            styles.categoryItem,
            selectedCategory === category.category_id && styles.activeCategory
          ]}
        >
          <Text style={styles.categoryItemText}>{category.category}</Text>
        </TouchableOpacity>
      ))}
    </View>
    </View>
    )}
    {!showCategories && ( // When a category is selected, show the dropdown and items
        <View>
     {/* Back button to show all categories */}
     {selectedCategory && selectedCategory !== 'all' && (
      <TouchableOpacity
        onPress={() => {
          setShowCategories(true); // Show categories again
          setSelectedCategory(null); // Reset selected category
        }}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    )}
      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={handleCategoryChange}
        style={styles.picker}
        dropdownIconColor="#00C9E9" // This option can define the dropdown icon color if supported
      >
        <Picker.Item label="Select a category..." value={null} />
        {categories.map(category => (
          <Picker.Item
            key={category.category_id}
            label={category.category}
            value={category.category_id}
          />
        ))}
      </Picker>

      <View style={styles.iconContainer}>
        <MaterialIcons name="arrow-drop-down" size={50} color="#00C9E9" />
      </View>
    </View>
     
    </View>
      )}
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
      {loading ? (
        <View style={styles.loadingContainer}>
          // <Text style={styles.loadingText}>Loading....</Text>
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
    backgroundColor: "#00C9E9", // Button background color
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
  pickerContainer: {
    borderColor: '#00C9E9',
    borderWidth: 2,
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden', // Ensures rounded corners are applied
    position: 'relative', // Needed for absolute positioning
    marginRight:10,
    marginLeft:10,
    marginVertical:16
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    top: 0, // Adjust this to reposition the icon correctly
    zIndex: 1, // Ensures the icon is above the Picker
  },
  picker: {
    height: 50, // Adjust the height as needed
    width: '100%',
    fontSize: 18,  // Set the base font size
    color: 'gray',  // Placeholder and default text color
  },
  categoryListContainer: {
    marginVertical: 10,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to start (left)
    flexWrap: 'wrap', // Allow items to wrap to the next line
  },
  categoryItem: {
    width:'48%',
    fontSize: 16,
    paddingVertical: 14,
    borderWidth:2,
    padding:12,
    margin:2,
    borderRadius:4,
    borderColor: '#ccc', // Default border color
    textAlign: 'center',
  },
  texttt: {
    fontSize: 20,
    marginVertical:20,
    padding:5,
    fontWeight:'600',
    // color:'#00C9E9'
  },
  activeCategory: {
    borderColor: '#00C9E9', // Highlight border color for active category
  },
  backButton: {
    backgroundColor: '#00C9E9', // Adjust color based on your theme
    padding: 6,
    // borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width:'20%',
    margin:10
  },
  backButtonText: {
    color: '#ffffff', // Text color for the back button
    fontSize: 16,
    fontWeight: 'bold', // Bold text for emphasis
    textAlign:'center'
  },
});
