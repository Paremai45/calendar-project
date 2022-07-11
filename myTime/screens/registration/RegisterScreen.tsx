
import { StyleSheet, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Image } from 'react-native';
import { SetStateAction, useRef, useState } from 'react';
import { RootStackScreenProps } from '../../types';
import Loader from '../Loader';
import PopupModal from '../Popup'
import InteractiveTextInput from 'react-native-text-input-interactive';
import { Base64 } from 'js-base64';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
  const [isLoading, setLoading] = useState(false);
  const [isShowedPopup, setShowedPopup] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [isInValidEmail, setInValidEmail] = useState(false);
  const [isEmailEmpty, setEmailEmpty] = useState(false)
  const [isPasswordEmpty, setPasswordEmpty] = useState(false)
  const [isRepeatPasswordEmpty, setRepeatPasswordEmpty] = useState(false)
  const [isFirstNameEmpty, setFirstNameEmpty] = useState(false)
  const [isLastNameEmpty, setLastNameEmpty] = useState(false)
  const [isMobileNoEmpty, setMobileNoEmpty] = useState(false)
  const [isSecureTextEntry, setSecureTextEntry] = useState(true)
  const [isSecureTextEntryRepeat, setSecureTextEntryRepeat] = useState(true)

  const [isEmailValid, setEmailValid] = useState(false)
  const [isPasswordValid, setPasswordValid] = useState(false)
  const [isRepeatPasswordValid, setRepeatPasswordValid] = useState(false)
  const [isFirstNameValid, setFirstNameValid] = useState(false)
  const [isLastNameValid, setLastNameValid] = useState(false)
  const [isMobileNoValid, setMobileNoValid] = useState(false)

  const [data, setData] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const invalidEmailMessage = "อีเมลล์ไม่ถูกฟอร์แมต"
  const emptyMessage = "จำเป็นต้องกรอก"
  const [titlePopup, setTitlePopup] = useState("");
  const [messagePopup, setMessagePopup] = useState("");

  const onclickRegisterButton = async () => {
    setLoading(true)
    setShowedPopup(false)
    if (password == repeatPassword) {
      try {
        fetch('https://calendar-mytime.herokuapp.com/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "username": "paremai45",
            "data": {
              "email": email,
              "firstname": firstName,
              "lastname": lastName,
              "password": Base64.encode(password),
              "mobileNo": mobileNo
            }
          })
        })
          .then((response) => response.json())
          .then((json) => {
            let code = json.code
            let message = json.message
            console.log(json)
            if (code == 200 && message == "success") {
              console.log("registration success")
            } else if (code == 200 && message == "existing") {
              setShowedPopup(true)
              setTitlePopup("ขออภัยในความไม่สะดวก")
              setMessagePopup("อีเมลล์นี้ถูกใช้งานแล้ว กรุณาเลือกใช้อีเมลล์อื่น")
              console.log("registration existing")
            } else {
              setShowedPopup(true)
              console.log("registration error")
            }
            setLoading(false);
          })
      } catch (error) {
        setLoading(false);
        setTitlePopup("ขออภัยในความไม่สะดวก")
        setMessagePopup("เกิดข้อผิดพลาดจากทางเซิฟเวอร์ กรุณาลองอีกครั้ง")
        setShowedPopup(true)
        console.error(error);
      }
    } else {
      setShowedPopup(true)
      setLoading(false);
      setTitlePopup("รหัสผ่านผิดพลาด")
      setMessagePopup("กรุณากรอกรหัสผ่าน และ ยืนยันรหัสผ่านให้ตรงกัน")
    }
  }

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
      }
      else {
        setInValidEmail(false)
        setEmailValid(true)
        setButtonDisabled(!(
          isEmailValid &&
          isPasswordValid &&
          isRepeatPasswordValid &&
          isFirstNameValid &&
          isLastNameValid &&
          isMobileNoValid))
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
        isPasswordValid &&
        isRepeatPasswordValid &&
        isFirstNameValid &&
        isLastNameValid &&
        isMobileNoValid))
    }
  }

  const validateRepeatPassword = () => {
    if (repeatPassword.length == 0) {
      setRepeatPasswordEmpty(true)
      setRepeatPasswordValid(false)
    } else {
      setRepeatPasswordEmpty(false)
      setRepeatPasswordValid(true)
      setButtonDisabled(!(
        isEmailValid &&
        isPasswordValid &&
        isRepeatPasswordValid &&
        isFirstNameValid &&
        isLastNameValid &&
        isMobileNoValid))
    }
  }

  const validateFirstName = () => {
    if (firstName.length == 0) {
      setFirstNameEmpty(true)
      setFirstNameValid(false)
    } else {
      setFirstNameEmpty(false)
      setFirstNameValid(true)
      setButtonDisabled(!(
        isEmailValid &&
        isPasswordValid &&
        isRepeatPasswordValid &&
        isFirstNameValid &&
        isLastNameValid &&
        isMobileNoValid))
    }
  }

  const validateLastName = () => {
    if (lastName.length == 0) {
      setLastNameEmpty(true)
      setLastNameValid(false)
    } else {
      setLastNameEmpty(false)
      setLastNameValid(true)
      setButtonDisabled(!(
        isEmailValid &&
        isPasswordValid &&
        isRepeatPasswordValid &&
        isFirstNameValid &&
        isLastNameValid &&
        isMobileNoValid))
    }
  }

  const validateMobileNo = () => {
    if (mobileNo.length == 0) {
      setMobileNoEmpty(true)
      setMobileNoValid(false)
    } else {
      setMobileNoEmpty(false)
      setMobileNoValid(true)
      setButtonDisabled(!(
        isEmailValid &&
        isPasswordValid &&
        isRepeatPasswordValid &&
        isFirstNameValid &&
        isLastNameValid &&
        isMobileNoValid))
    }
  }

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: 'white' }}
      extraScrollHeight={50}>
      {/* <ScrollView contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        flexDirection: 'column',
      }}> */}
      <View style={styles.container}>
        <Loader isLoading={isLoading} />
        <PopupModal open={isShowedPopup}
          onClose={() => {
            setShowedPopup(false)
          }}
          title={titlePopup}
          message={messagePopup}
          buttonTitle={"ตกลง"} />
        <Text style={styles.title}>สมัครสมาชิก</Text>

        {/* Email */}
        <View style={styles.userNameView}>
          <InteractiveTextInput
            originalColor={isInValidEmail || isEmailEmpty ? 'red' : ''}
            placeholder='อีเมลล์'
            animatedPlaceholderTextColor='#B2B1B9'
            onChangeText={(text: string) => { setEmail(text) }}
            returnKeyType='done'
            onBlur={() => validateEmail()}
            keyboardType='email-address'
            autoCorrect={false}
            spellCheck={false}
            onSubmitEditing={() => {
              validateEmail()
            }}
            textInputStyle={{ backgroundColor: '#f7f9fc' }} />
        </View>
        {isInValidEmail && <Text style={styles.errorText}>{invalidEmailMessage}</Text>}
        {isEmailEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

        {/* Password */}
        <View style={styles.passwordView} >
          <InteractiveTextInput
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
            textInputStyle={{ backgroundColor: '#f7f9fc' }} />
        </View>
        {isPasswordEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

        {/* Repeat Password */}
        <View style={styles.passwordView} >
          <InteractiveTextInput
            originalColor={isRepeatPasswordEmpty ? 'red' : ''}
            placeholder='รหัสผ่านอีกครั้ง'
            animatedPlaceholderTextColor='#B2B1B9'
            onChangeText={(text: string) => { setRepeatPassword(text) }}
            returnKeyType='done'
            enableIcon={true}
            secureTextEntry={isSecureTextEntryRepeat}
            iconImageSource={require("../../assets/images/visibility-button.png")}
            onIconPress={() => { setSecureTextEntryRepeat(!isSecureTextEntryRepeat) }}
            onBlur={() => validateRepeatPassword()}
            onSubmitEditing={() => validateRepeatPassword()}
            autoCorrect={false}
            spellCheck={false}
            textInputStyle={{ backgroundColor: '#f7f9fc' }} />
        </View>
        {isRepeatPasswordEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

        {/* FirstName */}
        <View style={styles.passwordView} >
          <InteractiveTextInput
            originalColor={isFirstNameEmpty ? 'red' : ''}
            placeholder='ชื่อจริง'
            animatedPlaceholderTextColor='#B2B1B9'
            onChangeText={(text: string) => { setFirstName(text) }}
            returnKeyType='done'
            onBlur={() => validateFirstName()}
            onSubmitEditing={() => validateFirstName()}
            autoCorrect={false}
            spellCheck={false}
            textInputStyle={{ backgroundColor: '#f7f9fc' }} />
        </View>
        {isFirstNameEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

        {/* LastName */}
        <View style={styles.passwordView} >
          <InteractiveTextInput
            originalColor={isLastNameEmpty ? 'red' : ''}
            placeholder='นามสกุล'
            animatedPlaceholderTextColor='#B2B1B9'
            onChangeText={(text: string) => { setLastName(text) }}
            returnKeyType='done'
            onBlur={() => validateLastName()}
            onSubmitEditing={() => validateLastName()}
            autoCorrect={false}
            spellCheck={false}
            textInputStyle={{ backgroundColor: '#f7f9fc' }} />
        </View>
        {isLastNameEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

        {/* MobileNo */}
        <View style={styles.passwordView} >
          <InteractiveTextInput
            originalColor={isMobileNoEmpty ? 'red' : ''}
            placeholder='เบอร์โทรศัพท์ในการติดต่อ'
            animatedPlaceholderTextColor='#B2B1B9'
            onChangeText={(text: string) => { setMobileNo(text) }}
            returnKeyType='done'
            onBlur={() => validateMobileNo()}
            keyboardType='number-pad'
            onSubmitEditing={() => validateMobileNo()}
            autoCorrect={false}
            spellCheck={false}
            textInputStyle={{ backgroundColor: '#f7f9fc' }} />
        </View>
        {isMobileNoEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

        <TouchableOpacity
          style={isButtonDisabled ? styles.registerButtonDisabled : styles.registerButtonEnabled}
          disabled={isButtonDisabled}
          onPress={() => onclickRegisterButton()}>
          <Text style={styles.registerText}>สมัครสมาชิก</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>


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
    zIndex: 1
  },
  backbuttonImage: {
    width: 24,
    height: 24,
  },
  container: {
    top: 32,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
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
  registerButtonDisabled: {
    marginTop: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: '#FFFFFF',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonEnabled: {
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
  },
  errorText: {
    fontSize: 10,
    paddingTop: 4,
    paddingLeft: 36,
    color: 'red',
    alignSelf: 'flex-start'
  },
});
