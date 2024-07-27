import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  onPress?: () => void;
  NewButton?: Boolean;
  isModalButton?: Boolean;
  isPlaceOrderButton?: Boolean;
  isOrderButton?: Boolean;
  isSearch?: Boolean;
  isOrderDetail?: Boolean;
}

function Button({
  title,
  onPress,
  NewButton,
  isModalButton,
  isPlaceOrderButton,
  isOrderButton,
  isOrderDetail,
  isSearch,
}: Props) {
  const buttonStyle =
    (NewButton && styles.newButton) ||
    (isOrderButton && styles.orderButtonContainer) ||
    (isSearch && styles.searchButtonContainer) ||
    (isModalButton && styles.modalButtonContainer) ||
    (isPlaceOrderButton && styles.placeOrderButton) ||
    (isOrderDetail && styles.orderDetailContainer) ||
    styles.appButtonContainer;
  const buttonTextStyle =
    (NewButton && styles.newButtonText) ||
    (isOrderButton && styles.orderText) ||
    (isSearch && styles.searchText) ||
    (isModalButton && styles.modalButtonText) ||
    (isPlaceOrderButton && styles.placeOrderText) ||
    (isOrderDetail && styles.orderDetailText) ||
    styles.appButtonText;
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

export default Button;

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "80%",
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  placeOrderButton: {
    position: "absolute",
    top: 8,
    // flex: 1,
    elevation: 8,
    backgroundColor: "#009688",
    // borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 12,
    width: "100%",
  },
  orderButtonContainer: {
    // flex: 1,
    elevation: 8,
    backgroundColor: "#009688",
    // borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 12,
    width: "100%",
  },
  orderDetailContainer: {
    elevation: 8,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#009688",
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: "100%",
  },
  searchButtonContainer: {
    elevation: 8,
    marginRight: 5,
    backgroundColor: "#009688",
    // borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    // width: "100%",
  },

  newButton: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 5,
    paddingVertical: 5,
    // paddingHorizontal: 1,
    width: "80%",
  },
  newButtonText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  placeOrderText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  orderText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  orderDetailText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  searchText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },

  modalButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "100%",
    marginTop: 20,
  },

  modalButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
