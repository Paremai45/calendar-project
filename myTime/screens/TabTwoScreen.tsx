import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Loader from '../components/Loader';
import { useState } from 'react';
import { RootStackScreenProps } from '../types';
import { CommonActions } from '@react-navigation/native';

export default function TabTwoScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const [isLoading, setLoading] = useState(false);

  const onclickLogout = () => {
    setLoading(true)
    setTimeout(() => {
      try {
        AsyncStorage.setItem(
          '@Login',
          JSON.stringify({ isLogin: false })
        );
        setLoading(false)
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 100);
        console.log("logout success")
      } catch (error) {
        setLoading(false)
      }
    }, 2000);
  }

  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading} />
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => onclickLogout()}>
        <Text style={styles.logoutText}>ล็อคเอาท์</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  logoutButton: {
    marginTop: 16,
    borderRadius: 25,
    backgroundColor: 'red',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
