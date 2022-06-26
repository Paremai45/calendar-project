
import { StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import TextInput from "react-native-text-input-interactive";
import { Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../../types';

export default function ForgotPasswordScreen({ navigation }: RootStackScreenProps<'ForgotPassword'>) {
  return (
    <View style={styles.container}>
      {/* <Image
        style={styles.loginImage}
        source={require('../assets/images/ic_login.png')}></Image> */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => onclickBackButton(navigation)}>
          <Image
            style={styles.backbuttonImage}
            source={require('../../assets/images/ic_back.png')}>
          </Image>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>ลืมรหัสผ่าน</Text>
      <View style={styles.userNameView}>
        <TextInput
          placeholder='รหัสผู้ใช้งาน'
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
        <Text style={styles.registerText}>กู้คืนรหัสผ่าน</Text>
      </TouchableOpacity>
    </View>
  );
}

function onclickBackButton(navigation: any) {
  navigation.goBack()
}

function onclickRegisterButton() {
  console.log("onclickRegisterButton")
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
    backgroundColor: '#FF5D5D',
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
  }
});
