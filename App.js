import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const formatPhoneNumber = (number) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const matchedArray = cleaned.match(/(\d{1,3})(\d{1,3})(\d{1,4})?/);

    if (matchedArray) {
      return matchedArray.slice(1, 4).filter(Boolean).join(' ');
    }
    return number;
  };

  const handlePhoneChange = (text) => {
    setError('');
    const formattedNumber = formatPhoneNumber(text);
    setPhoneNumber(formattedNumber);
  };

  const validatePhoneNumber = (number) => {
    const regex = /^(\d{3} )?(\d{3} )?(\d{4})$/;
    return regex.test(number);
  };

  const handleContinue = async () => {
    if (validatePhoneNumber(phoneNumber)) {
      try {
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        navigation.navigate('Home');
      } catch (error) {
        Alert.alert("Lỗi", "Không thể lưu số điện thoại. Vui lòng thử lại.");
      }
    } else {
      setError('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.');
      Alert.alert(
        "Lỗi",
        "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.",
        [{ text: "OK", onPress: () => console.log("Alert closed") }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Đăng nhập</Text>
      </View>

      <Text style={styles.labelText}>Nhập số điện thoại</Text>
      <Text style={styles.bodyText}>
        Dùng số điện thoại để đăng nhập hoặc đăng ký tài khoản tại OneHousing Pro
      </Text>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        onChangeText={handlePhoneChange}
        value={phoneNumber}
        placeholder="Nhập số điện thoại của bạn"
        keyboardType="numeric"
        placeholderTextColor="#C4C4C4"
      />

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const HomeScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
        if (storedPhoneNumber) {
          setPhoneNumber(storedPhoneNumber);
        }
      } catch (error) {
        console.log('Không thể lấy số điện thoại từ AsyncStorage', error);
      }
    };

    fetchPhoneNumber();
  }, []);

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeText}>Số điện thoại đã đăng nhập:</Text>
      <Text style={styles.phoneText}>{phoneNumber}</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Đăng nhập' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  labelText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#555',
  },
  bodyText: {
    fontSize: 14,
    color: '#6c6c6c',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  homeText: {
    fontSize: 18,
    color: '#333',
  },
  phoneText: {
    fontSize: 20,
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default App;