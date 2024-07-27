import React from "react";
import { Text, View, FlatList } from "react-native";
import { OrderDetailData } from "../components/Types";
import ItemList from "../components/ItemList";

// interface OrderDetailData {
//   orders_id: number;
//   code: string;
//   grade: string;
//   make: string;
//   rate: string;
//   order_lists_id: number;
//   qauntity: number;
//   total: string;
//   status: string;
//   category: string;
//   broker_id: number;
//   item_id: number;
//   created_at: string;
// }

function OrderDetailScreen({ route }: { route: any }) {
  const data: OrderDetailData[] = route?.params?.data;
  // console.log("OrderData", data);
  return (
    <View>
      {/* <Text>OrderDetailScreen</Text> */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.orders_id.toString()}
        renderItem={({ item }: { item: OrderDetailData }) => (
          <ItemList
            item={item}

            // orderDetail={orderDetail}
          />
        )}
      />
    </View>
  );
}

export default OrderDetailScreen;
