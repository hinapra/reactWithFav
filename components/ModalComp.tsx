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
  // setQuantityValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  orderData: OrderData | undefined;
  // quantityValue: number | undefined;
  // placeOrder: (
  //   itemId: number | undefined,
  //   rate: string | undefined,
  //   clientId: number | undefined,
  //   errorMessage?: string
  // ) => Promise<void>;
  dataOfClient: ApiClient[];
}

function ModalComp({
  visible,
  setVisibleModal,
  orderData,
  // quantityValue,
  // placeOrder,
  dataOfClient,
}: // setQuantityValue,
// quantityValue,
Props) {
  // console.log("orderData", quantityValue);

  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleItemClick = (id: number) => {
    // Toggle the selected state for the clicked item
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
            {/* <Text>{orderData?.itemId}</Text> */}
          </View>
          <View style={styles.hrLine} />
          {/* <Text style={styles.subHeaderText}>Quantity:{quantityValue}</Text> */}
          <Text style={styles.subHeaderText}>Rate:{orderData?.rate}</Text>
          {/* <QuantityInput
            setQuantityValue={setQuantityValue}
            quantityValue={quantityValue}
          /> */}
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

          {/* <Button
            title="Buy"
            onPress={() => {
              // Check if orderData is defined and itemId is not undefined
              if (
                orderData &&
                orderData.itemId !== undefined &&
                // quantityValue &&
                selectedItem
              ) {
                placeOrder(
                  orderData.itemId,
                  orderData.rate,
                  // quantityValue,
                  selectedItem
                );
              } else {
                placeOrder(
                  undefined!,
                  undefined!,
                  undefined!,
                  "orderData or itemId is undefined or selected client"
                );
              }
            }}
            // onPress={() =>
            //   placeOrder(orderData?.itemId, orderData?.rate, quantityValue)
            // }
            isModalButton
          /> */}
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
