import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import PlaceOrderList from "../components/PlaceOrderList";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Domain } from "../Domain";
import { ApiClient } from "./BottomTabScreen/Clients";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

interface Data {
  grade: string;
  item_id: number;
  quantity: string;
  rate: string;
}

export interface Location {
  location_id: number;
  company_name: string;
  client_name: string;
  client_id: number;
  local_address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  created_at: string;
  updated_at: string;
}

function PlaceOrderScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const data: Data[] = route.params.data;
  const [dataOfClient, setDataofClient] = useState<ApiClient[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [dataOfLocation, setDataOfLocation] = useState<Location[]>([]);
  const [toggleRadioButtons, setToggleRadioButtons] = useState<{
    [key: number]: boolean;
  }>({});
  const [locationId, setLocationId] = useState<number | null>(null);
  // console.log("data", data);
  const modifiedArray: Omit<Data, "grade">[] = data.map(
    ({ grade, ...modifiedItem }) => modifiedItem
  );
  // console.log(modifiedArray);

  const clientData = async () => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      fetch(`${Domain}/api/get-client`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${'75|AHpOtoHsOiMJJRTPYbitDL2A56V0DdiCf6oMr7BT'}`,
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
 
  const clientLocationData = async (id: number, num: any) => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      fetch(`${Domain}/api/get-location`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${'75|AHpOtoHsOiMJJRTPYbitDL2A56V0DdiCf6oMr7BT'}`,
        },
      })
        .then((respo) => respo.json())
        .then((res) => {
          setDataOfLocation(res);
          // console.log("res", res);
        });
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    clientData();
    clientLocationData();
  }, []);

  const handleItemClick = (id: number) => {
    // Toggle the selected state for the clicked item
    // console.log("id", id);
    setSelectedItem(selectedItem === id ? null : id);
  };


  const handleOrder = async () => {
    const value = await AsyncStorage.getItem("my-key");
    // console.log(selectedItem);
    const jsonData = JSON.stringify(modifiedArray);

    try {
      const formData = new FormData();
      formData.append("data", jsonData);
      formData.append("client_id", String(selectedItem));
      formData.append(" location_id", String(locationId));
      if (selectedItem === null) {
        Alert.alert("Alert", "Please select a Client", [
          {
            text: "OK",
            style: "default",
          },
        ]);
      } 
       else {
        await fetch(`${Domain}/api/multiple-order-create`, {
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
            // console.log("Res", res);
            if (res.code === 200) {
              Alert.alert("Alert", "Order SucessFull", [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Orders"),
                  style: "default",
                },
              ]);
            }
          });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };
  const toggleRadioButton = (locationId: number) => {
    setToggleRadioButtons((prev) => ({
      ...prev,
      [locationId]: !prev[locationId],
    }));
    setLocationId(locationId);
  };

  const renderHeader = () => (
    <>
     <TouchableOpacity style={styles.button} onPress={handleOrder}>
      <Text style={styles.buttonText}>Purchase</Text>
    </TouchableOpacity>
      <View style={styles.clientContainer}>
        <Text style={styles.clientText}>Select Client</Text>
        <View style={styles.listClientContainer}>
          {dataOfClient.length === 0 ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            dataOfClient.map((data) => (
              <View key={data.client_master_id}>
                <TouchableOpacity
                  onPress={() => handleItemClick(data.client_master_id)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderWidth: 1,
                      borderColor: "black",
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 8,
                    }}
                  >
                    <Text style={styles.clientNameText}>{data.client_name}</Text>
                    {selectedItem === data.client_master_id && (
                      <Feather name="check" size={24} color="black" />
                    )}
                  </View>
                </TouchableOpacity>
                {selectedItem === data.client_master_id && (
                  <View style={{}}>
                    {/* <Text style={styles.loadingText}>Please select a client to view locations</Text> */}
                    {dataOfLocation.length === 0 ? (
                      <Text style={styles.loadingText}>Loading...</Text>
                    ) : (
                      dataOfLocation
                        .filter((location) => location.client_id === selectedItem)
                        .map((location) => (
                          <View
                            style={styles.locationMainContainer}
                            key={location.location_id}
                          >
                           
                            <View
                              key={location.location_id}
                              // style={styles.locationInsideContainer}
                            >
                              {/* <Text style={styles.locationText}>
                                {location.client_name}
                              </Text> */}
                              {/* <Text style={styles.locationText}>
                                {location.local_address}
                              </Text> */}
                            </View>
                          </View>
                        ))
                    )}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </View>
  
  

      {/* <FlatList
        data={data}
        keyExtractor={(item) => item.item_id.toString()}
        renderItem={({ item }) => <PlaceOrderList item={item} />}
      /> */}
    </>
  );

  return (
   <ScrollView>
     <FlatList
      ListHeaderComponent={renderHeader}
      data={data}
      keyExtractor={(item) => item.item_id.toString()}
      renderItem={({ item }) => <PlaceOrderList item={item} />}
    />
   </ScrollView>
  );
}

export default PlaceOrderScreen;

const styles = StyleSheet.create({
  clientContainer: {
    marginTop: 20,
    marginLeft: 5,
  },
  location: {
    marginTop: 20,
    marginLeft: 5,
  },
  clientText: {
    fontSize: 20,
    marginBottom: 10,
  },
  locationText: {
    fontFamily: "Roboto-Regular",
    flexShrink: 1,
  },
  loadingText: {
    fontFamily: "Roboto-Italic",
    fontSize: 18,
  },
  listClientContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "black",
    padding: 20,
    marginLeft: 2,
    marginRight: 2,
  },
  locationContainer: {
    // borderWidth: 1,
    // borderColor: "black",
    // borderRadius: 8,
    // paddingTop: 20,
    // paddingBottom: 20,
    // paddingLeft: 5,
    // paddingRight: 5,
    // marginLeft: 8,
    // marginRight: 8,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 0,
    marginBottom: 16,
    marginTop: 10,
  },
  locationInsideContainer: {
    // borderWidth: 1,
    // borderColor: "black",
    // padding: 10,

    // borderRadius: 5,

    // marginBottom: 10,
    flex: 1, // This will make the container take up all available space
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  locationMainContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButton: {
    marginRight: 10,
  },
  clientNameText: {
    fontSize: 15,
    fontWeight: "500",
  },
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
