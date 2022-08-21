/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
// @ts-nocheck
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Alert, ColorSchemeName, Platform, Pressable, TouchableHighlight, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { Text } from '../components/Themed';

import { initializeApp } from 'firebase/app';

// Screens
import LoginScreen from '../screens/registration/LoginScreen';
import RegisterScreen from '../screens/registration/RegisterScreen';
import ForgotPasswordScreen from '../screens/registration/ForgotPassword';
import HomeScreen from '../screens/home/HomeScreen';
import AddEventScreen from '../screens/home/AddEventScreen';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabTwoScreen from '../screens/home/TabTwoScreen';

const firebaseConfig = {
  apiKey: "AIzaSyCUalkZI-eB5Acz7Bk18Aa45YMEayCS0WA",
  authDomain: "calendar-88c48.firebaseapp.com",
  databaseURL: "https://calendar-88c48-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "calendar-88c48",
  storageBucket: "calendar-88c48.appspot.com",
  messagingSenderId: "115992841348",
  appId: "1:115992841348:web:a955dfc4e644d109b786d1"
};

initializeApp(firebaseConfig);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [isLogin, setLogin] = useState(false)
  const [isMount, setMount] = useState(false)
  const [isDone, setDone] = useState(false)

  // Notification
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const responseListener = useRef()

  useEffect(() => {
    async function fetchUser() {
      AsyncStorage.getItem('@Login', (err, result) => {
        if (result != null) {
          if (JSON.parse(result).isLogin) {
            console.log("Already Login")
            setLogin(true)
            setDone(true)
          } else {
            setLogin(false)
            setDone(true)
          }
        } else {
          setLogin(false)
          setDone(true)
        }
      })
    }
    fetchUser()
  }, [isLogin])

  useEffect(() => {
    // Notification
    registerForPushNotificationsAsync().then(token => {
      console.log(token)
      setExpoPushToken(token)
    })
  }, [])

  useEffect(() => {
    if (isDone) {
      setMount(true)
    }
  }, [isDone])

  async function registerForPushNotificationsAsync() {
    let token
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!')
        return
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
      try {
        AsyncStorage.setItem(
          '@NotiToken',
          JSON.stringify({ notiToken: token })
        );
      } catch (error) {
        // Error saving data
      }
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C'
      })
    }

    return token
  }

  if (!isMount) {
    return (<View style={{ backgroundColor: 'white', flex: 1 }}></View>);
  }
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isLogin ? <HomeRootNavigator /> : <LoginRootNavigator />}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function LoginRootNavigator() {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: "", headerShadowVisible: true, headerBackTitleVisible: false, headerTintColor: 'black' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: true, title: "", headerShadowVisible: true, headerBackTitleVisible: false, headerTintColor: 'black' }} />
      <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!', }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="AddEvent" component={AddEventScreen} options={{ headerShown: false, title: "", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: 'black' }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function HomeRootNavigator() {
  const CloseButton = () => {
    let test =
      <TouchableHighlight>
        <Text>Test</Text>
      </TouchableHighlight>
    return test
  }
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: "", headerShadowVisible: true, headerBackTitleVisible: false, headerTintColor: 'black' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: true, title: "", headerShadowVisible: true, headerBackTitleVisible: false, headerTintColor: 'black' }} />
      <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!', }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
        <Stack.Screen
          name="AddEvent"
          component={AddEventScreen}
          options={{
            headerShown: false,
            title: "",
            headerShadowVisible: true,
            headerBackTitleVisible: true,
            headerTintColor: 'black',
          }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false
      }}>
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'HomeScreen'>) => ({
          title: 'ปฏิทิน',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'โปรไฟล์',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -2 }} {...props} />;
}
