import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '../../components/Themed';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { RootStackScreenProps } from '../../types';

export default function AddEventScreen({ navigation }: RootStackScreenProps<'AddEvent'>) {
  const [data, setData] = useState({})
  const [isMount, setMount] = useState(false)
  const [isDone, setDone] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.closeTextButton}
          onPress={() => { onclickClostButton() }}>
          <Image source={require("../../assets/images/ic_close.png")}
            style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      )
    });
  }, [navigation])

  useEffect(() => {
    async function fetchUser() {

    }
    fetchUser()
  }, [data])

  useEffect(() => {
    if (isDone) {
      setMount(true)
    }
  }, [isDone])

  if (!isMount) {

    // return (<View style={{ backgroundColor: 'white', flex: 1 }}></View>);
  }

  const onclickAddEventButton = () => {
    navigation.navigate('AddEvent')
  }

  const onclickClostButton = () => {
    navigation.pop()
  }

  return (
    <View style={styles.container}>
      <View style={styles.firstView}>
        <Calendar
          // Collection of dates that have to be marked. Default = {}
          markedDates={{
            '2022-07-16': { selected: true, marked: true, selectedColor: 'orange' },
            '2022-07-17': { marked: true },
            '2022-07-18': { marked: true, dotColor: 'red', activeOpacity: 0 },
            '2022-07-19': { disabled: true, disableTouchEvent: true }
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
    flex: 1,
  },
  firstView: {
    paddingTop: 0,
  },
  closeTextButton: {
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'
  },
  closeTest: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
