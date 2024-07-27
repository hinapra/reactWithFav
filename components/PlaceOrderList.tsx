import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  item: {
    grade: string;
    item_id: number;
    quantity: string;
    rate: string;
  };
}

function PlaceOrderList({ item }: Props) {
  //   console.log("item", item);
  return (
    <View style={styles.listitem}>
      <View style={styles.contianer}>
        <View>
          <Text style={styles.qradeText}>{item.grade}</Text>
          <Text style={styles.rateText}>₹{item.rate}</Text>
        </View>
        <View>
          <Text style={styles.quantityText}>Quantity:{item.quantity}</Text>
        </View>
      </View>
    </View>
  );
}

export default PlaceOrderList;

const styles = StyleSheet.create({
  listitem: {
    margin: 8,
    // marginTop: 20,
    padding: 20,
    // borderRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#b6b6b6",
    backgroundColor: "#fff",
    // color: "white",
    overflow: "hidden",
  },
  contianer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qradeText: {
    fontSize: 22,
  },
  rateText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  quantityText: {
    fontSize: 18,
  },
});
