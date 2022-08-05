
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useState } from 'react';
import { RootStackScreenProps } from '../../types';
import Toast from 'react-native-root-toast';
import Loader from '../../components/Loader';
import PopupModal from '../../components/Popup'
import { RootSiblingParent } from 'react-native-root-siblings';
import InteractiveTextInput from 'react-native-text-input-interactive';

export default function ForgotPasswordScreen({ navigation }: RootStackScreenProps<'ForgotPassword'>) {
  const [isLoading, setLoading] = useState(false);
  const [isShowedPopup, setShowedPopup] = useState(false);
  const [isShowedToast, setShowedToast] = useState(false);

  const [isEmailEmpty, setEmailEmpty] = useState(false)
  const [isMobileNoEmpty, setMobileNoEmpty] = useState(false)

  const [isInValidEmail, setInValidEmail] = useState(false);
  const [isEmailValid, setEmailValid] = useState(false)
  const [isMobileNoValid, setMobileNoValid] = useState(false)

  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  const [titlePopup, setTitlePopup] = useState("");
  const [messagePopup, setMessagePopup] = useState("");
  const invalidEmailMessage = "อีเมลล์ไม่ถูกฟอร์แมต"
  const emptyMessage = "จำเป็นต้องกรอก"

  const onclickRetreivePassword = () => {
    setEmailEmpty(email.length == 0)
    setMobileNoEmpty(mobileNo.length == 0)

    if (isEmailValid && isMobileNoValid) {
      setLoading(true)
      try {
        fetch('https://calendar-mytime.herokuapp.com/forgetPassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": email.toLowerCase(),
            "mobileNo": mobileNo
          })
        })
          .then((response) => response.json())
          .then((json) => {
            let code = json.code
            let message = json.message
            console.log(json)
            if (code == 200 && message == "success") {
              console.log("forgetPassword success")
              setLoading(false)
              setShowedToast(true)
              setTimeout(() => {
                setShowedToast(false)
              }, 10000);
            } else {
              setLoading(false);
              setShowedPopup(true)
              setTitlePopup("ไม่พบอีเมลล์หรือเบอร์โทรศัพท์")
              setMessagePopup("กรุณาตรวจสอบ อีเมลล์ หรือ เบอร์โทรศัพท์อีกครั้ง เมื่อถูกต้อง ระบบจะทำการส่งรหัสผ่านไปยังอีเมลล์ของคุณ")
              console.log("registration error")
            }
          })
      } catch (error) {
        setLoading(false);
        setShowedPopup(true)
        setTitlePopup("ขออภัยในความไม่สะดวก")
        setMessagePopup("เกิดข้อผิดพลาดจากทางเซิฟเวอร์ กรุณาลองอีกครั้ง")
        console.error(error);
      }
    } else {
      setLoading(false)
      console.log("Should input datas")
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
      } else {
        setInValidEmail(false)
        setEmailValid(true)
      }
    }
  }

  const validateMobileNo = () => {
    if (mobileNo.length == 0) {
      setMobileNoEmpty(true)
      setMobileNoValid(false)
    } else {
      setMobileNoEmpty(false)
      setMobileNoValid(true)
    }
  }

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <Toast
          opacity={1.0}
          visible={isShowedToast}
          position={10}
          delay={100}
          animation={true}
          shadow={true}
          shadowColor='#40BF11'
          backgroundColor='#40BF11'
        >ระบบส่งรหัสผ่านให้เรียบร้อยแล้ว กรุณาเช็คข้อความในอีเมลล์ของคุณ</Toast>
        <Loader isLoading={isLoading} />
        <PopupModal open={isShowedPopup}
          onClose={() => {
            setShowedPopup(false)
          }}
          title={titlePopup}
          message={messagePopup}
          buttonTitle={"ตกลง"} />
        <Text style={styles.title}>ลืมรหัสผ่าน</Text>
        <View style={styles.userNameView}>
          <InteractiveTextInput
            originalColor={isInValidEmail || isEmailEmpty ? 'red' : ''}
            placeholder='อีเมลล์'
            animatedPlaceholderTextColor='#B2B1B9'
            textInputStyle={{ backgroundColor: '#f7f9fc' }}
            returnKeyType='done'
            onBlur={() => validateEmail()}
            keyboardType='email-address'
            autoCorrect={false}
            spellCheck={false}
            onSubmitEditing={() => {
              validateEmail()
            }}
            onChangeText={(text: string) => { setEmail(text) }}
          />
        </View>
        {isInValidEmail && <Text style={styles.errorText}>{invalidEmailMessage}</Text>}
        {isEmailEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

        <View style={styles.passwordView} >
          <InteractiveTextInput
            originalColor={isMobileNoEmpty ? 'red' : ''}
            placeholder='เบอร์โทรศัพท์ที่ใช้ในการสมัครสมาชิก'
            animatedPlaceholderTextColor='#B2B1B9'
            onChangeText={(text: string) => {
              setMobileNo(text.replace(/[^0-9]/g, ''))
            }}
            returnKeyType='done'
            onBlur={() => validateMobileNo()}
            keyboardType='numeric'
            onSubmitEditing={() => validateMobileNo()}
            autoCorrect={false}
            spellCheck={false}
            textContentType='telephoneNumber'
            maxLength={10}
            value={mobileNo}
            textInputStyle={{ backgroundColor: '#f7f9fc' }} />
        </View>
        {isMobileNoEmpty && <Text style={styles.errorText}>{emptyMessage}</Text>}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => onclickRetreivePassword()}>
          <Text style={styles.registerText}>กู้คืนรหัสผ่าน</Text>
        </TouchableOpacity>
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: '50%'
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
    top: 32,
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
  },
  errorText: {
    fontSize: 10,
    paddingTop: 4,
    paddingLeft: 36,
    color: 'red',
    alignSelf: 'flex-start'
  },
});
