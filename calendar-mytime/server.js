import express from "express";
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin'
import { createRequire } from "module"
import { Base64 } from "js-base64";
import moment from "moment";
import cors from "cors"
import fetch from "node-fetch";

// InitialApp
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Initial Firebase
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://calendar-88c48-default-rtdb.asia-southeast1.firebasedatabase.app",
};
admin.initializeApp(firebaseConfig)
// const firebase = initializeApp(firebaseConfig);
const database = admin.database()

// Endpoints
app.post("/login", (req, res) => {
  (async () => {
    let request = req.body
    let reqEmail = request.email
    let reqPassword = request.password
    console.log("request", request)
    try {
      const convertEmail = reqEmail.replaceAll('.', 'DOT')
      const ref = database.ref("users")
      const child = ref.child(convertEmail)
      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          let value = snapshot.val()
          let hashPassword = value.password
          if (hashPassword == reqPassword) {
            console.log("login success")
            return res.status(200).json({
              code: 200,
              message: 'success',
              result: {
                email: value.email,
                firstname: value.firstname,
                lastname: value.lastname,
                mobileNo: value.mobileNo
              }
            })
          } else {
            console.log("password incorrect")
            return res.status(200).json({
              code: 200,
              message: 'passwordIncorrect',
              result: null
            })
          }
        } else {
          return res.status(200).json({
            code: 200,
            message: 'notexisting',
            result: null
          })
        }
      }, (error) => {
        console.log(error)
        return res.status(500).json({
          code: 500,
          message: error.message,
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
});

app.post("/register", (req, res) => {
  (async () => {
    let request = req.body
    let data = request.data
    console.log("request", request)
    try {
      const convertEmail = data.email.replaceAll('.', 'DOT')
      const ref = database.ref("users")
      const child = ref.child(convertEmail)
      console.log(convertEmail)
      child.get().then((snapshot) => {
        console.log(snapshot.exists())
        if (snapshot.exists()) {
          console.log("response from Firebase" + snapshot.val())
          console.log("register existing")
          return res.status(200).json({
            code: 200,
            message: 'existing',
            result: null
          })
        } else {
          child.set({
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            password: data.password,
            mobileNo: data.mobileNo,
            notiToken: data.notiToken,
            notification: data.notification
          })
          console.log("register success")
          return res.status(200).json({
            code: 200,
            message: "success",
            result: null
          })
        }
      }, (error) => {
        console.log(error)
        return res.status(500).json({
          code: 500,
          message: error.message,
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
});

app.post("/forgetPassword", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("users")
      const child = ref.child(convertEmail)
      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          console.log("response from Firebase" + snapshot.val())
          let data = snapshot.val()
          let password = data.password
          if (request.mobileNo == data.mobileNo) {
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'calendarserviceapp@gmail.com',
                pass: 'hbsfnyactjjeonri'
              }
            });
            var mailOptions = {
              from: 'calendarserviceapp@gmail.com',
              to: request.email,
              subject: 'กู้รหัสผ่านของ Calendar แอพลิเคชั่น',
              text: 'รหัสผ่านของคุณคือ: ' + Base64.decode(password)
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
                return res.status(200).json({
                  code: 200,
                  message: error.message,
                  result: null
                })
              } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({
                  code: 200,
                  message: "success",
                  result: null
                })
              }
            });
          } else {
            console.log("data not match")
            return res.status(200).json({
              code: 200,
              message: "data not match",
              result: null
            })
          }
        } else {
          console.log("data not found")
          return res.status(200).json({
            code: 200,
            message: "not found",
            result: null
          })
        }
      }, (error) => {
        console.log("data not found")
        return res.status(200).json({
          code: 200,
          message: "not found",
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/addevent", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const selectedDate = request.selectedDate
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("events")
      const child = ref.child(convertEmail).child(selectedDate)
      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          let values = snapshot.val()
          let eventsList = values.eventsList
          let dotsCalendar = values.calendar.dots
          var newEventsList = []
          var newDotsCalendar = []
          eventsList.forEach((val) => {
            newEventsList.push(val)
          })
          dotsCalendar.forEach((val) => {
            newDotsCalendar.push(val)
          })

          newEventsList.push(request.eventsList)

          if (newDotsCalendar.length == 1) {
            newDotsCalendar.push(
              { "key": "massage", "color": "blue", "selectedDotColor": "blue" }
            )
          } else if (newDotsCalendar.length == 2) {
            newDotsCalendar.push(
              { "key": "workout", "color": "black", "selectedDotColor": "black" }
            )
          }

          child.set({
            eventsList: newEventsList,
            calendar: {
              markedData: request.calendar.markedData,
              selected: false,
              selectedColor: request.calendar.selectedColor,
              dots: newDotsCalendar
            }
          })
          console.log("add event success")
          return res.status(200).json({
            code: 200,
            message: "success",
            result: null
          })
        } else {
          console.log("data not found")
          child.set({
            eventsList: [request.eventsList],
            calendar: {
              markedData: request.calendar.markedData,
              selected: false,
              selectedColor: request.calendar.selectedColor,
              dots: [
                { "key": "vacation", "color": "red", "selectedDotColor": "red" }
              ]
            }
          })
          console.log("add event success")
          return res.status(200).json({
            code: 200,
            message: "success",
            result: null
          })
        }
      }, (_) => {
        console.log("data not found, failed")
        child.set({
          eventsList: [request.eventsList],
          calendar: {
            markedData: request.calendar.markedData,
            selected: false,
            selectedColor: request.calendar.selectedColor,
            dots: [
              { "key": "vacation", "color": "red", "selectedDotColor": "red" }
            ]
          }
        })
        console.log("add event success")
        return res.status(200).json({
          code: 200,
          message: "success",
          result: null
        })
      })
      setNotification(convertEmail, request.eventsList.eventId, request.eventsList.time, request.eventsList.title, request.eventsList.detail, selectedDate)
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/getEvents", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("events")
      const child = ref.child(convertEmail)
      const currentDate = moment().format("YYYY/MM/DD").split('/').join('-')
      const childCurrentDate = ref.child(convertEmail).child(currentDate)

      // UPDATE CurrentDate to TRUE
      childCurrentDate.get().then((snapshot) => {
        if (snapshot.exists()) {
          let values = snapshot.val()
          let calendar = values.calendar
          let eventsList = values.eventsList
          var newCalendar = {}
          console.log("CurrentDate", calendar.markedData, currentDate)
          if (calendar.markedData == currentDate) {
            newCalendar = {
              "markedData": calendar.markedData,
              "selected": true,
              "selectedColor": calendar.selectedColor,
              "dots": calendar.dots
            }
          } else {
            newCalendar = {
              "markedData": calendar.markedData,
              "selected": false,
              "selectedColor": calendar.selectedColor,
              "dots": calendar.dots
            }
          }

          childCurrentDate.set({
            eventsList: eventsList,
            calendar: newCalendar
          })
        }
      }, (_) => {
        console.log("No data to UPDATE to TRUE")
      })

      // UPDATE Other date to false
      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          let values = snapshot.val()
          Object.keys(values).forEach((val) => {
            const childKey = ref.child(convertEmail)
            if (val != currentDate) {
              var updates = {}
              updates[val + '/calendar/selected'] = false
              childKey.update(updates)
            }
          })

          // childCurrentDate.set({
          //   eventsList: eventsList,
          //   calendar: newCalendar
          // })
        } else {
          console.log("No data to UPDATE to FALSE")
        }
      }, (_) => {
        console.log("No data to UPDATE to FALSE")
      })

      // GET EVETNS
      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          let values = snapshot.val()
          let keys = Object.keys(values)
          var calendarList = []
          var currentEvent = {}
          keys.forEach((key) => {
            if (currentDate == key) {
              console.log("currentDate == key")
              currentEvent = values[key].eventsList
            }
            calendarList.push(values[key].calendar)
          })

          console.log("get events success")
          return res.status(200).json({
            code: 200,
            message: "success",
            result: {
              calendar: calendarList,
              eventsList: currentEvent
            }
          })
        } else {
          console.log("data not found, success")
          return res.status(200).json({
            code: 200,
            message: "not found",
            result: null
          })
        }
      }, (_) => {
        console.log("data not found, failed")
        return res.status(200).json({
          code: 200,
          message: "not found",
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/getEventsByDate", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const selectedDate = request.selectedDate
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const currentDate = moment().format("YYYY/MM/DD").split('/').join('-')
      const ref = database.ref("events")
      const child = ref.child(convertEmail).child(selectedDate)
      const childCurrentDate = ref.child(convertEmail).child(currentDate)

      // UPDATE CurrentDate to TRUE
      childCurrentDate.get().then((snapshot) => {
        if (snapshot.exists()) {
          let values = snapshot.val()
          let calendar = values.calendar
          let eventsList = values.eventsList
          var newCalendar = {}
          console.log(calendar.markedData, currentDate)
          if (calendar.markedData == currentDate) {
            newCalendar = {
              "markedData": calendar.markedData,
              "selected": true,
              "selectedColor": calendar.selectedColor,
              "dots": calendar.dots
            }
          } else {
            newCalendar = {
              "markedData": calendar.markedData,
              "selected": false,
              "selectedColor": calendar.selectedColor,
              "dots": calendar.dots
            }
          }

          childCurrentDate.set({
            eventsList: eventsList,
            calendar: newCalendar
          })
        }
      }, (_) => {
        console.log("No data to UPDATE to TRUE")
      })

      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          console.log("get event by date success")
          return res.status(200).json({
            code: 200,
            message: "success",
            result: snapshot.val()
          })
        } else {
          console.log("data not found")
          return res.status(200).json({
            code: 200,
            message: "not found",
            result: null
          })
        }
      }, (_) => {
        console.log("data not found, failed")
        return res.status(200).json({
          code: 200,
          message: "not found",
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/getEventsByEventId", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const eventId = request.eventId
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("events")
      const child = ref.child(convertEmail)

      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          let values = snapshot.val()
          Object.keys(values).forEach((val) => {
            values[val].eventsList.forEach((event) => {
              if (eventId == event.eventId) {
                return res.status(200).json({
                  code: 200,
                  message: "success",
                  result: event
                })
              }
            })
          })
        }
      }, (error) => {
        console.log(error)
        return res.status(500).json({
          code: 500,
          message: error.message,
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/deleteEventByEventId", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const eventId = request.eventId
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("events")
      const child = ref.child(convertEmail).child(request.selectedDate)

      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          let values = snapshot.val()
          var newEventsList = []
          var newCalendar = {}
          values.eventsList.forEach((event) => {
            if (eventId != event.eventId) {
              newCalendar = values.calendar
              newEventsList.push(event)
            } else {
              console.log(eventId, event.eventId)
            }
          })

          if (newEventsList.length == 0) {
            console.log("remove all")
            child.remove()

          } else if (newEventsList.length == 1) {
            console.log("remove specific, eventsList", newEventsList.length)
            child.set({
              eventsList: newEventsList,
              calendar: {
                markedData: newCalendar.markedData,
                selected: false,
                selectedColor: newCalendar.selectedColor,
                dots: [
                  { "key": "vacation", "color": "red", "selectedDotColor": "red" }
                ]
              }
            })
          } else if (newEventsList.length == 2) {
            console.log("remove specific, eventsList", newEventsList.length)
            child.set({
              eventsList: newEventsList,
              calendar: {
                markedData: newCalendar.markedData,
                selected: false,
                selectedColor: newCalendar.selectedColor,
                dots: [
                  { "key": "vacation", "color": "red", "selectedDotColor": "red" },
                  { "key": "massage", "color": "blue", "selectedDotColor": "blue" },
                ]
              }
            })
          } else if (newEventsList.length == 3) {
            console.log("remove specific, eventsList", newEventsList.length)
            child.set({
              eventsList: newEventsList,
              calendar: {
                markedData: newCalendar.markedData,
                selected: false,
                selectedColor: newCalendar.selectedColor,
                dots: [
                  { "key": "vacation", "color": "red", "selectedDotColor": "red" },
                  { "key": "massage", "color": "blue", "selectedDotColor": "blue" },
                  { "key": "workout", "color": "black", "selectedDotColor": "black" }
                ]
              }
            })
          } else if (newEventsList.length > 3) {
            console.log("remove specific, eventsList", newEventsList.length)
            child.set({
              eventsList: newEventsList,
              calendar: newCalendar
            })
          }

          return res.status(200).json({
            code: 200,
            message: "success",
            result: null
          })
        }
      }, (error) => {
        console.log(error)
        return res.status(500).json({
          code: 500,
          message: error.message,
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/getProfile", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("users")
      const eventRef = database.ref("events")
      const child = ref.child(convertEmail)
      const childEvent = eventRef.child(convertEmail)

      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          let profileValues = snapshot.val()
          childEvent.get().then((snapshot) => {
            let eventValues = snapshot.val()
            if (eventValues != undefined) {
              let nowDate = moment().format('YYYY-MM-DD')
              var allEventsAmount = 0
              Object.keys(eventValues).forEach((val) => {
                allEventsAmount = allEventsAmount + eventValues[val].eventsList.length
              })
              if (eventValues[nowDate] != undefined) {
                return res.status(200).json({
                  code: 200,
                  message: "success",
                  result: {
                    firstname: profileValues.firstname,
                    lastname: profileValues.lastname,
                    mobileNo: profileValues.mobileNo,
                    email: profileValues.email,
                    allEventsAmount: allEventsAmount,
                    allEventsPerDayAmount: eventValues[nowDate].eventsList.length,
                    notification: true
                  }
                })
              } else {
                return res.status(200).json({
                  code: 200,
                  message: "success",
                  result: {
                    firstname: profileValues.firstname,
                    lastname: profileValues.lastname,
                    mobileNo: profileValues.mobileNo,
                    email: profileValues.email,
                    allEventsAmount: allEventsAmount,
                    allEventsPerDayAmount: 0,
                    notification: true
                  }
                })
              }
            } else {
              return res.status(200).json({
                code: 200,
                message: "success",
                result: {
                  firstname: profileValues.firstname,
                  lastname: profileValues.lastname,
                  mobileNo: profileValues.mobileNo,
                  email: profileValues.email,
                  allEventsAmount: 0,
                  allEventsPerDayAmount: 0,
                  notification: true
                }
              })
            }
          }, (error) => {
            console.log(error)
            return res.status(200).json({
              code: 200,
              message: "not found",
              result: null
            })
          })
        } else {
          console.log("data not found, failed")
          return res.status(200).json({
            code: 200,
            message: "not found",
            result: null
          })
        }
      }, (_) => {
        console.log("data not found, failed")
        return res.status(200).json({
          code: 200,
          message: "not found",
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/updateToggle", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("users")
      const child = ref.child(convertEmail)

      var updates = {}
      updates['/notification'] = request.notification
      child.update(updates)
      return res.status(200).json({
        code: 200,
        message: "success",
        result: null
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/notification", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("users")
      const child = ref.child(convertEmail)

      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          const body = JSON.stringify({
            "to": snapshot.val().notiToken,
            "sound": "default",
            "title": "Test",
            "body": "Test",
            "data": {
              "detail": request.eventId
            }
          });
          let nowDate = moment()
          let selectedDate = moment(new Date(request.selectedDate + " " + request.time), "YYYY-MM-DD HH:mm")
          let diffMilliSecond = selectedDate.diff(nowDate, "milliseconds")
          let notify = ["1 นาที", "2 นาที", "5 นาที", "10 นาที", "30 นาที", "1 ชั่วโมง", "3 ชั่วโมง", "1 วัน", "5 วัน", "15 วัน"]
          console.log('Start timer to Push notification');
          request.notify.forEach((val) => {
            var timer = 0
            if (val == "1 นาที") {
              console.log('1 minute notification');
              timer = diffMilliSecond - (1000 * 60)
            } else if (val == "2 นาที") {
              console.log('2 minute notification');
              timer = diffMilliSecond - (1000 * 60) * 2
            } else if (val == "5 นาที") {
              console.log('5 minute notification');
              timer = diffMilliSecond - (1000 * 60) * 5
            } else if (val == "10 นาที") {
              console.log('10 minute notification');
              timer = diffMilliSecond - (1000 * 60) * 10
            } else if (val == "30 นาที") {
              console.log('30 minute notification');
              timer = diffMilliSecond - (1000 * 60) * 30
            } else if (val == "1 ชั่วโมง") {
              console.log('1 hour notification');
              timer = diffMilliSecond - (1000 * 60) * 60
            } else if (val == "3 ชั่วโมง") {
              console.log('3 hour notification');
              timer = diffMilliSecond - (1000 * 60) * 180
            } else if (val == "1 วัน") {
              console.log('1 day notification');
              timer = diffMilliSecond - (1000 * 60) * 1440
            } else if (val == "5 วัน") {
              console.log('5 day notification');
              timer = diffMilliSecond - (1000 * 60) * 7200
            } else if (val == "15 วัน") {
              console.log('15 day notification');
              timer = diffMilliSecond - (1000 * 60) * 21600
            }
            console.log("timerInMilliSecond", timer)
            if (timer > 0) {
              setTimeout(function () {
                try {
                  fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'X-Custom-Header': 'value',
                      'Accept-encoding': 'gzip, deflate',
                      'Content-Type': 'application/json',
                      'Content-Length': body.length
                    },
                    body: JSON.stringify([body])
                  }).then(res => {
                    console.log('PUSH Notification DONE');
                  }).catch(err => {
                    console.log(error)
                  });
                } catch (error) {
                  console.log(error);
                }
              }, timer);
            }
          })
        }
      }, (_) => {

      })
      res.status(200).json({ status: 'success' });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

const setNotification = (convertEmail, eventId, eventTime, eventTitle, eventDescrption, selectedDateFromFE) => {
  try {
    const ref = database.ref("users")
    const child = ref.child(convertEmail)

    child.get().then((snapshot) => {
      if (snapshot.exists()) {
        const body = JSON.stringify({
          "to": snapshot.val().notiToken,
          "sound": "default",
          "title": eventTitle,
          "body": eventDescrption,
          "data": {
            "detail": eventId
          }
        });
        let nowDate = moment()
        let selectedDate = moment(new Date(selectedDateFromFE + " " + eventTime), "YYYY-MM-DD HH:mm")
        let diffMilliSecond = selectedDate.diff(nowDate, "milliseconds")
        let notify = ["0 นาที", "1 นาที", "2 นาที", "5 นาที", "10 นาที", "15 นาที", "30 นาที", "1 ชั่วโมง", "3 ชั่วโมง", "1 วัน", "5 วัน", "15 วัน"]
        console.log('Start timer to Push notification');
        notify.forEach((val) => {
          var timer = 0
          if (val == "0 นาที") {
            timer = diffMilliSecond
            console.log('notify at that time', timer);
          } else if (val == "1 นาที") {
            timer = diffMilliSecond - (1000 * 60)
            console.log('1 minute notification', timer);
          } else if (val == "2 นาที") {
            timer = diffMilliSecond - (1000 * 60) * 2
            console.log('2 minute notification', timer);
          } else if (val == "5 นาที") {
            timer = diffMilliSecond - (1000 * 60) * 5
            console.log('5 minute notification', timer);
          } else if (val == "10 นาที") {
            timer = diffMilliSecond - (1000 * 60) * 10
            console.log('10 minute notification', timer);
          } else if (val == "15 นาที") {
            timer = diffMilliSecond - (1000 * 60) * 15
            console.log('15 minute notification', timer);
          } else if (val == "30 นาที") {
            timer = diffMilliSecond - (1000 * 60) * 30
            console.log('30 minute notification', timer);
          } else if (val == "1 ชั่วโมง") {
            timer = diffMilliSecond - (1000 * 60) * 60
            console.log('1 hour notification', timer);
          } else if (val == "3 ชั่วโมง") {
            timer = diffMilliSecond - (1000 * 60) * 180
            console.log('3 hour notification', timer);
          } else if (val == "1 วัน") {
            timer = diffMilliSecond - (1000 * 60) * 1440
            console.log('1 day notification', timer);
          } else if (val == "5 วัน") {
            timer = diffMilliSecond - (1000 * 60) * 7200
            console.log('5 day notification', timer);
          } else if (val == "15 วัน") {
            timer = diffMilliSecond - (1000 * 60) * 21600
            console.log('15 day notification', timer);
          }
          if (timer > 0) {
            setTimeout(function () {
              try {
                fetch('https://exp.host/--/api/v2/push/send', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'X-Custom-Header': 'value',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                    'Content-Length': body.length
                  },
                  body: JSON.stringify([body])
                }).then(res => {
                  console.log('PUSH Notification DONE');
                }).catch(err => {
                  console.log(error)
                });
              } catch (error) {
                console.log(error);
              }
            }, timer);
          }
        })
      }
    }, (_) => {

    })
  } catch (error) {
    console.log(error)
  }
}

// Initialzed port
app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
  console.log(`server running on port ${process.env.PORT}`)
})