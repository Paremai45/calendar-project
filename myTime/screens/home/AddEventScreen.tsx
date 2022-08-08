// @ts-nocheck
import { StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, StatusBar, Platform, Modal, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../../components/Themed';
import React, { Component } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Loader from '../../components/Loader';
import { RootStackScreenProps } from '../../types';
import moment from 'moment';
import TextInput from "react-native-text-input-interactive";
import DateTimePicker from 'react-native-modal-datetime-picker';
import UserAvatar from 'react-native-user-avatar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddEventScreen({ navigation, route }: RootStackScreenProps<'AddEvent'>) {
  return (
    <AddEventScreenClass navigation={navigation} route={route} />
  )
}

class AddEventScreenClass extends Component {
  constructor(props) {
    super(props);
    LocaleConfig.locales.en = LocaleConfig.locales['']
    LocaleConfig.locales.fr = {
      monthNames: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤกษภาคม', 'มิถุนายน', 'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พฤ.ย.', 'ธ.ค.'],
      dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'],
      dayNamesShort: ['อ.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
    };
    LocaleConfig.defaultLocale = 'fr'
    this.state = {
      dateObjects: {},
      oldSelectedDate: "",
      currentDate: "",
      selectedDateOnClick: "",
      selectedDateShowing: "",
      isLoading: false,
      emptyText: "จำเป็นต้องกรอกช้อมูล",
      isTitleEmpty: false,
      isDetailEmpty: false,
      isTimeEmpty: false,
      titleText: "",
      detailText: "",
      isDatePickerOpen: false,
      dateOnDatePicker: new Date(),
      timeSelected: "",
      collaborators: [],
      collaboratorColors: ['red', 'orange', 'green',
        'blue', 'purple', '#0078AA',
        'black', '#ccaabb', 'pink',
        '#00798c', '#003d5b', '#d1495b',
        '#FFB3B3', '#C1EFFF', '#FFDBA4',
        '#FFB3B3', '#21E1E1', '#FF1E00',
        '#59CE8F', '#80558C', '#D1512D',
        'red', 'orange', 'green',
        'blue', 'purple', '#0078AA',
        'black', '#ccaabb', 'pink',
        '#00798c', '#003d5b', '#d1495b',
        '#FFB3B3', '#C1EFFF', '#FFDBA4',
        '#FFB3B3', '#21E1E1', '#FF1E00',
        '#59CE8F', '#80558C', '#D1512D',
        'red', 'orange', 'green',
        'blue', 'purple', '#0078AA',
        'black', '#ccaabb', 'pink',
        '#00798c', '#003d5b', '#d1495b',
        '#FFB3B3', '#C1EFFF', '#FFDBA4',
        '#FFB3B3', '#21E1E1', '#FF1E00',
        '#59CE8F', '#80558C', '#D1512D'],
      displayProfilePopup: false,
      displayAddCollaboratorPopup: false,
      nameCollaboratorInPopup: "",
      isNameCollaboratorInPopupEmpty: false,
      nameProfileSelected: "",
      colorProfileSelected: ""
    }
    // Handle dates
    let currentDate = moment().format("YYYY/MM/DD")
    this.state.currentDate = currentDate.split('/').join('-')
    this.state.selectedDateOnClick = currentDate.split('/').join('-')
    this.state.selectedDateShowing = moment().format("DD/MM/YYYY")
    this.state.dateObjects[this.state.currentDate] = {
      selected: true,
      selectedColor: 'pink'
    }
  }

  onclickCloseButton = () => {
    this.props.route.params.callback()
    this.props.navigation.pop()
  }

  validateTitle = () => {
    if (this.state.titleText.length == 0) {
      this.setState({ isTitleEmpty: true })
    } else {
      this.setState({ isTitleEmpty: false })
    }
  }

  validateDetail = () => {
    if (this.state.detailText.length == 0) {
      this.setState({ isDetailEmpty: true })
    } else {
      this.setState({ isDetailEmpty: false })
    }
  }

  validateTime = () => {
    if (this.state.timeSelected == 0) {
      this.setState({ isTimeEmpty: true })
    } else {
      this.setState({ isTimeEmpty: false })
    }
  }

  showDatePicker = () => {
    console.log("showDatePicker")
    this.setState({ isDatePickerOpen: true })
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerOpen: false })
  };

  handleConfirm = (date) => {
    console.log("A date has been picked: ", date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1'));
    this.state.timeSelected = date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')
    this.setState({ timeSelected: date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1') })
    this.hideDatePicker();
    this.validateTime()
  };

  onclickAddEventButton = () => {
    if (this.state.titleText.length == 0) {
      this.setState({ isTitleEmpty: true })
    }

    if (this.state.detailText.length == 0) {
      this.setState({ isDetailEmpty: true })
    }

    if (this.state.timeSelected == 0) {
      this.setState({ isTimeEmpty: true })
    }

    if (this.state.titleText.length != 0 && this.state.detailText.length != 0 && this.state.timeSelected.length != 0) {
      this.setState({ isLoading: true })
      AsyncStorage.getItem('@Email', (err, result) => {
        try {
          fetch('https://calendar-mytime.herokuapp.com/addevent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "email": JSON.parse(result).email.toLowerCase(),
              "selectedDate": this.state.selectedDateOnClick,
              "eventsList": {
                "title": this.state.titleText,
                "detail": this.state.detailText,
                "participants": this.state.collaborators,
                "time": this.state.timeSelected
              },
              "calendar": {
                "markedData": this.state.selectedDateOnClick,
                "selectedColor": "orange"
              }
            })
          })
            .then((response) => response.json())
            .then((json) => {
              let code = json.code
              let message = json.message
              if (code == 200 && message == "success") {
                console.log("add events success")
                console.log(json)
                this.setState({ isLoading: false })
                this.setState({ collaborators: [] })
                this.setState({ nameCollaboratorInPopup: "" })
                this.setState({ isNameCollaboratorInPopupEmpty: false })
                this.setState({ displayAddCollaboratorPopup: false })
                this.setState({ titleText: "" })
                this.setState({ detailText: "" })
                this.setState({ timeSelected: "" })
                this.setState({ isTitleEmpty: false })
                this.setState({ isDetailEmpty: false })
                this.setState({ isTimeEmpty: false })
                if (json.code == 200, json.message == "success") {
                  this.onclickCloseButton()
                }
              } else {
                console.log("not found data")
                this.setState({ isLoading: false })
              }
            })
        } catch (error) {
          console.log("not found data. failed")
          this.setState({ isRefreshing: false })
        }
      })
    }
  }

  onclickName = (name, index) => {
    console.log(name, index)
    this.setState({ nameProfileSelected: name })
    this.setState({ colorProfileSelected: this.state.collaboratorColors[index] })
    this.setState({ displayProfilePopup: true })
  }

  validateNameCollaboratorInPopup = () => {
    if (this.state.nameCollaboratorInPopup.length == 0) {
      this.setState({ isNameCollaboratorInPopupEmpty: true })
    } else {
      this.setState({ isNameCollaboratorInPopupEmpty: false })
    }
  }
  onclickAddCollaboratorInPopup = () => {
    console.log("onclickAddCollaboratorInPopup")
    this.validateNameCollaboratorInPopup()
    if (this.state.nameCollaboratorInPopup.length != 0) {
      this.state.collaborators.push(this.state.nameCollaboratorInPopup)
      this.setState({ collaborators: this.state.collaborators })
      this.setState({ nameCollaboratorInPopup: "" })
      this.setState({ isNameCollaboratorInPopupEmpty: false })
      this.setState({ displayAddCollaboratorPopup: false })
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: StatusBar.currentHeight }}>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
        />
        <TouchableOpacity
          style={styles.closeTextButton}
          onPress={() => { this.onclickCloseButton() }}>
          <Image source={require("../../assets/images/ic_close.png")}
            style={{ width: 16, height: 16 }} />
        </TouchableOpacity>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='always'
          style={{
            backgroundColor: 'white',
          }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            flexDirection: 'column',
            paddingBottom: 40,
          }}>
          <View style={styles.container}>
            <Loader isLoading={this.state.isLoading} />
            <View>
              <Calendar
                hideExtraDays={true}
                markingType={'multi-dot'}
                markedDates={this.state.dateObjects}
                onDayPress={day => {
                  console.log(this.state.selectedDateOnClick, day.dateString)
                  if (this.state.selectedDateOnClick == day.dateString) {
                    if (this.state.currentDate != day.dateString) {
                      if (this.state.dateObjects[this.state.selectedDateOnClick].selected) {
                        this.state.dateObjects[this.state.selectedDateOnClick].selected = false
                        this.state.dateObjects[this.state.currentDate].selected = true
                        this.setState({ selectedDateOnClick: this.state.currentDate })
                      } else {
                        this.state.dateObjects[this.state.selectedDateOnClick].selected = true
                        this.state.dateObjects[this.state.currentDate].selected = false
                        this.setState({ selectedDateOnClick: day.dateString })
                      }
                    } else {
                      this.state.dateObjects[this.state.currentDate].selected = true
                    }
                    this.setState({ dateObjects: this.state.dateObjects })
                  } else {
                    if (this.state.currentDate != day.dateString) {
                      if (this.state.oldSelectedDate != "") {
                        if (this.state.oldSelectedDate != day.dateString) {
                          this.state.dateObjects[this.state.oldSelectedDate].selected = false
                        }
                      }

                      if (this.state.dateObjects[day.dateString] == undefined) {
                        this.state.dateObjects[day.dateString] = {
                          selected: true,
                          selectedColor: 'orange',
                        }
                        this.state.dateObjects[this.state.currentDate].selected = false
                      } else if (this.state.dateObjects[day.dateString] != undefined) {
                        this.state.dateObjects[day.dateString].selected = true
                        this.state.dateObjects[this.state.currentDate].selected = false
                      }

                      // Update
                      this.setState({ dateObjects: this.state.dateObjects })
                      this.setState({ oldSelectedDate: day.dateString })
                    } else {
                      if (this.state.oldSelectedDate != "") {
                        this.state.dateObjects[this.state.oldSelectedDate].selected = false
                      }
                      this.state.dateObjects[this.state.currentDate].selected = true
                      this.setState({ oldSelectedDate: "" })
                    }

                    if (this.state.dateObjects[day.dateString].selected) {
                      this.state.selectedDateShowing = moment(day.dateString).format("DD/MM/YYYY")
                      this.setState({ selectedDateShowing: moment(day.dateString).format("DD/MM/YYYY") })
                    } else {
                      this.state.selectedDateShowing = moment().format("DD/MM/YYYY")
                      this.setState({ selectedDateShowing: moment().format("DD/MM/YYYY") })
                    }
                    this.state.selectedDateOnClick = day.dateString
                  }
                  console.log("selectedDateOnClick", this.state.selectedDateOnClick)
                }}
                theme={{
                  'stylesheet.day.basic': {
                    'selected': {
                      width: 40,
                      height: 40,
                      borderRadius: 20
                    },
                  }
                }}
              />
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={styles.headerItem}>
                <Text style={styles.titleEvent}>เพิ่มกิจกรรมในวันที่ {this.state.selectedDateShowing}</Text>
              </View>
              <View style={styles.title}>
                <TextInput
                  originalColor={this.state.isTitleEmpty ? 'red' : ''}
                  placeholder='หัวข้อกิจกรรม'
                  animatedPlaceholderTextColor='#B2B1B9'
                  onChangeText={(text: string) => { this.setState({ titleText: text }) }}
                  returnKeyType='done'
                  onBlur={() => this.validateTitle()}
                  autoCorrect={false}
                  spellCheck={false}
                  textInputStyle={{ backgroundColor: '#f7f9fc' }}
                  onSubmitEditing={() => { this.validateTitle() }} />
              </View>
              {this.state.isTitleEmpty && <Text style={styles.errorText}>{this.state.emptyText}</Text>}
              <View style={styles.title}>
                <TextInput
                  originalColor={this.state.isDetailEmpty ? 'red' : ''}
                  placeholder='รายละเอียด'
                  animatedPlaceholderTextColor='#B2B1B9'
                  onChangeText={(text: string) => { this.setState({ detailText: text }) }}
                  returnKeyType='done'
                  onBlur={() => this.validateDetail()}
                  autoCorrect={false}
                  spellCheck={false}
                  textInputStyle={{ backgroundColor: '#f7f9fc' }}
                  onSubmitEditing={() => { this.validateDetail() }} />
              </View>
              {this.state.isDetailEmpty && <Text style={styles.errorText}>{this.state.emptyText}</Text>}
              <View style={styles.time}>
                <TextInput
                  value={this.state.timeSelected}
                  editable={false}
                  originalColor={this.state.isTimeEmpty ? 'red' : ''}
                  placeholder='เวลา'
                  animatedPlaceholderTextColor='#B2B1B9'
                  textInputStyle={{ backgroundColor: '#f6f6f6', width: '85%' }}
                />
                <TouchableOpacity
                  style={{ justifyContent: 'center', right: 30 }}
                  onPress={this.showDatePicker}>
                  <Image source={require("../../assets/images/ic_time.png")}
                    style={{ width: 40, height: 40 }} />
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={this.state.isDatePickerOpen}
                  mode='time'
                  date={new Date()}
                  locale="th-TH"
                  confirmTextIOS='ยืนยัน'
                  cancelTextIOS='ยกเลิก'
                  minimumDate={new Date()}
                  onConfirm={this.handleConfirm}
                  onCancel={this.hideDatePicker}
                />
              </View>
              {this.state.isTimeEmpty && <Text style={styles.errorText}>จำเป็นต้องเลือกเวลา</Text>}
              <View style={styles.separator_1} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
              <Text style={styles.memberText}>เพิ่มผู้มีส่วนร่วมในกิจกรรม</Text>
              <View style={styles.avatarMembers}>
                <View style={styles.avatarMembers_1}>
                  {this.state.collaborators.length != 0 ?
                    <ScrollView
                      showsHorizontalScrollIndicator={true}
                      horizontal={true}
                      contentContainerStyle={{
                        flexGrow: 1,
                        height: 50,
                      }}>
                      {this.state.collaborators.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => this.onclickName(item, index)}>
                            <UserAvatar
                              size={50}
                              style={{ marginRight: 10 }}
                              name={item}
                              bgColor={this.state.collaboratorColors[index]} />
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView> :
                    <Text style={{ color: 'grey', flex: 1, alignSelf: 'center', marginTop: 10 }}>ยังไม่มีผู้มีส่วนร่วมในกิจกรรมนี้</Text>}
                </View>
                <TouchableOpacity
                  style={{ justifyContent: 'center', left: 10 }}
                  onPress={() => { this.setState({ displayAddCollaboratorPopup: true }) }}>
                  <Image source={require("../../assets/images/ic_add_member.png")}
                    style={{ width: 42, height: 42 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Modal
          transparent={true}
          animationType='fade'
          visible={this.state.displayProfilePopup}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ displayProfilePopup: false })
            }}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBackgroundCollaborator}>
            <View style={styles.popup}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >
                <UserAvatar
                  size={50}
                  name={this.state.nameProfileSelected}
                  bgColor={this.state.colorProfileSelected} />
                <Text style={{ fontSize: 22, paddingLeft: 8 }}> {this.state.nameProfileSelected}</Text>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          animationType='fade'
          visible={this.state.displayAddCollaboratorPopup}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ nameCollaboratorInPopup: "" })
              this.setState({ isNameCollaboratorInPopupEmpty: false })
              this.setState({ displayAddCollaboratorPopup: false })
            }}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBackground}>
            <View style={styles.popupCollaborator}>
              <Text style={{ alignSelf: 'center', fontWeight: '500', marginTop: 20, marginBottom: 20 }}>เพิ่มผู้มีส่วนร่วมในกิจกรรม</Text>
              <View
                style={{ flexDirection: 'row', marginLeft: 20 }}
              >
                <UserAvatar
                  size={50}
                  name={this.state.nameCollaboratorInPopup}
                  bgColor={this.state.collaboratorColors[this.state.collaborators.length]} />
                <TextInput
                  originalColor={this.state.isNameCollaboratorInPopupEmpty ? 'red' : ''}
                  placeholder='ชื่อผู้มีส่วนร่วมในกิจกรรม'
                  animatedPlaceholderTextColor='#B2B1B9'
                  onChangeText={(text: string) => { this.setState({ nameCollaboratorInPopup: text }) }}
                  returnKeyType='done'
                  autoCorrect={false}
                  spellCheck={false}
                  textInputStyle={{ backgroundColor: '#f7f9fc', width: '85%', marginLeft: 8 }}
                  onSubmitEditing={() => { this.validateNameCollaboratorInPopup() }} />
              </View>
              {this.state.isNameCollaboratorInPopupEmpty && <Text style={styles.errorTextInPopup}>{this.state.emptyText}</Text>}
              <TouchableOpacity
                style={styles.button}
                onPress={() => { this.onclickAddCollaboratorInPopup() }}>
                <Text style={styles.buttonTitle}>เพิ่ม</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.addEventButton}
          onPress={() => this.onclickAddEventButton()}>
          <Text style={styles.addEventText}>เพิ่มกิจกรรม</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  closeTextButton: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    marginTop: Platform.OS === 'ios' ? 0 : 16,
    justifyContent: 'center',
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleEvent: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    width: '100%',
  },
  separator_1: {
    marginTop: 12,
    height: 1,
    width: '90%',
  },
  title: {
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  time: {
    paddingTop: 12,
    left: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  errorText: {
    fontSize: 10,
    top: 4,
    paddingLeft: 36,
    color: 'red',
    alignSelf: 'flex-start'
  },
  errorTextInPopup: {
    fontSize: 10,
    top: 4,
    right: 24,
    color: 'red',
    alignSelf: 'center'
  },
  addEventButton: {
    marginTop: 12,
    borderRadius: 25,
    marginBottom: Platform.OS === 'ios' ? 0 : 16,
    backgroundColor: '#8CC0DE',
    width: '80%',
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addEventText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  avatarMembers: {
    marginTop: 8,
    flexDirection: 'row'
  },
  avatarMembers_1: {
    left: -16,
    width: '70%'
  },
  memberText: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: '6%',
    fontWeight: '500'
  },
  modalBackground: {
    marginTop: '75%',
    margin: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modalBackgroundCollaborator: {
    top: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    backgroundColor: '#FFFFFF',
    width: 300,
    height: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  popupCollaborator: {
    backgroundColor: '#FFFFFF',
    height: 210,
    width: '90%',
    borderRadius: 10,
    display: 'flex',
  },
  buttonTitle: {
    color: 'white',
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    backgroundColor: 'black',
    color: '#FFFFFF',
    width: 100,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});