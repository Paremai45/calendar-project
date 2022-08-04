import { KeyboardAvoidingView, Platform, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import TextInput from "react-native-text-input-interactive";
import { useState } from 'react';
import { RootStackScreenProps } from '../../types';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import Loader from '../../components/Loader';
import PopupModal from '../../components/Popup'
import { Base64 } from 'js-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const [isEmailEmpty, setEmailEmpty] = useState(false)
  const [isPasswordEmpty, setPasswordEmpty] = useState(false)
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [isSecureTextEntry, setSecureTextEntry] = useState(true)
  const [isShowedPopup, setShowedPopup] = useState(false);
  const [isShowedToast, setShowedToast] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [isInValidEmail, setInValidEmail] = useState(false);
  const [isEmailValid, setEmailValid] = useState(false)
  const [isPasswordValid, setPasswordValid] = useState(false)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [titlePopup, setTitlePopup] = useState("");
  const [messagePopup, setMessagePopup] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const invalidEmailMessage = "อีเมลล์ไม่ถูกฟอร์แมต"
  const emptyMessage = "จำเป็นต้องกรอก"

  const validateEmail = () => {
    if (email.length == 0) {
      setEmailEmpty(true)
      setEmailValid(false)
    } else {
      setEmailEmpty(false)
      setEmailValid(false)
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(email) === false) {
        setInValidEmail(true)
      } else {
        setInValidEmail(false)
        setEmailValid(true)
        setButtonDisabled(!(
          isEmailValid &&
          isPasswordValid))
      }
    }
  }

  const validatePassword = () => {
    if (password.length == 0) {
      setPasswordEmpty(true)
      setPasswordValid(false)
    } else {
      setPasswordEmpty(false)
      setPasswordValid(true)
      setButtonDisabled(!(
        isEmailValid &&
        isPasswordValid))
    }
  }

  function onclickLoginButton() {
    // navigation.navigate('Home')
    setEmailEmpty(email.length == 0)
    setPasswordEmpty(password.length == 0)

    if (isEmailValid && isPasswordValid) {
      setLoading(true)
      try {
        fetch('https://calendar-mytime.herokuapp.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": email,
            "password": Base64.encode(password)
          })
        })
          .then((response) => response.json())
          .then((json) => {
            let code = json.code
            let message = json.message
            console.log(json)
            if (code == 200 && message == "success") {
              console.log("login success")
              setLoading(false)
              try {
                AsyncStorage.setItem(
                  '@Login',
                  JSON.stringify({ isLogin: true })
                );
              } catch (error) {
                // Error saving data
              }
              setTimeout(function () {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }, 100);
            } else if (code == 200 && message == "passwordIncorrect") {
              setToastMessage("อีเมลล์หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
              setLoading(false);
              setShowedToast(true)
              setTimeout(function () {
                setShowedToast(false)
              }, 3000);
              console.log("password incorrect")
            } else if (code == 200 && message == "notexisting") {
              setToastMessage("ไม่พบอีเมลล์นี้ในระบบ โปรดลองอีกครั้ง")
              setLoading(false);
              setShowedToast(true)
              setTimeout(function () {
                setShowedToast(false)
              }, 3000);
              console.log("not existing")
            } else {
              setLoading(false);
              setShowedPopup(true)
              setTitlePopup("ขออภัยในความไม่สะดวก")
              setMessagePopup("เกิดข้อผิดพลาดจากทางเซิฟเวอร์ กรุณาลองอีกครั้ง")
              console.log("server error")
            }
          })
      } catch (error) {
        setLoading(false);
        setShowedPopup(true)
        setTitlePopup("ขออภัยในความไม่สะดวก")
        setMessagePopup("เกิดข้อผิดพลาดจากทางเซิฟเวอร์ กรุณาลองอีกครั้ง")
        console.error(error);
      }
    }
  }

  function onclickForgotPassword(navigation: any) {
    setEmailEmpty(false)
    setPasswordEmpty(false)
    navigation.navigate('ForgotPassword')
  }

  function onclickRegisterButton(navigation: any) {
    setEmailEmpty(false)
    setPasswordEmpty(false)
    navigation.navigate('Register')
  }

  return (
    <RootSiblingParent>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.container}>
            <Toast
              opacity={1.0}
              visible={isShowedToast}
              position={100}
              delay={100}
              animation={true}
              shadow={true}
              shadowColor='red'
              backgroundColor='red'
            >{toastMessage}</Toast>
            <Loader isLoading={isLoading} />
            <PopupModal open={isShowedPopup}
              onClose={() => {
                setShowedPopup(false)
              }}
              title={titlePopup}
              message={messagePopup}
              buttonTitle={"ตกลง"} />
            <Text style={styles.title}>แอพลิเคชั่นจัดการตารางเวลา</Text>
            <Text style={styles.secondSubTitle}>กิจกรรม ตารางเวลา การนัดหมาย</Text>
            <Text style={styles.secondSubTitle}>ให้แอพลิเคชั่นนี้ช่วยคุณ</Text>
            <Text style={styles.detailSubTitle}>เอาล่ะ ก่อนอื่น กรุณาล็อคอินหรือสมัครสมาชิกก่อนนะ</Text>
            <View style={styles.userNameView}>

              <TextInput
                originalColor={isInValidEmail || isEmailEmpty ? 'red' : ''}
                placeholder='อีเมลล์'
                animatedPlaceholderTextColor='#B2B1B9'
                onChangeText={(text: string) => { setEmail(text) }}
                returnKeyType='done'
                onBlur={() => validateEmail()}
                keyboardType='email-address'
                autoCorrect={false}
                spellCheck={false}
                textInputStyle={{ backgroundColor: '#f7f9fc' }}
                textContentType='emailAddress'
                onSubmitEditing={() => {
                  validateEmail()
                }} />
            </View>
            {isInValidEmail && <Text style={styles.errorText}>{invalidEmailMessage}</Text>}
            {isEmailEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

            <View style={styles.passwordView} >
              <TextInput
                originalColor={isPasswordEmpty ? 'red' : ''}
                placeholder='รหัสผ่าน'
                animatedPlaceholderTextColor='#B2B1B9'
                onChangeText={(text: string) => { setPassword(text) }}
                returnKeyType='done'
                secureTextEntry={isSecureTextEntry}
                enableIcon={true}
                iconImageSource={require("../../assets/images/visibility-button.png")}
                onIconPress={() => { setSecureTextEntry(!isSecureTextEntry) }}
                onBlur={() => validatePassword()}
                onSubmitEditing={() => validatePassword()}
                autoCorrect={false}
                spellCheck={false}
                textContentType='password'
                textInputStyle={{ backgroundColor: '#f7f9fc' }} />
            </View>
            {isPasswordEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

            <TouchableHighlight
              underlayColor={'transparent'}
              style={styles.forgotPasswordTouchable}
              onPress={() => onclickForgotPassword(navigation)}>
              <Text style={styles.forgotPasswordTextTouchable}>ลืมรหัสผ่าน?</Text>
            </TouchableHighlight>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => onclickLoginButton()}>
              <Text style={styles.loginText}>ล็อคอิน</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => onclickRegisterButton(navigation)}>
          <Text style={styles.registerText}>สมัครสมาชิก</Text>
        </TouchableOpacity>
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 25,
    bottom: 40,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    width: '35%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#B2B1B9',
    borderWidth: 1,
  },
  registerText: {
    color: '#B2B1B9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    top: 16,
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
  errorText: {
    fontSize: 10,
    top: 4,
    left: 36,
    color: 'red',
    alignSelf: 'flex-start'
  },
});
