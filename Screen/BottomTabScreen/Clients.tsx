import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Domain } from "../../Domain";
import SearchBox from "../../components/SearchBox";
import { Location } from "../PlaceOrderScreen";
import ClientLocationList from "../../components/ClientLocationList";

export interface ApiClient {
  client_master_id: number;
  client_name: string;
  cm_status: string;
  company_name: string;
  created_at: string;
  email: string;
  mobile: string;
}

function Clients() {
  const [clientData, setClientData] = useState<ApiClient[]>([]);
  const [searchResults, setSearchResults] = useState<ApiClient[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [dataOfLocation, setDataOfLocation] = useState<Location[]>([]);
  const [toggleLocation, setToggleLocation] = useState<boolean>(false);
  const [clientId, setClientId] = useState<number>();
  const fetchData = async () => {
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
          setClientData(res);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchData();
    // clientLocationData();
  }, []);

  const Search = async () => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      const url = `${Domain}/api/get-client?client=${searchText}`;
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

  const renderData = searchText ? searchResults : clientData;

  return (
    <View>
      <SearchBox setSearchText={setSearchText} onPress={Search} isClient />
      {renderData.map((data) => (
        <TouchableOpacity
          key={data.client_master_id}
          onPress={() => {
            setToggleLocation(toggleLocation => !toggleLocation);
            setClientId(data.client_master_id);
          }}
        >
          <View style={styles.mainContainer}>
            <View style={styles.clientInfo}>
            <Text style={styles.nameText}>{data.client_name}</Text>
              <Text style={styles.companyText}>{data.company_name}</Text>
              <Text style={styles.statusText}>{data.cm_status}</Text>
            </View>
            {toggleLocation && clientId === data.client_master_id && (
              <ClientLocationList
                // data={dataOfLocation}
                setToggleLocation={setToggleLocation}
                clientId={clientId}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};


export default Clients;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  clientInfo: {
    flexDirection: 'column',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyText: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    alignSelf: 'flex-end', // Float status text to the end
    marginTop: -20
  },
});

