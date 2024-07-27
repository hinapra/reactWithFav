import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Domain } from "../../Domain";
import { useFocusEffect } from "@react-navigation/native";
import { orderApi } from "../../components/Types";
import ItemList from "../../components/ItemList";
// import { useNavigation } from '@react-navigation/native';

function Orders({ navigation }: { navigation: any }) {
  const [orderList, setOrderList] = useState<orderApi[]>([]);
  // const navigation = useNavigation();
  // const [selectedOrderListId, setSelectedOrderListId] = useState<number>();

  const getOrderListId = (id: number) => {
    // console.log("id", id);
    // setSelectedOrderListId(id);
    orderDetail(id);
  };

  const fetchData = async () => {
    const value = await AsyncStorage.getItem("my-key");
    // console.log("value", value);
    try {
      fetch(`${Domain}/api/get-order-list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${value}`,
          // "Content-Type": "application/json",
        },
      })
        .then((respo) => respo.json())
        .then((res) => {
          // console.log("Res", res);
          setOrderList(res);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const orderDetail = async (id: number) => {
    const value = await AsyncStorage.getItem("my-key");
    try {
      const formData = new FormData();
      // console.log("sele", id);
      formData.append("order_lists_id", String(id));
      await fetch(`${Domain}/api/get-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${value}`,
          // "Content-Type": "application/json",
        },
        body: formData,
      })
        .then((respo) => respo.json())
        .then((res) => {
          // console.log("orderDetail", res);
          navigation.navigate("OrderDetail", {
            data: res,
          });
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View>
      {/* <Text>Orders</Text> */}
      <FlatList
        data={orderList}
        keyExtractor={(item) => item.order_lists_id.toString()}
        renderItem={({ item }: { item: orderApi }) => (
          <ItemList
            item={item}
            getOrderListId={getOrderListId}
            // orderDetail={orderDetail}
          />
        )}
      />
    </View>
  );
}

export default Orders;
