import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Domain } from '../Domain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemList from '../components/ItemList';

const ItemDetails = ({ navigation, route }) => {
  const { categoryId } = route.params || {}; // Get categoryId safely
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      console.error('No categoryId provided.');
      setLoading(false);
      return;
    }

    console.log("Fetching items for categoryId:", categoryId); // Debugging

    // Fetch items by category when component mounts
    const fetchItemsByCategory = async () => {
      try {
        const token = await AsyncStorage.getItem("my-key");
        const response = await fetch(`${Domain}/api/get-item?category_id=${categoryId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        // Check if response data is an array
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error('Expected an array but received:', data);
          setItems([]); // Empty array in case of unexpected response
        }
      } catch (error) {
        console.error("Error fetching items by category:", error);
        setItems([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchItemsByCategory();
  }, [categoryId]); // Run only when categoryId changes

  // Handle item press
  const handleItemPress = (item) => {
    // Navigate to a new screen when an item is clicked, for example, `ItemDetailScreen`
    navigation.navigate('ItemDetailScreen', { itemId: item.items_id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C9E9" />
        <Text>Loading items...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.noItemsContainer}>
        <Text>No related items found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Related Items in Category</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.items_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <ItemList item={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItemDetails;
