// @ts-nocheck
import { FlatList, Image, Modal, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import { Component } from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import ActionButton from 'react-native-action-button';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import UserAvatar from 'react-native-user-avatar';

export default function HomeScreen({ navigation }: RootTabScreenProps<'HomeScreen'>) {
  return (
    <HomeScreenClass navigation={navigation} />
  )
}
class HomeScreenClass extends Component {
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
      eventsList: [],
      calendar: [],
      dateObjects: {},
      oldSelectedDate: "",
      currentDate: "",
      selectedDateOnClick: "",
      selectedDateShowing: "",
      isLoading: false,
      isEventsListEmpty: false,
      isRefreshing: false,
      detailModal: false,
      collaborators: ["RYU"],
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
    };
    // Handle dates
    let currentDate = moment().format("YYYY/MM/DD")
    this.state.currentDate = currentDate.split('/').join('-')
    this.state.selectedDate = moment().format("DD/MM/YYYY")
    this.state.selectedDateShowing = moment().format("DD/MM/YYYY")
  }

  componentDidMount() {
    this.fetchEvents()
  }

  fetchEvents = () => {
    // GET Calendar data
    console.log("get data")
    this.setState({ eventsList: [] })
    this.setState({ calendar: [] })
    this.setState({ dateObjects: {} })
    this.setState({ oldSelectedDate: "" })
    this.setState({ selectedDateOnClick: "" })
    this.setState({ isEventsListEmpty: false })
    if (!this.state.isRefreshing) {
      this.setState({ isLoading: true })
    }
    AsyncStorage.getItem('@Email', (err, result) => {
      try {
        fetch('https://calendar-mytime.herokuapp.com/getEvents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": JSON.parse(result).email.toLowerCase(),
            "selectedDate": this.state.currentDate
          })
        })
          .then((response) => response.json())
          .then((json) => {
            let code = json.code
            let message = json.message
            if (code == 200 && message == "success") {
              console.log("get events success")
              console.log(json)
              this.setState({ isLoading: false })
              this.setState({ isRefreshing: false })
              this.setState({ isEventsListEmpty: false })
              if (json.result.eventsList == undefined || Object.keys(json.result.eventsList).length === 0) {
                this.setState({ isEventsListEmpty: true })
              }
              this.setState({ eventsList: json.result.eventsList })
              this.setState({ calendar: json.result.calendar })

              var isCurrentDateExisting = false
              this.state.calendar.forEach((val) => {
                if (val.markedData == this.state.currentDate) {
                  isCurrentDateExisting = true
                  this.state.dateObjects[val.markedData] = {
                    selected: true,
                    selectedColor: 'pink',
                    dots: val.dots,
                  }
                } else {
                  this.state.dateObjects[val.markedData] = {
                    selected: val.selected,
                    selectedColor: val.selectedColor,
                    dots: val.dots,
                  }
                }
              })
              if (!isCurrentDateExisting) {
                this.state.dateObjects[this.state.currentDate] = {
                  selected: true,
                  selectedColor: 'pink'
                }
              }

              this.setState({ dateObjects: this.state.dateObjects })
            } else {
              console.log("not found data")
              this.setState({ isLoading: false })
              this.setState({ isRefreshing: false })
              this.setState({ isEventsListEmpty: true })
              this.state.dateObjects[this.state.currentDate] = {
                selected: true,
                selectedColor: 'pink'
              }
              this.setState({ dateObjects: this.state.dateObjects })
            }
          })
      } catch (error) {
        console.log("not found data. failed")
        this.setState({ isRefreshing: false })
        this.setState({ isLoading: false })
        this.setState({ isEventsListEmpty: true })
        this.state.dateObjects[this.state.currentDate] = {
          selected: true,
          selectedColor: 'pink'
        }
        this.setState({ dateObjects: this.state.dateObjects })
      }
    })
  }

  onclickItem = (item) => {
    console.log(item)
    this.setState({ detailModal: true })
  }

  onclickAddEventButton = () => {
    this.props.navigation.navigate('AddEvent', { callback: this.callback.bind(this) })
  }

  callback() {
    this.fetchEvents()
  }

  onclickDates = () => {
    console.log("selectedDateOnClick", this.state.selectedDateOnClick)
    this.setState({ eventsList: [] })
    this.setState({ isLoading: true })
    AsyncStorage.getItem('@Email', (err, result) => {
      try {
        fetch('https://calendar-mytime.herokuapp.com/getEventsByDate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": JSON.parse(result).email.toLowerCase(),
            "selectedDate": this.state.selectedDateOnClick
          })
        })
          .then((response) => response.json())
          .then((json) => {
            let code = json.code
            let message = json.message
            if (code == 200 && message == "success") {
              console.log("get events success")
              this.setState({ isLoading: false })
              this.setState({ isEventsListEmpty: false })
              this.setState({ calendar: json.result.calendar })
              this.setState({ eventsList: json.result.eventsList })
              this.state.calendar.forEach((val) => {
                this.state.dateObjects[val.markedData] = {
                  selected: val.selected,
                  selectedColor: val.selectedColor,
                  dots: val.dots,
                }
              })
              this.setState({ dateObjects: this.state.dateObjects })
              console.log(this.state.dateObjects)
            } else {
              console.log("not found data")
              this.setState({ isLoading: false })
              this.setState({ isEventsListEmpty: true })
            }
          })
      } catch (error) {
        console.log("not found data")
        this.setState({ isLoading: false })
        this.setState({ isEventsListEmpty: true })
      }
    })
  }

  onRefresh() {
    this.setState({ isRefreshing: true, }, () => { this.fetchEvents(); });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: StatusBar.currentHeight }}>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isRefreshing}
            />
          }
          style={{
            backgroundColor: 'white'
          }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          <View style={styles.container}>
            <Loader isLoading={this.state.isLoading} />
            <View>
              <Calendar
                hideExtraDays={true}
                markingType={'multi-dot'}
                markedDates={this.state.dateObjects}
                onDayPress={day => {
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
                    } else if (this.state.dateObjects[day.dateString] != undefined) {
                      this.state.dateObjects[day.dateString].selected = true
                    }

                    // Update
                    this.setState({ dateObjects: this.state.dateObjects })
                    this.setState({ oldSelectedDate: day.dateString })
                  } else {
                    if (this.state.oldSelectedDate != "") {
                      this.state.dateObjects[this.state.oldSelectedDate].selected = false
                    }
                    this.setState({ oldSelectedDate: "" })
                  }

                  if (this.state.dateObjects[day.dateString].selected) {
                    this.state.selectedDateShowing = moment(day.dateString).format("DD/MM/YYYY")
                    this.setState({ selectedDateShowing: moment(day.dateString).format("DD/MM/YYYY") })
                  } else {
                    this.state.selectedDateShowing = moment().format("DD/MM/YYYY")
                    this.setState({ selectedDateShowing: moment().format("DD/MM/YYYY") })
                  }

                  console.log("selectedDateShowing", this.state.selectedDate)
                  this.state.selectedDateOnClick = day.dateString
                  this.onclickDates()
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
            {this.state.isEventsListEmpty ?
              <View style={{ backgroundColor: '#f6f6f6', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={this.state.isRefreshing || this.state.isLoading ? require("../../assets/images/ic_loading.png") : require("../../assets/images/ic_empty.png")}
                  style={{ width: 120, height: 120 }} />
                {this.state.isRefreshing || this.state.isLoading ?
                  <Text style={{ fontSize: 16, marginLeft: 10, marginRight: 10, marginTop: 10 }}>กำลังโหลดข้อมูล</Text> :
                  <Text style={{ fontSize: 16, marginLeft: 10, marginRight: 10, marginTop: 10 }}>ไม่มีกิจกรรมใดๆ</Text>}

              </View> :
              <View style={{ backgroundColor: '#f6f6f6', flex: 1 }}>
                {this.state.isRefreshing || this.state.isLoading ?
                  <View style={{ backgroundColor: '#f6f6f6', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require("../../assets/images/ic_loading.png")}
                      style={{ width: 120, height: 120 }} />
                    <Text style={{ fontSize: 16, marginLeft: 10, marginRight: 10, marginTop: 10 }}>กำลังโหลดข้อมูล</Text>
                  </View> :
                  <View style={{ paddingBottom: 100, backgroundColor: '#f6f6f6' }}>
                    <View style={styles.headerItem}>
                      <Text style={styles.titleEvent}>กิจกรรมในวันที่ {this.state.selectedDateShowing}</Text>
                    </View>
                    {this.state.eventsList.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => this.onclickItem(item)}>
                          <View style={styles.item}>
                            <View style={styles.item_circle}></View>
                            <View style={styles.item_content}>
                              <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 4 }} >{item.title}</Text>
                              <Text style={{ fontSize: 13, fontWeight: "normal", color: 'grey' }} >{item.detail}</Text>
                            </View>
                            <View style={styles.item_time}>
                              <Text style={{ fontWeight: 'bold', color: "black" }}>{item.time} น.</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )
                    })}
                  </View>}
              </View>}
          </View>
        </ScrollView>
        <ActionButton
          buttonColor="rgba(140, 192, 222, 1)"
          shadowStyle={{ shadowColor: "rgba(140, 192, 222, 1)", }}
          onPress={() => { this.onclickAddEventButton() }}
        />
        <Modal
          transparent={true}
          animationType='slide'
          visible={true}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ detailModal: false })
            }}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBackground}>
            <View style={styles.popup}>
              <TouchableOpacity
                style={styles.closeTextButton}
                onPress={() => {
                  this.setState({ detailModal: false })
                }}>
                <Image source={require("../../assets/images/ic_close.png")}
                  style={{ width: 16, height: 16 }} />
              </TouchableOpacity>
              <View style={styles.popupDetail}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.popupItemCircle}></View>
                  <Text style={{ fontSize: 24, fontWeight: '500', paddingLeft: 16, paddingRight: 16 }}>ไปเที่ยววววววว</Text>
                </View>
                <View style={styles.avatarMembers_1}>
                  <Text style={styles.memberText}>ผู้มีส่วนร่วมในกิจกรรมนี้</Text>
                  {this.state.collaborators.length != 0 ?
                    <ScrollView
                      style={{ top: 4, left: 12 }}
                      showsHorizontalScrollIndicator={true}
                      horizontal={true}
                      contentContainerStyle={{
                        flexGrow: 1,
                        height: 50,
                        paddingRight: 12,
                      }}>
                      {this.state.collaborators.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => this.onclickName(item, index)}>
                            <UserAvatar
                              size={50}
                              style={{ marginLeft: -12, left: 12 }}
                              name={item}
                              bgColor={this.state.collaboratorColors[index]} />
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView> :
                    <Text style={{ color: 'red', marginLeft: 16, marginTop: 12 }}>ไม่มีผู้ร่วมกิจกรรมนี้</Text>}
                </View>
                <View style={styles.separator_1} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleEvent: {
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 10,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center'
  },
  item_circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'pink',
    marginLeft: 10,
  },
  item_content: {
    marginLeft: 16,
    flexDirection: 'column',
  },
  item_time: {
    marginLeft: 'auto',
    marginRight: 16,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  modalBackground: {
    marginTop: '60%',
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
    backgroundColor: 'transparent',
  },
  popup: {
    backgroundColor: '#FFFFFF',
    width: 1000,
    maxWidth: '100%',
    height: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    display: 'flex',
    alignItems: 'center',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 }, // change this for more shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: Platform.OS === 'ios' ? 0 : 20
  },
  closeTextButton: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    paddingTop: 20,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  popupDetail: {
    alignSelf: 'flex-start',
    paddingTop: 24,
    paddingLeft: 30,
  },
  popupItemCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'pink',
  },
  avatarMembers: {
    marginTop: 8,
    flexDirection: 'row'
  },
  avatarMembers_1: {
    left: -16,
    width: '70%'
  },
  separator_1: {
    top: 24,
    height: 1,
    width: 350,
  },
  addEventText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberText: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: '6%',
    fontWeight: '500',
    color: 'grey',
  },
});
