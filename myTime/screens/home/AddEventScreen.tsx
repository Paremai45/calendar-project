import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '../../components/Themed';
import React, { Component } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';

export default function AddEventScreen({ navigation }: RootTabScreenProps<'AddEvent'>) {
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
      data: [
        { name: "ประชุมกับเพื่อน", isTitle: true, time: "9:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "ประชุมกับพ่อ", isTitle: false, time: "10:40", detail: "คุยเรื่องเงิน" },
        { name: "ประชุมกับแม่", isTitle: false, time: "11:40", detail: "คุยเรื่องเรียน" },
        { name: "ประชุมกับอาจารย์", isTitle: false, time: "12:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "ประชุมกับอาจารย์ใหญ่", isTitle: false, time: "13:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "พูดคุยเล่นๆกับเพื่อนๆ", isTitle: true, time: "14:40", detail: "คุยเล่น" },
        { name: "นัดไปเที่ยวกับเพื่อน", isTitle: false, time: "15:40", detail: "ไปโรงหนัง" },
        { name: "นัดไปต่างจังหวัดกับเพื่อน", isTitle: false, time: "16:40", detail: "ไปเชียงใหม่" },
        { name: "ต้องไปกรุงเทพ", isTitle: false, time: "17:40", detail: "ไปหาของกินเล่น" },
        { name: "ต้องไปเชียงใหม่", isTitle: false, time: "18:40", detail: "ไปดูหมีแพนด้า" }
      ],
      calendarData: [
        {
          markedData: '2022-08-05',
          selected: true,
          selectedColor: 'pink',
          dots: [
            { key: 'vacation', color: 'red', selectedDotColor: 'red' },
            { key: 'massage', color: 'purple', selectedDotColor: 'purple' },
            { key: 'workout', color: 'black', selectedDotColor: 'black' }
          ]
        },
        {
          markedData: '2022-08-06',
          selected: false,
          selectedColor: 'orange',
          dots: [
            { key: 'vacation', color: 'red', selectedDotColor: 'red' },
            { key: 'massage', color: 'blue', selectedDotColor: 'blue' },
            { key: 'workout', color: 'green', selectedDotColor: 'green' }
          ]
        }
      ],
      dateObjects: {},
      oldSelectedDate: "",
    };
    this.state.calendarData.forEach((calendarItem) => {
      this.state.dateObjects[calendarItem.markedData] = {
        selected: calendarItem.selected,
        selectedColor: calendarItem.selectedColor,
        dots: calendarItem.dots
      }
    })
  }

  onclickCloseButton = () => {
    this.props.navigation.pop()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.firstView}>
          <TouchableOpacity
            style={styles.closeTextButton}
            onPress={() => { this.onclickCloseButton() }}>
            <Image source={require("../../assets/images/ic_close.png")}
              style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

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
                this.setState({ dateObjects: this.state.dateObjects })
              } else if (this.state.dateObjects[day.dateString] != undefined) {
                this.state.dateObjects[day.dateString].selected = !this.state.dateObjects[day.dateString].selected
                this.setState({ dateObjects: this.state.dateObjects })
              }
              this.setState({ oldSelectedDate: day.dateString })
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firstView: {
    paddingTop: 44,
  },
  closeTextButton: {
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
    marginLeft: 10,
    alignSelf: 'flex-start',
    alignItems: 'center'
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  separator: {
    height: 1,
    width: '100%',
  },
});
