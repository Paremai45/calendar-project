// @ts-nocheck
import { StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Button, StatusBar, Platform } from 'react-native';
import { Text, View } from '../../components/Themed';
import React, { Component } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Loader from '../../components/Loader';
import { RootStackScreenProps } from '../../types';
import moment from 'moment';
import TextInput from "react-native-text-input-interactive";
import DateTimePicker from 'react-native-modal-datetime-picker';

export default function AddEventScreen({ navigation }: RootStackScreenProps<'AddEvent'>) {
  return (
    <AddEventScreenClass navigation={navigation} />
  )
}

class AddEventScreenClass extends Component {
  constructor(props: any) {
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
      titleText: "",
      isDatePickerOpen: false,
      dateOnDatePicker: new Date(),
      timeSelected: ""
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
    this.props.navigation.pop()
  }

  validateTitle = () => {
    if (this.state.titleText.length == 0) {
      this.setState({ isTitleEmpty: true })
    } else {
      this.setState({ isTitleEmpty: false })
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
    this.setState({ timeSelected: date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1') })
    this.hideDatePicker();
  };

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
        <ScrollView
          style={{
            backgroundColor: 'white'
          }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            flexDirection: 'column'
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
                  originalColor={this.state.isTitleEmpty ? 'red' : ''}
                  placeholder='รายละเอียด'
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
              <View style={styles.time}>
                <TextInput
                  value={this.state.timeSelected}
                  editable={false}
                  originalColor={this.state.isTitleEmpty ? 'red' : ''}
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
            </View>
          </View>
        </ScrollView>
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
});