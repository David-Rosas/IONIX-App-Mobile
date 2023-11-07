import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

import axiosConfig from '../../helpers/axiosConfig';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function register(email, username, password, confirmPassword) {
    if (name.length < 1) {
      Alert.alert('Please enter a name');
      return;
    }

    setIsLoading(true);
    axiosConfig
      .post('/user/register', {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        rol_id:2
      })
      .then(response => {
        Alert.alert('Usuario Creado! Por favor logearse.');
        navigation.navigate('Login Screen');

        setIsLoading(false);
        setError(null);
      })
      .catch(error => {
        console.log(error.response);
        const key = Object.keys(error.response.data.errors)[0];
        setError(error.response.data.errors[key][0]);
        setIsLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 70, width: 260 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={styles.logo}
            source={require('../../assets/taskinWhite.png')}
          />
        </View>
        <View style={{ marginTop: 0 }}>
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
          <TextInput
            style={[styles.inputBox, styles.mt4]}
            onChangeText={setName}
            value={name}
            placeholder="Name"
            placeholderTextColor="gray"
          />
          <TextInput
            style={[styles.inputBox, styles.mt4]}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="gray"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.inputBox, styles.mt4]}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="gray"
            autoCapitalize="none"
            secureTextEntry={true}
          />
          <TextInput
            style={[styles.inputBox, styles.mt4]}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor="gray"
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity
          onPress={() => register(email, username, password, confirmPassword)}
          style={[styles.loginButton, styles.mt5]}
        >
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="white"
              style={{ marginRight: 18 }}
            />
          )}
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 12,
          }}
        >
          <Text style={[styles.registerText]}>Ya tengo Una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login Screen')}>
            <Text style={styles.registerTextLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B3499',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 190,
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6C22',
    padding: 12,
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
  },
  registerText: {
    fontSize: 12,
  },
  registerTextLink: {
    fontSize: 12,
    color: 'white',
    textDecorationLine: 'underline',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  mt4: {
    marginTop: 16,
  },

  mt5: {
    marginTop: 22,
  },
});