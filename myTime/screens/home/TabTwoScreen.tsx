// @ts-nocheck
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import Loader from '../../components/Loader';
import { useEffect, useState } from 'react';
import { RootStackScreenProps } from '../../types';
import UserAvatar from 'react-native-user-avatar';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: StatusBar.currentHeight }}>
      <StatusBar
        backgroundColor="white"
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <Loader isLoading={isLoading} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 24, paddingLeft: 24 }}>
          <UserAvatar
            size={100}
            name="Preeyapol Owatsuwan" bgColor={'rgba(140, 192, 222, 1)'} />
          <View style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>Preeyapol</Text>
            <Text style={{ fontSize: 18, paddingTop: 8, color: 'black' }}>Owatsuwan</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 24, paddingLeft: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Image source={require("../../assets/images/ic_phone.png")} style={{ width: 20, height: 20 }} />
            <Text style={{ fontSize: 18, color: 'grey', paddingLeft: 12 }}>0939393151</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 24 }}>
            <Image source={require("../../assets/images/ic_mail.png")} style={{ width: 20, height: 20 }} />
            <Text style={{ fontSize: 18, color: 'grey', paddingLeft: 12 }}>preeyapol.owa@hotmail.com</Text>
          </View>
        </View>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column', alignItems: 'center', width: '50%' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>100</Text>
            <Text style={{ fontSize: 18, color: 'grey', paddingTop: 8 }}>กิจกรรมทั้งหมด</Text>
          </View>
          <View style={styles.separatorVertically} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <View style={{ flexDirection: 'column', alignItems: 'center', width: '50%' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>100</Text>
            <Text style={{ fontSize: 18, color: 'grey', paddingTop: 8 }}>กิจกรรมต่อวัน</Text>
          </View>
        </View>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={{ paddingTop: 16, paddingLeft: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Image source={require("../../assets/images/ic_notification.png")} style={{ width: 30, height: 30 }} />
            <Text style={{ fontSize: 18, fontWeight: '400', color: 'grey', paddingLeft: 20 }}>การแจ้งเตือน</Text>
          </View>
        </View>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <TouchableOpacity onPress={() => onclickLogout()}>
          <View style={{ paddingLeft: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Image source={require("../../assets/images/ic_shutdown.png")} style={{ width: 30, height: 30 }} />
              <Text style={{ fontSize: 18, fontWeight: '400', color: 'black', paddingLeft: 20 }}>ออกจากระบบ</Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
  separatorVertically: {
    height: '100%',
    width: 1,
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
