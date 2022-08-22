// @ts-nocheck
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Image, Linking, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import Loader from '../../components/Loader';
import { Component, useEffect, useState } from 'react';
import { RootStackScreenProps } from '../../types';
import UserAvatar from 'react-native-user-avatar';
import * as Notifications from 'expo-notifications'

export default function TabTwoScreen({ navigation }: RootStackScreenProps<'Home'>) {
  return (
    <TabTwoScreenClass navigation={navigation} />
  )
}

class TabTwoScreenClass extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      isNotificationOn: false,
      isRefreshing: false,
      data: {},

    }
  }

  componentDidMount() {
    this.fetchProfileData()
  }

  fetchProfileData = () => {
    if (!this.state.isRefreshing) {
      this.setState({ isLoading: true })
    }
    this.setState({ isNotificationOn: false })
    this.setState({ data: {} })
    AsyncStorage.getItem('@Email', (err, result) => {
      try {
        fetch('https://calendar-mytime.herokuapp.com/getProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": JSON.parse(result).email.toLowerCase()
          })
        })
          .then((response) => response.json())
          .then((json) => {
            let code = json.code
            let message = json.message
            if (code == 200 && message == "success") {
              console.log("get profile success")
              console.log(json.result)
              this.setState({ isLoading: false })
              this.setState({ isRefreshing: false })
              this.setState({ data: json.result })
              this.setState({ isNotificationOn: json.result.notification })
            } else {
              console.log("not found data")
              this.setState({ isLoading: false })
              this.setState({ isRefreshing: false })
            }
          })
      } catch (error) {
        console.log(error)
        this.setState({ isLoading: false })
        this.setState({ isRefreshing: false })
      }
    })
  }

  onclickLogout = () => {
    this.setState({ isLoading: true })
    setTimeout(() => {
      try {
        AsyncStorage.setItem(
          '@Login',
          JSON.stringify({ isLogin: false })
        );
        this.setState({ isLoading: false })
        setTimeout(() => {
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 100);
        console.log("logout success")
      } catch (error) {
        this.setState({ isLoading: false })
      }
    }, 2000);
  }

  onRefresh() {
    this.setState({ isRefreshing: true, }, () => { this.fetchProfileData(); });
  }

  getNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    return existingStatus
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: StatusBar.currentHeight }}>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
        />
        <ScrollView
          scrollEnabled={true}
          alwaysBounceVertical={true}
          showsVerticalScrollIndicator={false}
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
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 24, paddingLeft: 24 }}>
              <UserAvatar
                size={100}
                name={this.state.data.firstname + " " + this.state.data.lastname} bgColor={'rgba(140, 192, 222, 1)'} />
              <View style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: 24 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>{this.state.data.firstname}</Text>
                <Text style={{ fontSize: 18, paddingTop: 8, color: 'black' }}>{this.state.data.lastname}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 24, paddingLeft: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image source={require("../../assets/images/ic_phone.png")} style={{ width: 20, height: 20 }} />
                <Text style={{ fontSize: 18, color: 'grey', paddingLeft: 12 }}>{this.state.data.mobileNo}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 24 }}>
                <Image source={require("../../assets/images/ic_mail.png")} style={{ width: 20, height: 20 }} />
                <Text style={{ fontSize: 18, color: 'grey', paddingLeft: 12 }}>{this.state.data.email}</Text>
              </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>{this.state.data.allEventsAmount}</Text>
                <Text style={{ fontSize: 18, color: 'grey', paddingTop: 8 }}>กิจกรรมทั้งหมด</Text>
              </View>
              <View style={styles.separatorVertically} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
              <View style={{ flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>{this.state.data.allEventsPerDayAmount}</Text>
                <Text style={{ fontSize: 18, color: 'grey', paddingTop: 8 }}>กิจกรรมต่อวัน</Text>
              </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={{ paddingLeft: 32 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image source={require("../../assets/images/ic_notification.png")} style={{ width: 30, height: 30 }} />
                <Text style={{ fontSize: 18, fontWeight: '400', color: 'grey', paddingLeft: 20 }}>การแจ้งเตือน</Text>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 24 }}>
                  <Switch
                    value={this.state.isNotificationOn}
                    trackColor={{ false: "#767577", true: "orange" }}
                    thumbColor={'white'}
                    onValueChange={() => {
                      Linking.openSettings()
                      let myInterval = setInterval(async () => {
                        if (AppState.currentState == 'active') {
                          const existingStatus = await this.getNotificationPermission()
                          if (existingStatus === 'granted') {
                            this.setState({
                              isNotificationOn: true
                            })
                          } else {
                            this.setState({
                              isNotificationOn: false
                            })
                          }
                          clearInterval(myInterval)
                          this.setState({ isLoading: true })
                          AsyncStorage.getItem('@Email', (err, result) => {
                            try {
                              fetch('https://calendar-mytime.herokuapp.com/updateToggle', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  "email": JSON.parse(result).email.toLowerCase(),
                                  "notification": this.state.isNotificationOn
                                })
                              })
                                .then((response) => response.json())
                                .then((json) => {
                                  let code = json.code
                                  let message = json.message
                                  if (code == 200 && message == "success") {
                                    console.log("update toggle success")
                                    console.log(json.result)
                                    this.setState({ isLoading: false })
                                  } else {
                                    console.log("not found data")
                                    this.setState({ isLoading: false })
                                  }
                                })
                            } catch (error) {
                              console.log(error)
                              this.setState({ isLoading: false })
                            }
                          })
                        }
                      }, 100)
                    }}>
                  </Switch>
                </View>
              </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <TouchableOpacity onPress={() => this.onclickLogout()}>
              <View style={{ paddingLeft: 32 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Image source={require("../../assets/images/ic_shutdown.png")} style={{ width: 30, height: 30 }} />
                  <Text style={{ fontSize: 18, fontWeight: '400', color: 'black', paddingLeft: 20 }}>ออกจากระบบ</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
  separatorVertically: {
    height: '100%',
    width: 1,
  },
  logoutButton: {
    marginTop: 16,
    borderRadius: 25,
    backgroundColor: 'red',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
