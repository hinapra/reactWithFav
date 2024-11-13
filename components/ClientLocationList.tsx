import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Location } from "../Screen/PlaceOrderScreen";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Domain } from "../Domain";

interface Props {
  // data: Location[];
  setToggleLocation: React.Dispatch<React.SetStateAction<boolean>>;
  clientId?: number;
}

function ClientLocationList({ setToggleLocation, clientId }: Props) {
  const [locationData, setLocationData] = useState<Location[]>([]);

  const clientLocationData = async () => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      const formData = new FormData();
      formData.append("client_id", String(clientId));
      // console.log("id", id);
      fetch(`${Domain}/api/get-location`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${'75|AHpOtoHsOiMJJRTPYbitDL2A56V0DdiCf6oMr7BT'}`,
        },
        body: formData,
      })
        .then((respo) => respo.json())
        .then((res) => {
          setLocationData(res);
          // console.log("client", res);
        });
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    clientLocationData();
  }, [clientId]);

  return (
    <View>
      <View style={styles.kk}>
        {/* <View style={styles.textContainer}>
          <Text style={styles.text}>Location</Text>
          <Entypo
            name="cross"
            size={28}
            color="#009688"
            onPress={() => setToggleLocation(false)}
          />
        </View> */}
        {locationData.length === 0 ? (
          <Text style={styles.dd}>Loading...</Text>
        ) : (
          locationData.map((value, idx) => (
            <View style={styles.dd} key={idx}>
              {/* <Text key={value.location_id}>{value.local_address}</Text> */}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

export default ClientLocationList;

const styles = StyleSheet.create({
  locationContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    // paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 10,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginLeft: 8,
    marginRight: 8,
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
  },
  locationInsideContainer: {
    borderWidth: 1,
    borderColor: "black",
    padding: 12,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
  },
  loadingText: {
    fontFamily: "Roboto-Italic",
    fontSize: 20,
  },
});
