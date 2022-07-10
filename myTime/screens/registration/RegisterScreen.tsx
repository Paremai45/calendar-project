
import { StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import TextInput from "react-native-text-input-interactive";
import { Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../../types';
import Loader from '../Loader';

export default function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const onclickRegisterButton = async () => {
    setLoading(true)
    console.log("onclickRegisterButton")
    try {
      fetch('http://192.168.1.46:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "username": "paremai45",
          "data": {
            "email": "phitchaporn.saw@gmail.com",
            "firstname": "Phitchaporn",
            "lastname": "Sawatdiluk",
            "password": "paremai45",
            "mobileNo": "0863172481"
          }
        })
      })
        .then((response) => response.json())
        .then((json) => {
          let code = json.code
          let message = json.code
          if (code == 200 && message == "success") {

          } else if (code == 200 && message == "existing") {

          } else {

          }
        })
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* <Image
        style={styles.loginImage}
        source={require('../assets/images/ic_login.png')}></Image> */}
      <Loader isLoading={isLoading} />
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => onclickBackButton(navigation)}>
          <Image
            style={styles.backbuttonImage}
            source={require('../../assets/images/ic_back.png')}>
          </Image>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>สมัครสมาชิก</Text>
      <View style={styles.userNameView}>
        <TextInput
          placeholder='อีเมลล์'
          animatedPlaceholderTextColor='#B2B1B9'
          onChangeText={(text: string) => { }} />
      </View>
      <View style={styles.passwordView} >
        <TextInput
          placeholder='รหัสผ่าน'
          animatedPlaceholderTextColor='#B2B1B9'
          onChangeText={(text: string) => { }} />
      </View>
      <View style={styles.passwordView} >
        <TextInput
          placeholder='รหัสผ่านอีกครั้ง'
          animatedPlaceholderTextColor='#B2B1B9'
          onChangeText={(text: string) => { }} />
      </View>
      <View style={styles.passwordView} >
        <TextInput
          placeholder='ชื่อจริง'
          animatedPlaceholderTextColor='#B2B1B9'
          onChangeText={(text: string) => { }} />
      </View>
      <View style={styles.passwordView} >
        <TextInput
          placeholder='นามสกุล'
          animatedPlaceholderTextColor='#B2B1B9'
          onChangeText={(text: string) => { }} />
      </View>
      <View style={styles.passwordView} >
        <TextInput
          placeholder='เบอร์โทรศัพท์ในการติดต่อ'
          animatedPlaceholderTextColor='#B2B1B9'
          onChangeText={(text: string) => { }} />
      </View>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => onclickRegisterButton()}>
        <Text style={styles.registerText}>สมัครสมาชิก</Text>
      </TouchableOpacity>
    </View>
  );
}

function onclickBackButton(navigation: any) {
  navigation.goBack()
}

const styles = StyleSheet.create({
  backButtonContainer: {
    top: 0,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    position: 'absolute',
    marginTop: 44,
    paddingLeft: 8,
    backgroundColor: 'transparent',
    width: 50,
    height: 30,
  },
  backbuttonImage: {
    width: 24,
    height: 24,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 12
  },
  userNameView: {
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  passwordView: {
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  forgotPasswordTouchable: {
    paddingTop: 8,
    paddingRight: 24,
    alignSelf: 'flex-end',
  },
  forgotPasswordTextTouchable: {
    color: '#4592AF',
  },
  registerButton: {
    marginTop: 24,
    borderRadius: 25,
    backgroundColor: '#413F42',
    color: '#FFFFFF',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  }
});
