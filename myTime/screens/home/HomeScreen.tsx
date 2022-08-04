import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import { Component, useEffect, useState } from 'react';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import ActionButton from 'react-native-action-button';

export default function HomeScreen({ navigation }: RootTabScreenProps<'HomeScreen'>) {
  return (
    <HomeScreenClass> {navigation} </HomeScreenClass>
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
      data: [
        { name: "ประชุมกับเพื่อน", isTitle: true, time: "16:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "Angular", isTitle: false, time: "8:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "ReactJS", isTitle: false, time: "8:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "VueJS", isTitle: false, time: "8:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "ReactNative", isTitle: false, time: "8:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "PHP Frameworks", isTitle: true, time: "8:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "Laravel", isTitle: false, time: "8:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "CodeIgniter", isTitle: false, time: "8:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "CakePHP", isTitle: false, time: "8:40", detail: "คุยเรื่องโปรเจกต์จบ" },
        { name: "Symfony", isTitle: false, time: "8:40", detail: "คุยเรื่องโปรเจกต์จบ" }
      ]
    };
  }

  onclickSeeAll = () => {
    console.log("onclickSeeAll")
  }

  onclickItem = (item) => {
    console.log(item)
  }

  onclickAddEventButton = () => {
    this.props.navigation.navigate('AddEvent')
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.onclickItem(item)}>
        <View style={styles.item}>
          <View style={styles.item_circle}></View>
          <View style={styles.item_content}>
            <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 4 }} >{item.name}</Text>
            <Text style={{ fontSize: 13, fontWeight: "normal", color: 'grey' }} >{item.detail}</Text>
          </View>
          <View style={styles.item_time}>
            <Text style={{ fontWeight: 'bold', color: (item.isTitle) ? "red" : "black" }}>{item.time} น.</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.firstView}>
          <Calendar
            // Collection of dates that have to be marked. Default = {}
            markedDates={{
              '2022-06-16': { selected: true, marked: true, selectedColor: 'blue' },
              '2022-06-17': { marked: true },
              '2022-06-18': { marked: true, dotColor: 'red', activeOpacity: 0 },
              '2022-06-19': { disabled: true, disableTouchEvent: true }
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
        <View style={{ backgroundColor: '#f6f6f6', flex: 1 }}>
          <View style={styles.headerItem}>
            <Text style={styles.titleEvent}>กิจกรรมในวันที่ 4/08/2022</Text>
            <TouchableOpacity
              style={styles.seeAll}
              onPress={() => this.onclickSeeAll()}>
              <Text style={{ color: 'grey', fontSize: 12 }}>ดูทั้งหมด</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={item => item.name} />
        </View>
        <ActionButton
          buttonColor="rgba(140, 192, 222, 1)"
          shadowStyle={{ shadowColor: "rgba(140, 192, 222, 1)", }}
          onPress={() => { this.onclickAddEventButton() }}
        />
      </View>
    );
    // return (<View style={{ backgroundColor: 'white', flex: 1 }}></View>);
  }
}

// class HomeScreenClass extends Component {
//   constructor(props: any) {
//     super(props);
//   }

//   render() {
//     return ();
//   }
// }

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
  seeAll: {
    marginLeft: 'auto',
    marginRight: 10,
    marginTop: 20,
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
