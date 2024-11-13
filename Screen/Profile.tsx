import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginScreenNavigationProp } from '../App';
import { Domain } from "../Domain";

  function Profile() {
    const [email, setEmail] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const navigation = useNavigation<LoginScreenNavigationProp>();
    // Fetch user email from AsyncStorage and set it to state variable 'email' when component mounts.
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const storedEmail = await AsyncStorage.getItem('email');
          const storedName = await AsyncStorage.getItem('name');
  
          if (storedEmail) {
            setEmail(storedEmail);
          } else {
            Alert.alert('Info', 'No email found. Please log in again.');
          }
  
          if (storedName) {
            setName(storedName);
          } else {
            Alert.alert('Info', 'No name found. Please log in again.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to fetch user data.');
        }
      };
  
      fetchUserData();
    }, []);
  
  const handleLogout = async () => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('my-key');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'login' }], // Adjust route name to match your setup
        })
      );

      Alert.alert('Success', 'Logged out successfully.');
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Name:  {name || 'Loading...'}</Text>
      <Text style={styles.username}>Email:  {email || 'Loading...'}</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',

  },
  button: {
    backgroundColor: '#00C9E9',
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 14,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
