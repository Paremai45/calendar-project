// @ts-nocheck
import { FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import { Component } from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import ActionButton from 'react-native-action-button';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';

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
      calendarList: [],
      dateObjects: {},
      oldSelectedDate: "",
      currentDate: "",
      selectedDateOnClick: "",
      selectedDateShowing: "",
      isLoading: false,
      isEventsListEmpty: false
    };
    // Handle dates
    let currentDate = moment().format("YYYY/MM/DD")
    this.state.currentDate = currentDate.split('/').join('-')
    this.state.selectedDate = moment().format("DD/MM/YYYY")
  }

  componentDidMount() {
    // GET Calendar data
    console.log("get data")
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
            "selectedDate": this.state.currentDate
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
              if (json.result.eventsList == undefined) {
                this.setState({ isEventsListEmpty: true })
              }
              this.setState({ eventsList: json.result.eventsList })
              this.setState({ calendarList: json.result.calendarList })

              this.state.calendarList.forEach((calendarItem) => {
                this.state.dateObjects[calendarItem.markedData] = {
                  selected: calendarItem.selected,
                  selectedColor: calendarItem.selectedColor,
                  dots: calendarItem.dots
                }
              })

              this.setState({ dateObjects: this.state.dateObjects })
            } else {
              console.log("not found data")
              this.setState({ isLoading: false })
              this.setState({ isEventsListEmpty: true })
              this.state.dateObjects[this.state.currentDate] = {
                selected: true,
                selectedColor: 'pink'
              }
              this.setState({ dateObjects: this.state.dateObjects })
            }
          })
      } catch (error) {
        console.log("not found data")
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
  }

  onclickAddEventButton = () => {
    this.props.navigation.navigate('AddEvent')
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
              this.setState({ eventsList: json.result.eventsList })
            } else {
              console.log("not found data")
              this.setState({ isLoading: false })
              this.setState({ isEventsListEmpty: true })
              this.state.dateObjects[this.state.currentDate] = {
                selected: true,
                selectedColor: 'pink'
              }
              this.setState({ dateObjects: this.state.dateObjects })
            }
          })
      } catch (error) {
        console.log("not found data")
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

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
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
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader isLoading={this.state.isLoading} />
        <View style={styles.firstView}>
          <Calendar
            // Collection of dates that have to be marked. Default = {}
            // markedDates={{
            //   '2022-06-16': { selected: true, marked: true, selectedColor: 'blue' },
            //   '2022-06-17': { marked: true },
            //   '2022-06-18': { marked: true, dotColor: 'red', activeOpacity: 0 },
            //   '2022-06-19': { disabled: true, disableTouchEvent: true }
            // }}
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
                  this.state.dateObjects[day.dateString].selected = !this.state.dateObjects[day.dateString].selected
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
          {/* textHeaderColor: '#5463FF',
              textDefaultColor: '#9CB4CC',
              selectedTextColor: '#fff',
              mainColor: '#5463FF',
              textSecondaryColor: '#748DA6',
              borderColor: 'rgba(122, 146, 165, 0.1)', */}
        </View>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {this.state.isEventsListEmpty ?
          <View style={{ backgroundColor: '#f6f6f6', flex: 1, paddingTop: 60, alignItems: 'center' }}>
            <Image source={require("../../assets/images/ic_empty.png")}
              style={{ width: 120, height: 120 }} />
            <Text style={{ fontSize: 16, marginLeft: 10, marginRight: 10, marginTop: 40 }}>ไม่มีกิจกรรมใดๆ</Text>
          </View> :

          <View style={{ backgroundColor: '#f6f6f6', flex: 1 }}>
            <View style={styles.headerItem}>
              <Text style={styles.titleEvent}>กิจกรรมในวันที่ {this.state.selectedDateShowing}</Text>
            </View>
            <FlatList
              data={this.state.eventsList}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: 100 }} />
          </View>}
        <ActionButton
          buttonColor="rgba(140, 192, 222, 1)"
          shadowStyle={{ shadowColor: "rgba(140, 192, 222, 1)", }}
          onPress={() => { this.onclickAddEventButton() }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  firstView: {
    paddingTop: 44,
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
});
