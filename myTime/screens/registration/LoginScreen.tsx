import { StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import TextInput from "react-native-text-input-interactive";
import { Image } from 'react-native';
import { useState } from 'react';
import { RootStackScreenProps } from '../../types';

export default function LoginScreen({ navigation }: RootStackScreenProps<'Root'>) {
  return (
    <View style={styles.container}>
      {/* <Image
        style={styles.loginImage}
        source={require('../assets/images/ic_login.png')}></Image> */}
      <Text style={styles.title}>แอพลิเคชั่นจัดการตารางเวลา</Text>
      <Text style={styles.secondSubTitle}>กิจกรรม ตารางเวลา การนัดหมาย</Text>
      <Text style={styles.secondSubTitle}>ให้แอพลิเคชั่นนี้ช่วยคุณ</Text>
      <Text style={styles.detailSubTitle}>เอาล่ะ ก่อนอื่น กรุณาล็อคอินหรือสมัครสมาชิกก่อนนะ</Text>
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
      <TouchableHighlight
        underlayColor={'transparent'}
        style={styles.forgotPasswordTouchable}
        onPress={() => onclickForgotPassword(navigation)}>
        <Text style={styles.forgotPasswordTextTouchable}>ลืมรหัสผ่าน?</Text>
      </TouchableHighlight>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => onclickRegisterButton(navigation)}>
        <Text style={styles.registerText}>สมัครสมาชิก</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => onclickLoginButton(navigation)}>
        <Text style={styles.loginText}>ล็อคอิน</Text>
      </TouchableOpacity>
    </View>
  );
}

function onclickForgotPassword(navigation: any) {
  navigation.navigate('ForgotPassword')
}

function onclickRegisterButton(navigation: any) {
  navigation.navigate('Register')
}

function onclickLoginButton(navigation: any) {
  navigation.navigate('Home')
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginImage: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 12
  },
  secondSubTitle: {
    color: '#1B2430',
    fontSize: 14,
    fontWeight: '500'
  },
  detailSubTitle: {
    paddingTop: 12,
    color: '#7F8487',
    fontSize: 12,
    fontWeight: 'normal'
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
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#B2B1B9',
    borderWidth: 1,
  },
  registerText: {
    color: '#B2B1B9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 25,
    backgroundColor: '#8CC0DE',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
