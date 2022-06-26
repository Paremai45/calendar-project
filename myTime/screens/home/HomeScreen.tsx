import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import { Component } from 'react';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';


export default function HomeScreen({ navigation }: RootTabScreenProps<'HomeScreen'>) {
  return (
    <HomeScreenClass />
  );
}

class HomeScreenClass extends Component {
  constructor(props: any) {
    super(props);
  }

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
  }
});
