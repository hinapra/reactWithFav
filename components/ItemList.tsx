import React, { memo, useState } from "react";
// import { ApiItem } from "../components/Types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import QuantityInput from "./QuantityInput";

import { ItemUnion } from "./Types";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "./Button";

interface ItemListProps {
  item: ItemUnion;
  addFavourite?: (id: number) => void;
  isFavourite?: Boolean;
  setVisibleModal?: React.Dispatch<React.SetStateAction<boolean>>;
  modalData?: (
    grade: string,
    category: string,
    rate: string,
    itemId: number
  ) => void;
  setQuantityValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  quantityValue: string | undefined;
  setShowPlaceOrderButton: React.Dispatch<React.SetStateAction<Boolean>>;
  // handleTextChange: (id: number, quantity: string, rate: string) => void;
  handleTextChange: (
    text: string,
    item_id: number,
    rate: string,
    index: number,
    grade: string
  ) => void;

  index: number;
  setFavourite: () => void;
  // checkQuantity: Boolean;
  getOrderListId?: (id: number) => void;
  orderDetail?: () => Promise<void>;
  textValues: string[];
}

function ItemList({
  item,
  addFavourite,
  isFavourite,
  setVisibleModal,
  modalData,
  setQuantityValue,
  quantityValue,
  setShowPlaceOrderButton,
  handleTextChange,
  index,
  setFavourite,
  getOrderListId,
  orderDetail,
  textValues,
}: ItemListProps) {
  if ("favorites_id" in item) {
    return (
      <View style={styles.listItem}>
        <View style={styles.container}>
          <View>
            <View style={styles.firstContainer}>
              <Text style={styles.sizeText}>{item.size}---</Text>
              <Text style={styles.sizeText}>{item.grade}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.priceText}>₹{item.rate}</Text>
            <QuantityInput
              item_id={item.items_id}
              rate={item.rate}
              grade={item.grade}
              setQuantityValue={setQuantityValue}
              handleTextChange={handleTextChange}
              index={index}
              textValues={textValues}
            />
          </View>
        </View>
      </View>
    );
  }
  if ("items_id" in item) {
    return (
      <View style={styles.listItem}>
        <View style={styles.container}>
          <View>
            <View style={styles.firstContainer}>
              <Text style={styles.sizeTextt}>{item.size}---</Text>
              <Text style={styles.sizeTextp}>{item.grade}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.categoryText}>{item.category}</Text>

              <View style={styles.iconContainer}>
                {addFavourite &&
                  !isFavourite &&
                  (item.favorites ? (
                    <MaterialIcons
                      name="favorite"
                      size={28}
                      color="red"
                      onPress={setFavourite}
                    />
                  ) : (
                    <MaterialIcons
                      name="favorite-outline"
                      size={28}
                      color="red"
                      onPress={() => addFavourite(item.items_id)}
                    />
                  ))}
              </View>
            </View>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.priceText}>₹{item.rate}</Text>
            {/* <QuantityInput
              item_id={item.items_id}
              rate={item.rate}
              grade={item.grade}
              setQuantityValue={setQuantityValue}
              quantityValue={quantityValue}
              setShowPlaceOrderButton={setShowPlaceOrderButton}
              handleTextChange={handleTextChange}
              index={index}
            /> */}
            <QuantityInput
              item_id={item.items_id}
              rate={item.rate}
              grade={item.grade}
              setQuantityValue={setQuantityValue}
              handleTextChange={handleTextChange}
              index={index}
              textValues={textValues}
            />
          </View>
        </View>
      </View>
    );
  }

  if ("order_count" in item) {
    const orderIdAndOrderDetail = async (id: number) => {
      // console.log("order", id);
      if (getOrderListId) {
        getOrderListId(id);
      }
    };

    return (
      <TouchableOpacity
      // onPress={() => orderIdAndOrderDetail(item.order_lists_id)}
      >
        <View style={styles.listItem}>
          {/* <View style={styles.orderContianer}>
            <Text style={styles.priceText}>
              {" "}
              Order Id: {item.order_lists_id}
            </Text>
          </View> */}
          <View style={styles.container}>
            <View style={styles.statusContainer}>
              <View style={styles.orderContianer}>
                <Text style={styles.priceText}>
                  Order Id : {item.order_lists_id}
                </Text>
              </View>
              <View>
                <View style={styles.firstContainer}>
                  {item.status === "pending" ? (
                    <View style={styles.statusColor} />
                  ) : (
                    <View style={styles.completeStatus} />
                  )}

                  <Text style={styles.sizeText}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.quantityContainer}>
              <Text style={styles.clientText}>
                Client Name : {item.client_name}
              </Text>
              <Text style={styles.priceText}>
                Number Of Orders:{item.order_count}
              </Text>
              {/* <Button
                title="View Details"
                onPress={() => orderIdAndOrderDetail(item.order_lists_id)}
                isOrderDetail
              /> */}
              <TouchableOpacity
      style={styles.button}
      onPress={() => orderIdAndOrderDetail(item.order_lists_id)}
    >
      <Text style={styles.buttonText}>View Details</Text>
    </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  if ("orders_id" in item) {
    // console.log("inside");
    return (
      <View style={styles.listItem}>
        <View style={styles.container}>
          <View>
            <View style={styles.firstContainer}>
              <Text style={styles.sizeText}>{item.make}---</Text>
              <Text style={styles.sizeText}>{item.grade}</Text>
            </View>
            <View>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.priceText}>₹{item.rate}</Text>
            <Text style={styles.datestyle}>{item.created_at}</Text>
          </View>
        </View>
      </View>
    );
  }
  return null;
}

export default memo(ItemList);

const styles = StyleSheet.create({
  listItem: {
    // margin: 8,
    marginVertical: 8,
    marginHorizontal: 8,
    // marginTop: 20,
    // padding: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderBottomWidth: 1,
    // borderBottomColor: "#b6b6b6",
    borderColor: "#b6b6b6",
    borderWidth: 1,
    backgroundColor: "#fff",
    // color: "white",
    overflow: "hidden",
  },
  statusContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  firstContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  sizeText: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    // marginLeft: -,
    marginBottom: 4,
    textAlign: "center",
  },
  sizeTextp: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    marginLeft: -14,
    marginBottom: 4,
  },
  sizeTextt: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    marginRight: 16,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 16,
    color: "#8f9aa3",
    fontWeight: "bold",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceText: {
    // fontWeight: "bold",
    fontSize: 18,
    marginBottom: -8,
    fontFamily: "Roboto-Regular",
  },
  clientText: {
    fontSize: 15,
    fontFamily: "Roboto-Regular",
  },
  quantityContainer: {
    alignItems: "flex-end",

    // justifyContent: "center",
    // marginBottom: 20,
    // marginTop: -20,
  },
  iconContainer: {
    marginLeft: 20,
  },
  datestyle: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: "Roboto-Regular",
  },
  statusColor: {
    height: 10,
    width: 10,
    backgroundColor: "red",
    borderRadius: 50,
  },
  completeStatus: {
    height: 10,
    width: 10,
    backgroundColor: "#097969",
    borderRadius: 50,
  },
  orderContianer: {
    // borderColor: "black",
    // borderRadius: 10,
    // borderWidth: 1,
    // width: 100,
    // paddingVertical: 8,
    // paddingHorizontal: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00C9E9', // Button background color
    padding: 10, // Padding inside the button
    borderRadius: 5, // Rounded corners
    alignItems: 'center', // Center the text inside the button
    marginVertical: 10, // Vertical margin
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16, // Text size
  },
});
