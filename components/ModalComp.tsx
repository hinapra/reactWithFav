import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { OrderData } from "../Screen/BottomTabScreen/Items";
import Button from "./Button";
import { ApiClient } from "../Screen/BottomTabScreen/Clients";
import { Feather } from "@expo/vector-icons";
import QuantityInput from "./QuantityInput";

interface Props {
  visible: Boolean;
  setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
  orderData: OrderData | undefined;
  dataOfClient: ApiClient[];
}

function ModalComp({
  visible,
  setVisibleModal,
  orderData,
  dataOfClient,
}: 
Props) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const handleItemClick = (id: number) => {
    setSelectedItem(selectedItem === id ? null : id);
  };

  return (
    <Modal animationType="slide" transparent={true} visible>
      <View style={styles.mainContainer}>
        <View style={styles.modalContainer}>
          <TouchableOpacity>
            <Text
              style={styles.closeText}
              onPress={() => setVisibleModal(false)}
            >
              Close
            </Text>
          </TouchableOpacity>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{orderData?.grade}</Text>
            <Text style={styles.headerText}>{orderData?.category}</Text>
          </View>
          <View style={styles.hrLine} />
          <Text style={styles.subHeaderText}>Rate:{orderData?.rate}</Text>
          <View style={styles.clientContainer}>
            <Text style={styles.clientText}>Select Clients</Text>
            <View style={styles.listClientContainer}>
              {dataOfClient?.map((data) => (
                <TouchableOpacity
                  key={data.client_master_id}
                  onPress={() => handleItemClick(data.client_master_id)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.clientNameText}>
                      {data.client_name}
                    </Text>
                    {selectedItem === data.client_master_id && (
                      <Feather name="check" size={24} color="black" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ModalComp;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 15,
    width: "100%",
    height: "60%",
    borderRadius: 10,
  },
  closeText: {
    fontWeight: "bold",
  },
  hrLine: {
    height: 1,
    backgroundColor: "black",
    alignSelf: "stretch",
  },
  headerText: {
    fontSize: 20,
    marginBottom: 10,
  },
  headerContainer: {
    marginTop: 40,
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  RN: {
    flex: 1,
    width: "100%",
  },
  clientContainer: {
    marginTop: 20,
  },
  clientText: {
    fontSize: 20,
    marginBottom: 10,
  },
  listClientContainer: {
    borderWidth: 1,
    borderColor: "black",
    padding: 20,
  },
  clientNameText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
